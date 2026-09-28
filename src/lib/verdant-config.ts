export const MAX_PARTICIPANTS = 16;
export const MAX_MESSAGE_CHARS = 4000;
export const MAX_SCREEN_SHARES = 4;

export type ScreenResolutionName = "720p" | "1080p" | "1440p" | "2160p";
export type ScreenFps = 30 | 60;
export type ScreenSourcePreference = "any" | "monitor" | "window" | "browser";

export const SCREEN_RESOLUTIONS: Record<ScreenResolutionName, { width: number; height: number; label: string }> = {
  "720p": { width: 1280, height: 720, label: "720p HD" },
  "1080p": { width: 1920, height: 1080, label: "1080p Full HD" },
  "1440p": { width: 2560, height: 1440, label: "1440p QHD" },
  "2160p": { width: 3840, height: 2160, label: "2160p 4K" },
};

export const SCREEN_FPS_OPTIONS: readonly ScreenFps[] = [30, 60];
export const SCREEN_BITRATE_OPTIONS_KBPS = [0, 4000, 8000, 12000, 18000, 25000] as const;

export function recommendedScreenBitrateKbps(resolution: ScreenResolutionName, fps: ScreenFps): number {
  const base: Record<ScreenResolutionName, number> = {
    "720p": 3500,
    "1080p": 8000,
    "1440p": 14000,
    "2160p": 22000,
  };
  return Math.round(base[resolution] * (fps === 60 ? 1.35 : 1));
}

export type NoiseSuppressorModel = "standard" | "verdant";
export type NoiseSuppressionLevel = "low" | "medium" | "high" | "maximum";
export type VoiceDetectionMode = "auto" | "manual";

export interface VoiceAudioPreferences {
  noiseSuppression: boolean;
  suppressorModel: NoiseSuppressorModel;
  suppressionLevel: NoiseSuppressionLevel;
  voiceDetection: boolean;
  voiceDetectionMode: VoiceDetectionMode;
  manualThresholdDb: number;
}

export const DEFAULT_VOICE_AUDIO_PREFERENCES: VoiceAudioPreferences = {
  noiseSuppression: true,
  suppressorModel: "standard",
  suppressionLevel: "medium",
  voiceDetection: true,
  voiceDetectionMode: "auto",
  manualThresholdDb: -42,
};

export interface ClientPreferences {
  backgroundColor: string;
  overlay: boolean;
  overlayOpacity: number;
  uiScale: number;
  speakingColor: string;
  speakingGlow: number;
  panelBlur: number;
}

export const DEFAULT_CLIENT_PREFERENCES: ClientPreferences = {
  backgroundColor: "#08100f",
  overlay: false,
  overlayOpacity: 0.72,
  uiScale: 1,
  speakingColor: "#91d4c7",
  speakingGlow: 0.68,
  panelBlur: 18,
};

export interface ScreenPreferences {
  resolution: ScreenResolutionName;
  fps: ScreenFps;
  includeAudio: boolean;
  sourcePreference: ScreenSourcePreference;
  bitrateKbps: number;
}

export const DEFAULT_SCREEN_PREFERENCES: ScreenPreferences = {
  resolution: "1080p",
  fps: 60,
  includeAudio: true,
  sourcePreference: "any",
  bitrateKbps: 0,
};

export const THEME_PRESETS = [
  { name: "Verdant", color: "#08100f" },
  { name: "Obsidiana", color: "#0a0c0c" },
  { name: "Neve", color: "#f4f7f6" },
  { name: "Oceano", color: "#0a3142" },
  { name: "Âmbar", color: "#4a2f08" },
  { name: "Grafite", color: "#202528" },
] as const;

export const SPEAKING_PRESETS = [
  { name: "Menta", color: "#91d4c7" },
  { name: "Ciano", color: "#59d9ff" },
  { name: "Azul", color: "#6699ff" },
  { name: "Verde", color: "#72e68f" },
  { name: "Laranja", color: "#ffad66" },
  { name: "Branco", color: "#f4f7f6" },
] as const;

export type UiSoundEvent = "messageReceived" | "voiceLeave" | "serverLeave" | "screenStart" | "screenStop";
export type UiSoundId = "message-click" | "message-dog" | "participant-leave" | "screen-start" | "screen-stop";

export const UI_SOUND_LIBRARY: Record<UiSoundId, { id: UiSoundId; label: string; url: string }> = {
  "message-click": { id: "message-click", label: "Click suave", url: "/sounds/message/clicksoundeffect.mp3" },
  "message-dog": { id: "message-dog", label: "Clicker", url: "/sounds/message/dog-clicker.mp3" },
  "participant-leave": { id: "participant-leave", label: "Saída", url: "/sounds/participant-leave/enter-da-game.mp3" },
  "screen-start": { id: "screen-start", label: "Início de tela", url: "/sounds/screen-start/steam-deck-enter-game.mp3" },
  "screen-stop": { id: "screen-stop", label: "Fim de tela", url: "/sounds/screen-stop/switch-sound.mp3" },
};

export const EVENT_SOUND_OPTIONS: Record<UiSoundEvent, UiSoundId[]> = {
  messageReceived: ["message-click", "message-dog"],
  voiceLeave: ["participant-leave"],
  serverLeave: ["participant-leave"],
  screenStart: ["screen-start"],
  screenStop: ["screen-stop"],
};

export interface UiSoundPreferences {
  enabled: boolean;
  masterVolume: number;
  events: Record<UiSoundEvent, { enabled: boolean; soundId: UiSoundId; volume: number }>;
}

export const DEFAULT_UI_SOUND_PREFERENCES: UiSoundPreferences = {
  enabled: true,
  masterVolume: 70,
  events: {
    messageReceived: { enabled: true, soundId: "message-click", volume: 70 },
    voiceLeave: { enabled: true, soundId: "participant-leave", volume: 70 },
    serverLeave: { enabled: true, soundId: "participant-leave", volume: 70 },
    screenStart: { enabled: true, soundId: "screen-start", volume: 70 },
    screenStop: { enabled: true, soundId: "screen-stop", volume: 70 },
  },
};

export type Role = "owner" | "moderator" | "member";
export type ChannelType = "text" | "voice";

export interface ServerInfo {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  memberCount: number;
  createdAt: string;
}

export interface ChannelInfo {
  id: string;
  serverId: string;
  name: string;
  type: ChannelType;
  position: number;
}

export interface MemberInfo {
  memberId: string;
  displayName: string;
  role: Role;
  avatarData?: string | null;
  lastSeen: string;
}

export interface MessageInfo {
  id: string;
  serverId: string;
  channelId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
}
