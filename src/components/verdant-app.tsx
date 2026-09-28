import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Hash,
  Headphones,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Plus,
  Settings,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsOverlay } from "@/components/settings-overlay";
import {
  createChannel,
  createServer,
  getServerBundle,
  joinServer,
  listMessages,
  listServers,
  postMessage,
  updateProfile,
} from "@/lib/server/rooms";
import {
  applyClientPreferences,
  loadClientPreferences,
  loadIdentity,
  loadScreenPreferences,
  loadSoundPreferences,
  loadVoicePreferences,
  playUiSound,
  saveClientPreferences,
  saveIdentity,
  saveScreenPreferences,
  saveSoundPreferences,
  saveVoicePreferences,
  type Identity,
} from "@/lib/preferences";
import {
  MAX_PARTICIPANTS,
  SCREEN_RESOLUTIONS,
  DEFAULT_CLIENT_PREFERENCES,
  DEFAULT_SCREEN_PREFERENCES,
  DEFAULT_UI_SOUND_PREFERENCES,
  DEFAULT_VOICE_AUDIO_PREFERENCES,
  type ChannelInfo,
  type ClientPreferences,
  type MemberInfo,
  type MessageInfo,
  type ScreenPreferences,
  type ServerInfo,
  type UiSoundPreferences,
  type VoiceAudioPreferences,
} from "@/lib/verdant-config";
import { useMediaRoom } from "@/lib/multiplayer/use-media-room";
import { cn, formatTime, newId } from "@/lib/utils";

