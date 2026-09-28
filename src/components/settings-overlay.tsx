import { useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  Monitor,
  Palette,
  Search,
  UserRound,
  Volume2,
  Wifi,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/avatar";
import {
  DEFAULT_CLIENT_PREFERENCES,
  DEFAULT_SCREEN_PREFERENCES,
  DEFAULT_UI_SOUND_PREFERENCES,
  DEFAULT_VOICE_AUDIO_PREFERENCES,
  EVENT_SOUND_OPTIONS,
  MAX_PARTICIPANTS,
  SCREEN_RESOLUTIONS,
  SPEAKING_PRESETS,
  THEME_PRESETS,
  UI_SOUND_LIBRARY,
  type ClientPreferences,
  type ScreenPreferences,
  type UiSoundEvent,
  type UiSoundPreferences,
  type VoiceAudioPreferences,
} from "@/lib/verdant-config";
import type { Identity } from "@/lib/preferences";
import { playUiSound, prepareAvatar } from "@/lib/preferences";
import type { PeerInfo } from "@/lib/multiplayer";
import { cn } from "@/lib/utils";

type Page = "profile" | "appearance" | "voice" | "screen" | "notifications" | "network";

const PAGES: Array<{ id: Page; label: string; hint: string; icon: typeof UserRound; keywords: string }> = [
  { id: "profile", label: "Perfil", hint: "Nome e foto nesta sala", icon: UserRound, keywords: "nome foto avatar perfil" },
  { id: "appearance", label: "Aparência", hint: "Tema, escala, brilho de fala", icon: Palette, keywords: "tema cor overlay blur escala" },
  { id: "voice", label: "Voz", hint: "Microfone, ruído, detecção", icon: Volume2, keywords: "microfone ruido vad audio" },
  { id: "screen", label: "Tela", hint: "Resolução até 4K, fps, bitrate", icon: Monitor, keywords: "tela 4k 1080 1440 fps bitrate" },
  { id: "notifications", label: "Notificações", hint: "Sons da interface", icon: Bell, keywords: "som notificação clique" },
  { id: "network", label: "Rede", hint: "STUN, NAT, sem VPN", icon: Wifi, keywords: "rede vpn stun nat ice rtt" },
];

export function SettingsOverlay(props: {
  identity: Identity;
  serverName?: string;
  peers: PeerInfo[];
  inputLevel: number;
  client: ClientPreferences;
  voice: VoiceAudioPreferences;
  screen: ScreenPreferences;
  sounds: UiSoundPreferences;
  devices: { inputs: MediaDeviceInfo[]; outputs: MediaDeviceInfo[] };
  selectedInput?: string;
  onClose: () => void;
  onIdentity: (next: Identity) => void;
  onClient: (next: ClientPreferences) => void;
  onVoice: (next: VoiceAudioPreferences) => void;
  onScreen: (next: ScreenPreferences) => void;
  onSounds: (next: UiSoundPreferences) => void;
}) {
  const [page, setPage] = useState<Page>("profile");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGES;
    return PAGES.filter((p) => `${p.label} ${p.hint} ${p.keywords}`.includes(q));
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex bg-bg/95 text-fg" role="dialog" aria-modal="true" aria-label="Configurações">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-line bg-surface pt-8 max-sm:w-[72px]">
        <div className="px-5 pb-4 max-sm:px-2">
          <p className="font-display text-lg text-fg max-sm:hidden">Configurações</p>
          <p className="mt-0.5 text-xs text-muted max-sm:hidden">Organizadas por assunto</p>
        </div>
        <div className="px-3 pb-3 max-sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar"
              className="h-9 pl-8"
            />
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {filtered.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                  active ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="max-sm:hidden">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line px-8 py-6 max-sm:px-4">
          <div>
            <h2 className="font-display text-2xl tracking-tight">{PAGES.find((p) => p.id === page)?.label}</h2>
            <p className="mt-1 max-w-xl text-sm text-muted">{PAGES.find((p) => p.id === page)?.hint}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={props.onClose} aria-label="Fechar">
            <X className="size-5" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-8 py-6 max-sm:px-4">
          {page === "profile" && <ProfilePage {...props} />}
          {page === "appearance" && <AppearancePage {...props} />}
          {page === "voice" && <VoicePage {...props} />}
          {page === "screen" && <ScreenPage {...props} />}
          {page === "notifications" && <SoundsPage {...props} />}
          {page === "network" && <NetworkPage {...props} />}
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8 max-w-xl">
      <h3 className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">{title}</h3>
      <div className="space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line">{children}</div>
    </section>
  );
}

function ToggleRow({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        className="mt-1 size-4 accent-accent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <strong className="block text-sm font-medium">{title}</strong>
        <small className="text-xs text-muted">{hint}</small>
      </span>
    </label>
  );
}

function RangeRow({
  label,
  min,
  max,
  step,
  value,
  suffix,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between text-sm">
        {label}
        <span className="tabular-nums text-muted">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}

function ProfilePage({
  identity,
  serverName,
  onIdentity,
}: {
  identity: Identity;
  serverName?: string;
  onIdentity: (next: Identity) => void;
}) {
  return (
    <>
      <Section title="Nesta sala">
        <div className="flex items-center gap-4">
          <Avatar name={identity.displayName} src={identity.avatarData} size="xl" />
          <div className="min-w-0">
            <p className="truncate font-medium">{identity.displayName}</p>
            <p className="text-xs text-muted">{serverName ?? "Entre em uma sala para publicar a foto"}</p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/png,image/jpeg,image/webp";
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    const avatarData = await prepareAvatar(file);
                    onIdentity({ ...identity, avatarData });
                  };
                  input.click();
                }}
              >
                Trocar foto
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onIdentity({ ...identity, avatarData: null })}>
                Remover
              </Button>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Nome">
        <Input
          value={identity.displayName}
          maxLength={32}
          onChange={(e) => onIdentity({ ...identity, displayName: e.target.value })}
        />
        <p className="mt-2 text-xs text-muted">Único dentro da sala. Sem conta online — só um apelido neste host.</p>
      </Section>
    </>
  );
}

