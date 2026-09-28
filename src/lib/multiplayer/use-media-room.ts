import { useCallback, useEffect, useRef, useState } from "react";
import { P2PRoom, type PeerInfo } from "./p2p";
import {
  recommendedScreenBitrateKbps,
  SCREEN_RESOLUTIONS,
  type ScreenPreferences,
  type VoiceAudioPreferences,
} from "@/lib/verdant-config";

export interface RemoteStream {
  peerId: string;
  stream: MediaStream;
  kind: "audio" | "video";
  hint: "voice" | "screen";
}

export interface VoicePeerState {
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
  sharing: boolean;
}

interface WireMsg {
  type: string;
  [k: string]: unknown;
}

export interface MediaRoomHandle {
  selfId: string;
  peers: PeerInfo[];
  joined: boolean;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
  sharing: boolean;
  localScreenStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  peerState: Record<string, VoicePeerState>;
  inputLevel: number;
  join: () => Promise<void>;
  leave: () => void;
  setMuted: (muted: boolean) => void;
  setDeafened: (deafened: boolean) => void;
  startScreen: (prefs: ScreenPreferences) => Promise<void>;
  stopScreen: () => void;
  sendChat: (payload: unknown) => void;
  onChat: (fn: (from: string, payload: unknown) => void) => () => void;
}

function captureConstraints(prefs: VoiceAudioPreferences): MediaTrackConstraints {
  return {
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: prefs.noiseSuppression && prefs.suppressorModel === "standard",
    channelCount: 1,
  };
}