export function VerdantApp({ invite }: { invite?: string }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [server, setServer] = useState<ServerInfo | null>(null);
  const [channels, setChannels] = useState<ChannelInfo[]>([]);
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [draft, setDraft] = useState("");
  const [voiceChannel, setVoiceChannel] = useState<ChannelInfo | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [client, setClient] = useState<ClientPreferences>(DEFAULT_CLIENT_PREFERENCES);
  const [voice, setVoice] = useState<VoiceAudioPreferences>(DEFAULT_VOICE_AUDIO_PREFERENCES);
  const [screen, setScreen] = useState<ScreenPreferences>(DEFAULT_SCREEN_PREFERENCES);
  const [sounds, setSounds] = useState<UiSoundPreferences>(DEFAULT_UI_SOUND_PREFERENCES);
  const [code, setCode] = useState(invite ?? "");
  const [newServerName, setNewServerName] = useState("");
  const [busy, setBusy] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"chat" | "channels" | "members">("chat");
  const [shareMenu, setShareMenu] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const media = useMediaRoom({
    room: voiceChannel ? `vc${voiceChannel.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 62)}` : "idle",
    selfId: identity?.memberId ?? "pending",
    name: identity?.displayName ?? "",
    voice,
    enabled: Boolean(identity && voiceChannel),
  });

  useEffect(() => {
    const stored = loadIdentity();
    if (stored) setIdentity(stored);
    const prefs = loadClientPreferences();
    setClient(prefs);
    applyClientPreferences(prefs);
    setVoice(loadVoicePreferences());
    setScreen(loadScreenPreferences());
    setSounds(loadSoundPreferences());
    void listServers().then(setServers).catch(() => {});
  }, []);

  useEffect(() => {
    if (!server || !identity) return;
    let cancel = false;
    const tick = async () => {
      try {
        const bundle = await getServerBundle({ data: { serverId: server.id, memberId: identity.memberId } });
        if (cancel) return;
        setServer(bundle.server);
        setChannels(bundle.channels);
        setMembers(bundle.members);
        setChannel((cur) => {
          if (cur && bundle.channels.some((c) => c.id === cur.id)) return cur;
          return bundle.channels.find((c) => c.type === "text") ?? bundle.channels[0] ?? null;
        });
      } catch {
        /* ignore */
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 8000);
    return () => {
      cancel = true;
      window.clearInterval(id);
    };
  }, [server?.id, identity?.memberId]);

  useEffect(() => {
    if (!channel || channel.type !== "text") return;
    void listMessages({ data: { channelId: channel.id } }).then(setMessages).catch(() => {});
  }, [channel?.id]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    return media.onChat((_from, payload) => {
      const msg = payload as MessageInfo;
      if (msg?.channelId) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        if (msg.authorId !== identity?.memberId) void playUiSound(sounds, "messageReceived");
      }
    });
  }, [media.onChat, identity?.memberId, sounds]);

  const persistClient = (next: ClientPreferences) => {
    setClient(next);
    saveClientPreferences(next);
  };
  const persistIdentity = (next: Identity) => {
    setIdentity(next);
    saveIdentity(next);
    if (server) {
      void updateProfile({
        data: {
          serverId: server.id,
          memberId: next.memberId,
          displayName: next.displayName,
          avatarData: next.avatarData,
        },
      }).catch((err) => toast.error(err instanceof Error ? err.message : "Falha ao salvar perfil"));
    }
  };

  const enter = async (action: "join" | "create" | "bosque") => {
    if (!identity) return;
    setBusy(true);
    try {
      if (action === "create") {
        const created = await createServer({
          data: {
            name: newServerName.trim() || "Sala",
            memberId: identity.memberId,
            displayName: identity.displayName,
            avatarData: identity.avatarData,
          },
        });
        const bundle = await getServerBundle({ data: { serverId: created.id, memberId: identity.memberId } });
        setServer(bundle.server);
        setChannels(bundle.channels);
        setMembers(bundle.members);
        setChannel(bundle.channels.find((c) => c.type === "text") ?? null);
      } else {
        const target = action === "bosque" ? "BOSQUE" : code.trim();
        const joined = await joinServer({
          data: {
            code: target,
            memberId: identity.memberId,
            displayName: identity.displayName,
            avatarData: identity.avatarData,
          },
        });
        const bundle = await getServerBundle({ data: { serverId: joined.id, memberId: identity.memberId } });
        setServer(bundle.server);
        setChannels(bundle.channels);
        setMembers(bundle.members);
        setChannel(bundle.channels.find((c) => c.type === "text") ?? null);
      }
      const latest = await listServers();
      setServers(latest);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    if (!identity || !server || !channel || channel.type !== "text") return;
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    try {
      const msg = await postMessage({
        data: {
          serverId: server.id,
          channelId: channel.id,
          authorId: identity.memberId,
          authorName: identity.displayName,
          content,
        },
      });
      setMessages((prev) => [...prev, msg]);
      media.sendChat(msg);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao enviar.");
    }
  };

  const voiceMembers = useMemo(() => {
    const live = new Map<string, { name: string; speaking: boolean; muted: boolean; sharing: boolean }>();
    if (identity && voiceChannel) {
      live.set(identity.memberId, {
        name: identity.displayName,
        speaking: media.speaking,
        muted: media.muted,
        sharing: media.sharing,
      });
    }
    for (const peer of media.peers) {
      const state = media.peerState[peer.id];
      live.set(peer.id, {
        name: peer.name || peer.id,
        speaking: Boolean(state?.speaking),
        muted: Boolean(state?.muted),
        sharing: Boolean(state?.sharing),
      });
    }
    return [...live.entries()];
  }, [identity, voiceChannel, media.speaking, media.muted, media.sharing, media.peers, media.peerState]);

  const screenTiles = useMemo(() => {
    const tiles: Array<{ id: string; name: string; stream: MediaStream; local?: boolean }> = [];
    if (media.localScreenStream) {
      tiles.push({
        id: "local",
        name: identity?.displayName ?? "Você",
        stream: media.localScreenStream,
        local: true,
      });
    }
    const seen = new Set<string>();
    for (const remote of media.remoteStreams) {
      if (remote.kind !== "video") continue;
      if (seen.has(remote.stream.id)) continue;
      seen.add(remote.stream.id);
      const name = media.peers.find((p) => p.id === remote.peerId)?.name ?? "Tela";
      tiles.push({ id: remote.stream.id, name, stream: remote.stream });
    }
    return tiles;
  }, [media.localScreenStream, media.remoteStreams, media.peers, identity?.displayName]);

  if (!identity) {
    return (
      <Gate
        title="Como você quer aparecer?"
        subtitle="Só um nome. Sem conta, e-mail ou VPN."
      >
        <Input
          autoFocus
          maxLength={32}
          placeholder="Seu nome"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && nameDraft.trim()) {
              const next = { memberId: newId("u"), displayName: nameDraft.trim() };
              saveIdentity(next);
              setIdentity(next);
            }
          }}
        />
        <Button
          disabled={!nameDraft.trim()}
          onClick={() => {
            const next = { memberId: newId("u"), displayName: nameDraft.trim() };
            saveIdentity(next);
            setIdentity(next);
          }}
        >
          Continuar
        </Button>
      </Gate>
    );
  }

  if (!server) {
    return (
      <Gate title={`Olá, ${identity.displayName}`} subtitle="Entre em uma sala ou crie a sua. Até 16 pessoas, pela internet.">
        <Button disabled={busy} onClick={() => void enter("bosque")}>
          Entrar no Bosque
        </Button>
        <div className="grid gap-2">
          <Input
            placeholder="Código de convite"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") void enter("join");
            }}
          />
          <Button variant="secondary" disabled={busy || code.trim().length < 4} onClick={() => void enter("join")}>
            Entrar com convite
          </Button>
        </div>
        <div className="grid gap-2">
          <Input
            placeholder="Nome da nova sala"
            value={newServerName}
            onChange={(e) => setNewServerName(e.target.value)}
          />
          <Button variant="outline" disabled={busy} onClick={() => void enter("create")}>
            Criar sala
          </Button>
        </div>
        {servers.length > 0 && (
          <ul className="space-y-1 text-sm text-muted">
            {servers.map((s) => (
              <li key={s.id}>
                {s.name} · {s.memberCount}/{MAX_PARTICIPANTS} · convite {s.inviteCode}
              </li>
            ))}
          </ul>
        )}
      </Gate>
    );
  }

  const textChannels = channels.filter((c) => c.type === "text");
  const voiceChannels = channels.filter((c) => c.type === "voice");

  return (
    <div className="app-shell">
      <Toaster theme="dark" position="bottom-right" />
      <nav className="hidden flex-col items-center gap-3 border-r border-line bg-bg py-3 md:flex">
        <div className="grid size-11 place-items-center rounded-2xl bg-accent font-display text-lg text-accent-fg">V</div>
        <span className="h-px w-8 bg-line" />
        {servers.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.name}
            onClick={() => {
              if (s.id === server.id) return;
              setServer(s);
              setVoiceChannel(null);
            }}
            className={cn(
              "grid size-11 place-items-center rounded-2xl bg-raised text-sm font-semibold transition-all",
              s.id === server.id && "rounded-[14px] bg-accent text-accent-fg",
            )}
          >
            {s.name.slice(0, 2).toUpperCase()}
          </button>
        ))}
        <button
          type="button"
          className="grid size-11 place-items-center rounded-2xl bg-raised text-accent"
          onClick={() => setServer(null)}
          title="Nova sala"
        >
          <Plus className="size-5" />
        </button>
      </nav>

      <aside className={cn("glass-panel flex-col border-r border-line", mobilePanel === "channels" ? "flex" : "hidden md:flex")}>
        <header className="flex h-14 items-center justify-between border-b border-line px-3">
          <div className="min-w-0">
            <p className="truncate font-semibold">{server.name}</p>
            <p className="truncate text-[11px] text-muted">convite {server.inviteCode}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} aria-label="Configurações">
            <Settings className="size-4" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <Group
            title="Texto"
            onAdd={async () => {
              const name = window.prompt("Nome do canal");
              if (!name || !identity) return;
              await createChannel({ data: { serverId: server.id, memberId: identity.memberId, name, type: "text" } });
              const bundle = await getServerBundle({ data: { serverId: server.id, memberId: identity.memberId } });
              setChannels(bundle.channels);
            }}
          >
            {textChannels.map((c) => (
              <ChannelRow
                key={c.id}
                icon={<Hash className="size-4" />}
                label={c.name}
                active={channel?.id === c.id}
                onClick={() => {
                  setChannel(c);
                  setMobilePanel("chat");
                }}
              />
            ))}
          </Group>
          <Group
            title="Voz"
            onAdd={async () => {
              const name = window.prompt("Nome do canal de voz");
              if (!name || !identity) return;
              await createChannel({ data: { serverId: server.id, memberId: identity.memberId, name, type: "voice" } });
              const bundle = await getServerBundle({ data: { serverId: server.id, memberId: identity.memberId } });
              setChannels(bundle.channels);
            }}
          >
            {voiceChannels.map((c) => (
              <div key={c.id}>
                <ChannelRow
                  icon={<Volume2 className="size-4" />}
                  label={c.name}
                  active={voiceChannel?.id === c.id}
                  onClick={() => {
                    setVoiceChannel(c);
                    setChannel(c);
                  }}
                />
                {voiceChannel?.id === c.id &&
                  voiceMembers.map(([id, info]) => (
                    <div key={id} className="ml-7 flex items-center gap-2 py-1 text-xs text-muted">
                      <Avatar name={info.name} size="sm" speaking={info.speaking} />
                      <span className="truncate">{info.name}</span>
                      {info.muted && <MicOff className="size-3" />}
                      {info.sharing && <MonitorUp className="size-3 text-accent" />}
                    </div>
                  ))}
              </div>
            ))}
          </Group>
        </div>
        <footer className="flex items-center gap-2 border-t border-line p-2">
          <Avatar name={identity.displayName} src={identity.avatarData} speaking={media.speaking} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{identity.displayName}</p>
            <p className="truncate text-[11px] text-muted">
              {voiceChannel ? `em ${voiceChannel.name}` : "offline"}
            </p>
          </div>
          <IconToggle active={!media.muted} onClick={() => media.setMuted(!media.muted)} label="Microfone">
            {media.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </IconToggle>
          <IconToggle active={!media.deafened} onClick={() => media.setDeafened(!media.deafened)} label="Áudio">
            {media.deafened ? <VolumeX className="size-4" /> : <Headphones className="size-4" />}
          </IconToggle>
        </footer>
      </aside>

      <main className={cn("flex min-w-0 flex-col bg-bg", mobilePanel === "chat" ? "flex" : "hidden md:flex")}>
        <header className="flex h-14 items-center gap-2 border-b border-line px-4">
          <button type="button" className="md:hidden" onClick={() => setMobilePanel("channels")}>
            <Hash className="size-4" />
          </button>
          {channel?.type === "voice" ? <Volume2 className="size-4 text-muted" /> : <Hash className="size-4 text-muted" />}
          <h1 className="font-semibold">{channel?.name ?? "canal"}</h1>
          <span className="ml-auto hidden text-xs text-muted sm:inline">
            {members.length}/{MAX_PARTICIPANTS} · {SCREEN_RESOLUTIONS[screen.resolution].label} {screen.fps}fps
          </span>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobilePanel("members")}>
            <Users className="size-4" />
          </Button>
        </header>

        {channel?.type === "voice" ? (
          <VoiceStage
            tiles={screenTiles}
            members={voiceMembers}
            sharing={media.sharing}
            shareMenu={shareMenu}
            screen={screen}
            onToggleShareMenu={() => setShareMenu((v) => !v)}
            onStart={async () => {
              try {
                await media.startScreen(screen);
                setShareMenu(false);
                void playUiSound(sounds, "screenStart");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Não foi possível capturar a tela.");
              }
            }}
            onStop={() => {
              media.stopScreen();
              void playUiSound(sounds, "screenStop");
            }}
            onLeave={() => {
              setVoiceChannel(null);
              setChannel(textChannels[0] ?? null);
            }}
          />
        ) : (
          <>
            <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="font-display text-2xl">#{channel?.name}</p>
                    <p className="mt-1 text-sm text-muted">Comece a conversa nesta sala.</p>
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <article key={m.id} className="mb-3 flex gap-3">
                  <Avatar
                    name={m.authorName}
                    src={members.find((x) => x.memberId === m.authorId)?.avatarData}
                  />
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{m.authorName}</span>
                      <span className="ml-2 text-[11px] text-faint">{formatTime(m.createdAt)}</span>
                    </p>
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{m.content}</p>
                  </div>
                </article>
              ))}
            </div>
            <form
              className="p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Input
                value={draft}
                placeholder={`Mensagem em #${channel?.name ?? ""}`}
                onChange={(e) => setDraft(e.target.value)}
              />
            </form>
          </>
        )}
      </main>

      <aside className={cn("glass-panel flex-col border-l border-line", mobilePanel === "members" ? "flex" : "hidden md:flex")}>
        <header className="flex h-14 items-center px-4 text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
          Membros — {members.length}/{MAX_PARTICIPANTS}
        </header>
        <div className="flex-1 overflow-y-auto px-2">
          {members.map((m) => (
            <div key={m.memberId} className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <Avatar name={m.displayName} src={m.avatarData} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm">{m.displayName}</p>
                <p className="text-[11px] text-faint">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {settingsOpen && identity && (
        <SettingsOverlay
          identity={identity}
          serverName={server.name}
          peers={media.peers}
          inputLevel={media.inputLevel}
          client={client}
          voice={voice}
          screen={screen}
          sounds={sounds}
          devices={{ inputs: [], outputs: [] }}
          onClose={() => setSettingsOpen(false)}
          onIdentity={persistIdentity}
          onClient={persistClient}
          onVoice={(next) => {
            setVoice(next);
            saveVoicePreferences(next);
          }}
          onScreen={(next) => {
            setScreen(next);
            saveScreenPreferences(next);
          }}
          onSounds={(next) => {
            setSounds(next);
            saveSoundPreferences(next);
          }}
        />
      )}
    </div>
  );
}

function Gate({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 text-fg">
      <Toaster theme="dark" position="bottom-right" />
      <div className="w-full max-w-md rounded-xl bg-surface p-8 ring-1 ring-line">
        <p className="font-display text-sm tracking-[0.2em] text-accent uppercase">Verdant</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-6 grid gap-3">{children}</div>
      </div>
    </main>
  );
}

function Group({ title, children, onAdd }: { title: string; children: ReactNode; onAdd: () => void }) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">{title}</p>
        <button type="button" className="text-faint hover:text-fg" onClick={() => void onAdd()} aria-label={`Criar ${title}`}>
          <Plus className="size-3.5" />
        </button>
      </div>
      {children}
    </div>
  );
}

function ChannelRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
        active ? "bg-raised text-fg" : "text-muted hover:bg-raised/70 hover:text-fg",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function IconToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn("grid size-8 place-items-center rounded-md", active ? "text-fg hover:bg-raised" : "text-danger")}
    >
      {children}
    </button>
  );
}

function VoiceStage({
  tiles,
  members,
  sharing,
  shareMenu,
  screen,
  onToggleShareMenu,
  onStart,
  onStop,
  onLeave,
}: {
  tiles: Array<{ id: string; name: string; stream: MediaStream; local?: boolean }>;
  members: Array<[string, { name: string; speaking: boolean; muted: boolean; sharing: boolean }]>;
  sharing: boolean;
  shareMenu: boolean;
  screen: ScreenPreferences;
  onToggleShareMenu: () => void;
  onStart: () => void;
  onStop: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid flex-1 auto-rows-fr gap-3 overflow-auto p-4">
        {tiles.length === 0 ? (
          <div className="grid place-items-center rounded-lg bg-surface ring-1 ring-line">
            <div className="flex flex-wrap justify-center gap-6 p-8">
              {members.map(([id, info]) => (
                <div key={id} className="grid justify-items-center gap-2">
                  <Avatar name={info.name} size="xl" speaking={info.speaking} />
                  <p className="text-sm">{info.name}</p>
                </div>
              ))}
              {members.length === 0 && <p className="text-sm text-muted">Entrando no canal…</p>}
            </div>
          </div>
        ) : (
          <div className={cn("grid h-full gap-3", tiles.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
            {tiles.map((tile) => (
              <ScreenTile key={tile.id} tile={tile} />
            ))}
          </div>
        )}
      </div>
      <div className="relative flex items-center justify-center gap-2 border-t border-line p-3">
        {shareMenu && !sharing && (
          <div className="absolute bottom-16 rounded-lg bg-surface p-4 text-sm ring-1 ring-line">
            <p className="font-medium">Transmitir tela</p>
            <p className="mt-1 text-xs text-muted">
              {SCREEN_RESOLUTIONS[screen.resolution].label} · {screen.fps} fps · áudio{" "}
              {screen.includeAudio ? "ligado" : "off"}
            </p>
            <p className="mt-1 text-xs text-muted">Altere o padrão em Configurações → Tela.</p>
            <Button className="mt-3 w-full" size="sm" onClick={onStart}>
              Começar
            </Button>
          </div>
        )}
        <Button variant={sharing ? "danger" : "secondary"} onClick={sharing ? onStop : onToggleShareMenu}>
          <MonitorUp className="size-4" />
          {sharing ? "Parar tela" : "Tela"}
        </Button>
        <Button variant="danger" onClick={onLeave}>
          <PhoneOff className="size-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}

function ScreenTile({ tile }: { tile: { name: string; stream: MediaStream; local?: boolean } }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = tile.stream;
  }, [tile.stream]);
  return (
    <div className="relative overflow-hidden rounded-lg bg-surface ring-1 ring-line">
      <video ref={ref} autoPlay playsInline muted={tile.local} className="size-full object-contain" />
      <span className="absolute bottom-2 left-2 rounded-md bg-bg/80 px-2 py-0.5 text-xs">{tile.name}</span>
    </div>
  );
}