function AppearancePage({
  client,
  onClient,
  identity,
}: {
  client: ClientPreferences;
  onClient: (next: ClientPreferences) => void;
  identity: Identity;
}) {
  return (
    <>
      <Section title="Tema">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => onClient({ ...client, backgroundColor: p.color })}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm ring-1 ring-line",
                client.backgroundColor.toLowerCase() === p.color && "ring-accent",
              )}
            >
              <span className="size-5 rounded-full ring-1 ring-line" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          Personalizado
          <input
            type="color"
            value={client.backgroundColor}
            onChange={(e) => onClient({ ...client, backgroundColor: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded-sm border-0 bg-transparent"
          />
        </label>
      </Section>
      <Section title="Painéis">
        <ToggleRow
          title="Modo overlay"
          hint="Painéis translúcidos com blur. Útil sobre um jogo em outra janela."
          checked={client.overlay}
          onChange={(overlay) => onClient({ ...client, overlay })}
        />
        <RangeRow
          label="Opacidade"
          min={45}
          max={95}
          value={Math.round(client.overlayOpacity * 100)}
          suffix="%"
          onChange={(v) => onClient({ ...client, overlayOpacity: v / 100 })}
        />
        <RangeRow
          label="Blur"
          min={0}
          max={32}
          value={Math.round(client.panelBlur)}
          suffix=" px"
          onChange={(v) => onClient({ ...client, panelBlur: v })}
        />
        <RangeRow
          label="Escala da interface"
          min={80}
          max={135}
          step={5}
          value={Math.round(client.uiScale * 100)}
          suffix="%"
          onChange={(v) => onClient({ ...client, uiScale: v / 100 })}
        />
      </Section>
      <Section title="Quem está falando">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SPEAKING_PRESETS.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => onClient({ ...client, speakingColor: p.color })}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm ring-1 ring-line",
                client.speakingColor.toLowerCase() === p.color && "ring-accent",
              )}
            >
              <span className="size-5 rounded-full" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
        <RangeRow
          label="Intensidade"
          min={0}
          max={100}
          value={Math.round(client.speakingGlow * 100)}
          suffix="%"
          onChange={(v) => onClient({ ...client, speakingGlow: v / 100 })}
        />
        <div className="speaking-ring mt-2 flex items-center gap-3 rounded-md bg-raised p-3">
          <Avatar name={identity.displayName} src={identity.avatarData} speaking />
          <div>
            <p className="text-sm font-medium">Prévia ao vivo</p>
            <p className="text-xs text-muted">A cor muda sem recarregar o menu.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onClient({ ...DEFAULT_CLIENT_PREFERENCES })}
        >
          Restaurar aparência
        </Button>
      </Section>
    </>
  );
}