export function useMediaRoom(options: {
  room: string;
  selfId: string;
  name: string;
  voice: VoiceAudioPreferences;
  enabled: boolean;
}): MediaRoomHandle {
  const { room, selfId, name, voice, enabled } = options;
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [deafened, setDeafenedState] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [localScreenStream, setLocalScreen] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [peerState, setPeerState] = useState<Record<string, VoicePeerState>>({});
  const [inputLevel, setInputLevel] = useState(0);

  const p2pRef = useRef<P2PRoom | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const micTrack = useRef<MediaStreamTrack | null>(null);
  const screenTracks = useRef<MediaStreamTrack[]>([]);
  const mutedRef = useRef(false);
  const deafenedRef = useRef(false);
  const chatListeners = useRef(new Set<(from: string, payload: unknown) => void>());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const remoteAudioEls = useRef(new Map<string, HTMLAudioElement>());

  const publishState = useCallback(() => {
    p2pRef.current?.send({
      type: "voice-state",
      muted: mutedRef.current,
      deafened: deafenedRef.current,
      sharing: screenTracks.current.length > 0,
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const p2p = new P2PRoom({
      room,
      selfId,
      name,
      onPeersChanged: setPeers,
      onConnected: () => setJoined(true),
      onMessage: (from, data) => {
        const msg = data as WireMsg;
        if (!msg || typeof msg !== "object") return;
        if (msg.type === "voice-state") {
          setPeerState((prev) => ({
            ...prev,
            [from]: {
              muted: Boolean(msg.muted),
              deafened: Boolean(msg.deafened),
              speaking: Boolean(msg.speaking) || prev[from]?.speaking || false,
              sharing: Boolean(msg.sharing),
            },
          }));
        } else if (msg.type === "speaking") {
          setPeerState((prev) => ({
            ...prev,
            [from]: {
              muted: prev[from]?.muted ?? false,
              deafened: prev[from]?.deafened ?? false,
              speaking: Boolean(msg.on),
              sharing: prev[from]?.sharing ?? false,
            },
          }));
        } else if (msg.type === "chat") {
          for (const fn of chatListeners.current) fn(from, msg.payload);
        }
      },
      onTrack: (from, event) => {
        const track = event.track;
        const stream = event.streams[0] ?? new MediaStream([track]);
        const hint: "voice" | "screen" = track.kind === "video" || track.contentHint === "detail" ? "screen" : "voice";
        setRemoteStreams((prev) => {
          const without = prev.filter((s) => !(s.peerId === from && s.stream.id === stream.id && s.kind === track.kind));
          return [...without, { peerId: from, stream, kind: track.kind as "audio" | "video", hint }];
        });
        track.addEventListener("ended", () => {
          setRemoteStreams((prev) => prev.filter((s) => s.stream.id !== stream.id || s.kind !== track.kind));
        });
        if (track.kind === "audio") {
          const el = new Audio();
          el.autoplay = true;
          el.srcObject = stream;
          el.muted = deafenedRef.current;
          void el.play().catch(() => {});
          remoteAudioEls.current.set(`${from}:${stream.id}`, el);
        }
      },
    });
    p2pRef.current = p2p;
    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: captureConstraints(voice), video: false });
        micStream.current = stream;
        const track = stream.getAudioTracks()[0];
        micTrack.current = track;
        if (track) {
          track.enabled = !mutedRef.current;
          p2p.addTrack(track, stream);
        }
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          const level = Math.min(1, rms * 4);
          setInputLevel(level);
          const on = !mutedRef.current && level > 0.08;
          setSpeaking((prev) => {
            if (prev !== on) p2p.send({ type: "speaking", on });
            return on;
          });
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch {
        /* mic denied — still join for receive */
      }
      await p2p.join();
      publishState();
    })();

    return () => {
      cancelAnimationFrame(rafRef.current);
      p2p.close();
      p2pRef.current = null;
      micStream.current?.getTracks().forEach((t) => t.stop());
      screenTracks.current.forEach((t) => t.stop());
      void audioCtxRef.current?.close();
      for (const el of remoteAudioEls.current.values()) {
        el.srcObject = null;
        el.remove();
      }
      remoteAudioEls.current.clear();
      setJoined(false);
      setRemoteStreams([]);
      setPeers([]);
      setLocalScreen(null);
      setSharing(false);
    };
    // voice prefs applied on join; changing them later requires remount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, room, selfId, name]);

  useEffect(() => {
    for (const el of remoteAudioEls.current.values()) el.muted = deafened;
  }, [deafened]);

  const setMuted = useCallback(
    (next: boolean) => {
      mutedRef.current = next;
      setMutedState(next);
      if (micTrack.current) micTrack.current.enabled = !next && !deafenedRef.current;
      publishState();
    },
    [publishState],
  );

  const setDeafened = useCallback(
    (next: boolean) => {
      deafenedRef.current = next;
      setDeafenedState(next);
      if (next) {
        mutedRef.current = true;
        setMutedState(true);
        if (micTrack.current) micTrack.current.enabled = false;
      } else if (micTrack.current) {
        micTrack.current.enabled = !mutedRef.current;
      }
      for (const el of remoteAudioEls.current.values()) el.muted = next;
      publishState();
    },
    [publishState],
  );

  const startScreen = useCallback(
    async (prefs: ScreenPreferences) => {
      const target = SCREEN_RESOLUTIONS[prefs.resolution];
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: target.width, max: 3840 },
          height: { ideal: target.height, max: 2160 },
          frameRate: { ideal: prefs.fps, max: 60 },
        },
        audio: prefs.includeAudio,
      });
      const video = stream.getVideoTracks()[0];
      if (video) {
        video.contentHint = "detail";
        try {
          await video.applyConstraints({
            width: { ideal: target.width },
            height: { ideal: target.height },
            frameRate: { ideal: prefs.fps },
          });
        } catch {
          /* browsers often ignore applyConstraints on display tracks */
        }
        p2pRef.current?.addTrack(video, stream);
        screenTracks.current.push(video);
        video.addEventListener("ended", () => {
          p2pRef.current?.removeTrack(video);
          screenTracks.current = screenTracks.current.filter((t) => t !== video);
          setSharing(screenTracks.current.length > 0);
          setLocalScreen(null);
          publishState();
        });
      }
      for (const audio of stream.getAudioTracks()) {
        audio.contentHint = "music";
        p2pRef.current?.addTrack(audio, stream);
        screenTracks.current.push(audio);
      }
      const settings = video?.getSettings();
      const actualH = settings?.height ?? target.height;
      const scale = Math.max(1, actualH / target.height);
      const bitrate = (prefs.bitrateKbps || recommendedScreenBitrateKbps(prefs.resolution, prefs.fps)) * 1000;
      await p2pRef.current?.configureVideoSenders({
        maxBitrate: bitrate,
        maxFramerate: prefs.fps,
        scaleResolutionDownBy: scale,
      });
      setLocalScreen(stream);
      setSharing(true);
      publishState();
    },
    [publishState],
  );

  const stopScreen = useCallback(() => {
    for (const track of screenTracks.current) {
      p2pRef.current?.removeTrack(track);
    }
    screenTracks.current = [];
    setLocalScreen(null);
    setSharing(false);
    publishState();
  }, [publishState]);

  const sendChat = useCallback((payload: unknown) => {
    p2pRef.current?.send({ type: "chat", payload });
  }, []);

  const onChat = useCallback((fn: (from: string, payload: unknown) => void) => {
    chatListeners.current.add(fn);
    return () => {
      chatListeners.current.delete(fn);
    };
  }, []);

  return {
    selfId,
    peers,
    joined,
    muted,
    deafened,
    speaking,
    sharing,
    localScreenStream,
    remoteStreams,
    peerState,
    inputLevel,
    join: async () => {},
    leave: () => p2pRef.current?.close(),
    setMuted,
    setDeafened,
    startScreen,
    stopScreen,
    sendChat,
    onChat,
  };
}