function VoicePage({
  voice,
  onVoice,
  inputLevel,
}: {
  voice: VoiceAudioPreferences;
  onVoice: (next: VoiceAudioPreferences) => void;
  inputLevel: number;
}) {
  return (
    <>
      <Section title="Microfone">
        <div className="h-2 overflow-hidden rounded-full bg-inset">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-75"
            style={{ width: `${Math.round(inputLevel * 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted">Nível de entrada neste dispositivo. Fale para testar sem reabrir o menu.</p>
        <ToggleRow
          title="Supressor de ruído"
          hint="Filtra fundo antes do áudio sair. O modelo Padrão usa o Chromium; Verdant usa DSP próprio."
          checked={voice.noiseSuppression}
          onChange={(noiseSuppression) => onVoice({ ...voice, noiseSuppression })}
        />
        <label className="block text-sm">
          Modelo
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={voice.suppressorModel}
            disabled={!voice.noiseSuppression}
            onChange={(e) => onVoice({ ...voice, suppressorModel: e.target.value as VoiceAudioPreferences["suppressorModel"] })}
          >
            <option value="standard">Padrão · Chromium</option>
            <option value="verdant">Verdant · intenso</option>
          </select>
        </label>
        <label className="block text-sm">
          Nível
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={voice.suppressionLevel}
            disabled={!voice.noiseSuppression}
            onChange={(e) =>
              onVoice({ ...voice, suppressionLevel: e.target.value as VoiceAudioPreferences["suppressionLevel"] })
            }
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto</option>
            <option value="maximum">Máximo</option>
          </select>
        </label>
      </Section>
      <Section title="Detecção de voz">
        <ToggleRow
          title="Ativar detecção"
          hint="Fecha o microfone no silêncio e reabre na fala."
          checked={voice.voiceDetection}
          onChange={(voiceDetection) => onVoice({ ...voice, voiceDetection })}
        />
        <label className="block text-sm">
          Modo
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={voice.voiceDetectionMode}
            disabled={!voice.voiceDetection}
            onChange={(e) =>
              onVoice({ ...voice, voiceDetectionMode: e.target.value as VoiceAudioPreferences["voiceDetectionMode"] })
            }
          >
            <option value="auto">Automático</option>
            <option value="manual">Manual</option>
          </select>
        </label>
        {voice.voiceDetection && voice.voiceDetectionMode === "manual" && (
          <RangeRow
            label="Limite"
            min={-60}
            max={-20}
            value={Math.round(voice.manualThresholdDb)}
            suffix=" dBFS"
            onChange={(manualThresholdDb) => onVoice({ ...voice, manualThresholdDb })}
          />
        )}
        <Button variant="secondary" size="sm" onClick={() => onVoice({ ...DEFAULT_VOICE_AUDIO_PREFERENCES })}>
          Restaurar voz
        </Button>
      </Section>
    </>
  );
}

function ScreenPage({ screen, onScreen }: { screen: ScreenPreferences; onScreen: (next: ScreenPreferences) => void }) {
  return (
    <>
      <Section title="Qualidade padrão">
        <p className="text-sm text-muted">
          A captura pede até 4K 60 fps ao navegador. A camada enviada segue o preset abaixo — 1080p60 por
          padrão, bem acima do antigo teto de 720p.
        </p>
        <label className="block text-sm">
          Resolução
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={screen.resolution}
            onChange={(e) =>
              onScreen({ ...screen, resolution: e.target.value as ScreenPreferences["resolution"] })
            }
          >
            {Object.entries(SCREEN_RESOLUTIONS).map(([id, meta]) => (
              <option key={id} value={id}>
                {meta.label} · {meta.width}×{meta.height}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Quadros
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={screen.fps}
            onChange={(e) => onScreen({ ...screen, fps: Number(e.target.value) as 30 | 60 })}
          >
            <option value={30}>30 fps</option>
            <option value={60}>60 fps</option>
          </select>
        </label>
        <label className="block text-sm">
          Bitrate
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={screen.bitrateKbps}
            onChange={(e) => onScreen({ ...screen, bitrateKbps: Number(e.target.value) })}
          >
            <option value={0}>Automático (recomendado)</option>
            <option value={4000}>4 Mbps</option>
            <option value={8000}>8 Mbps</option>
            <option value={12000}>12 Mbps</option>
            <option value={18000}>18 Mbps</option>
            <option value={25000}>25 Mbps</option>
          </select>
        </label>
      </Section>
      <Section title="Captura">
        <ToggleRow
          title="Incluir áudio do sistema"
          hint="Quando o navegador permitir, envia o som da janela junto da imagem."
          checked={screen.includeAudio}
          onChange={(includeAudio) => onScreen({ ...screen, includeAudio })}
        />
        <label className="block text-sm">
          Preferência de origem
          <select
            className="mt-1 h-10 w-full rounded-md border border-line bg-inset px-2"
            value={screen.sourcePreference}
            onChange={(e) =>
              onScreen({ ...screen, sourcePreference: e.target.value as ScreenPreferences["sourcePreference"] })
            }
          >
            <option value="any">Qualquer</option>
            <option value="monitor">Tela inteira</option>
            <option value="window">Janela</option>
            <option value="browser">Aba do navegador</option>
          </select>
        </label>
        <Button variant="secondary" size="sm" onClick={() => onScreen({ ...DEFAULT_SCREEN_PREFERENCES })}>
          Restaurar tela
        </Button>
      </Section>
    </>
  );
}

function SoundsPage({ sounds, onSounds }: { sounds: UiSoundPreferences; onSounds: (next: UiSoundPreferences) => void }) {
  const events: Array<[UiSoundEvent, string, string]> = [
    ["messageReceived", "Mensagem recebida", "Quando outra pessoa envia no canal."],
    ["voiceLeave", "Saída da voz", "Alguém sai do canal em que você está."],
    ["serverLeave", "Saída da sala", "Alguém desconecta da sala."],
    ["screenStart", "Começou a transmitir", "Uma tela entra no palco."],
    ["screenStop", "Parou de transmitir", "Uma tela sai do palco."],
  ];
  return (
    <>
      <Section title="Geral">
        <ToggleRow
          title="Sons da interface"
          hint="Não passa pela chamada. Só cliques e avisos locais."
          checked={sounds.enabled}
          onChange={(enabled) => onSounds({ ...sounds, enabled })}
        />
        <RangeRow
          label="Volume mestre"
          min={0}
          max={100}
          value={sounds.masterVolume}
          suffix="%"
          onChange={(masterVolume) => onSounds({ ...sounds, masterVolume })}
        />
      </Section>
      <Section title="Eventos">
        {events.map(([id, title, hint]) => {
          const spec = sounds.events[id];
          return (
            <div key={id} className="rounded-md bg-raised p-3 ring-1 ring-line">
              <ToggleRow
                title={title}
                hint={hint}
                checked={spec.enabled}
                onChange={(enabled) =>
                  onSounds({ ...sounds, events: { ...sounds.events, [id]: { ...spec, enabled } } })
                }
              />
              <div className="mt-2 flex gap-2">
                <select
                  className="h-9 flex-1 rounded-md border border-line bg-inset px-2 text-sm"
                  value={spec.soundId}
                  onChange={(e) =>
                    onSounds({
                      ...sounds,
                      events: { ...sounds.events, [id]: { ...spec, soundId: e.target.value as typeof spec.soundId } },
                    })
                  }
                >
                  {EVENT_SOUND_OPTIONS[id].map((sid) => (
                    <option key={sid} value={sid}>
                      {UI_SOUND_LIBRARY[sid].label}
                    </option>
                  ))}
                </select>
                <Button size="sm" variant="secondary" onClick={() => void playUiSound(sounds, id)}>
                  Testar
                </Button>
              </div>
              <RangeRow
                label="Volume"
                min={0}
                max={100}
                value={spec.volume}
                suffix="%"
                onChange={(volume) =>
                  onSounds({ ...sounds, events: { ...sounds.events, [id]: { ...spec, volume } } })
                }
              />
            </div>
          );
        })}
        <Button variant="secondary" size="sm" onClick={() => onSounds({ ...DEFAULT_UI_SOUND_PREFERENCES })}>
          Restaurar sons
        </Button>
      </Section>
    </>
  );
}

function NetworkPage({ peers }: { peers: PeerInfo[] }) {
  const pathLabel = (type: string | null) => {
    if (type === "host") return "Rede local";
    if (type === "srflx" || type === "prflx") return "Internet direta (STUN)";
    if (type === "relay") return "Retransmissão (TURN)";
    return "Aguardando ICE";
  };
  return (
    <>
      <Section title="Sem VPN">
        <p className="text-sm leading-relaxed text-muted">
          O sinal vai por HTTPS público. Voz e tela saem em WebRTC ponto a ponto, com STUN (Google, Cloudflare)
          para atravessar NAT. Hamachi/Radmin não são necessários — cada pessoa abre o link no navegador.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Limite da sala: {MAX_PARTICIPANTS} pessoas. A malha de mídia é direta entre os clientes, então a
          qualidade não depende de um SFU na sua casa.
        </p>
      </Section>
      <Section title="Pares conectados">
        {peers.length === 0 ? (
          <p className="text-sm text-muted">Ninguém mais na chamada ainda. Entre em um canal de voz para ver o caminho ICE.</p>
        ) : (
          <ul className="space-y-2">
            {peers.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-md bg-raised px-3 py-2 text-sm">
                <span>{p.name || p.id}</span>
                <span className="text-xs text-muted">
                  {p.connectionState} · {pathLabel(p.candidateType)}
                  {p.rttMs != null ? ` · ${p.rttMs} ms` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
