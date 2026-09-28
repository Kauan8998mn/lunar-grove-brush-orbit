import {
  DEFAULT_CLIENT_PREFERENCES,
  DEFAULT_SCREEN_PREFERENCES,
  DEFAULT_UI_SOUND_PREFERENCES,
  DEFAULT_VOICE_AUDIO_PREFERENCES,
  EVENT_SOUND_OPTIONS,
  type ClientPreferences,
  type ScreenPreferences,
  type ScreenResolutionName,
  type UiSoundEvent,
  type UiSoundId,
  type UiSoundPreferences,
  type VoiceAudioPreferences,
} from "./verdant-config";
import { clamp } from "./utils";

const CLIENT_KEY = "verdant.client.preferences.v4";
const VOICE_KEY = "verdant.voice.audio.preferences.v2";
const SCREEN_KEY = "verdant.screen.preferences.v2";
const SOUND_KEY = "verdant.ui-sounds.v2";
const IDENTITY_KEY = "verdant.identity.v1";

export interface Identity {
  memberId: string;
  displayName: string;
  avatarData?: string | null;
}

function readJson<T>(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function loadIdentity(): Identity | null {
  const raw = readJson(IDENTITY_KEY) as Partial<Identity> | null;
  if (!raw?.memberId || !raw.displayName) return null;
  return {
    memberId: String(raw.memberId).slice(0, 64),
    displayName: String(raw.displayName).slice(0, 32),
    avatarData: typeof raw.avatarData === "string" ? raw.avatarData : null,
  };
}

export function saveIdentity(identity: Identity): Identity {
  writeJson(IDENTITY_KEY, identity);
  return identity;
}

export function loadClientPreferences(): ClientPreferences {
  const raw = (readJson(CLIENT_KEY) ?? {}) as Partial<ClientPreferences>;
  return {
    backgroundColor: /^#[0-9a-fA-F]{6}$/.test(raw.backgroundColor ?? "")
      ? (raw.backgroundColor as string)
      : DEFAULT_CLIENT_PREFERENCES.backgroundColor,
    overlay: Boolean(raw.overlay),
    overlayOpacity: clamp(Number(raw.overlayOpacity ?? 0.72), 0.45, 0.95),
    uiScale: clamp(Number(raw.uiScale ?? 1), 0.8, 1.35),
    speakingColor: /^#[0-9a-fA-F]{6}$/.test(raw.speakingColor ?? "")
      ? (raw.speakingColor as string)
      : DEFAULT_CLIENT_PREFERENCES.speakingColor,
    speakingGlow: clamp(Number(raw.speakingGlow ?? 0.68), 0, 1),
    panelBlur: clamp(Number(raw.panelBlur ?? 18), 0, 32),
  };
}

export function saveClientPreferences(prefs: ClientPreferences): ClientPreferences {
  writeJson(CLIENT_KEY, prefs);
  applyClientPreferences(prefs);
  return prefs;
}

export function loadVoicePreferences(): VoiceAudioPreferences {
  const raw = (readJson(VOICE_KEY) ?? {}) as Partial<VoiceAudioPreferences>;
  return {
    ...DEFAULT_VOICE_AUDIO_PREFERENCES,
    ...raw,
    suppressorModel: raw.suppressorModel === "verdant" ? "verdant" : "standard",
    suppressionLevel:
      raw.suppressionLevel === "low" || raw.suppressionLevel === "high" || raw.suppressionLevel === "maximum"
        ? raw.suppressionLevel
        : "medium",
    voiceDetectionMode: raw.voiceDetectionMode === "manual" ? "manual" : "auto",
    manualThresholdDb: clamp(Number(raw.manualThresholdDb ?? -42), -60, -20),
  };
}

export function saveVoicePreferences(prefs: VoiceAudioPreferences): VoiceAudioPreferences {
  writeJson(VOICE_KEY, prefs);
  return prefs;
}

export function loadScreenPreferences(): ScreenPreferences {
  const raw = (readJson(SCREEN_KEY) ?? {}) as Partial<ScreenPreferences>;
  const resolution: ScreenResolutionName =
    raw.resolution === "720p" || raw.resolution === "1440p" || raw.resolution === "2160p" || raw.resolution === "1080p"
      ? raw.resolution
      : "1080p";
  return {
    resolution,
    fps: raw.fps === 30 ? 30 : 60,
    includeAudio: raw.includeAudio !== false,
    sourcePreference:
      raw.sourcePreference === "monitor" || raw.sourcePreference === "window" || raw.sourcePreference === "browser"
        ? raw.sourcePreference
        : "any",
    bitrateKbps: clamp(Number(raw.bitrateKbps ?? 0), 0, 25000),
  };
}

export function saveScreenPreferences(prefs: ScreenPreferences): ScreenPreferences {
  writeJson(SCREEN_KEY, prefs);
  return prefs;
}

export function loadSoundPreferences(): UiSoundPreferences {
  const raw = (readJson(SOUND_KEY) ?? {}) as Partial<UiSoundPreferences>;
  const events = { ...DEFAULT_UI_SOUND_PREFERENCES.events };
  for (const key of Object.keys(events) as UiSoundEvent[]) {
    const candidate = raw.events?.[key];
    if (!candidate) continue;
    const allowed = EVENT_SOUND_OPTIONS[key];
    events[key] = {
      enabled: candidate.enabled !== false,
      soundId: allowed.includes(candidate.soundId as UiSoundId) ? (candidate.soundId as UiSoundId) : events[key].soundId,
      volume: clamp(Number(candidate.volume ?? 70), 0, 100),
    };
  }
  return {
    enabled: raw.enabled !== false,
    masterVolume: clamp(Number(raw.masterVolume ?? 70), 0, 100),
    events,
  };
}

export function saveSoundPreferences(prefs: UiSoundPreferences): UiSoundPreferences {
  writeJson(SOUND_KEY, prefs);
  return prefs;
}

export function applyClientPreferences(prefs: ClientPreferences) {
  const root = document.documentElement;
  const hex = prefs.backgroundColor;
  const rgb = hexToRgb(hex) ?? { r: 8, g: 16, b: 15 };
  const light = (Math.max(rgb.r, rgb.g, rgb.b) + Math.min(rgb.r, rgb.g, rgb.b)) / 510 >= 0.5;
  const mix = (a: Rgb, b: Rgb, t: number): Rgb => ({
    r: Math.round(a.r * (1 - t) + b.r * t),
    g: Math.round(a.g * (1 - t) + b.g * t),
    b: Math.round(a.b * (1 - t) + b.b * t),
  });
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const bg0 = light ? rgb : mix(rgb, black, 0.18);
  const bg1 = light ? mix(rgb, black, 0.04) : mix(rgb, white, 0.04);
  const bg2 = light ? mix(rgb, black, 0.08) : mix(rgb, white, 0.08);
  const bg3 = light ? mix(rgb, black, 0.12) : mix(rgb, white, 0.13);
  const fg = light ? { r: 18, g: 22, b: 21 } : { r: 220, g: 232, b: 229 };
  const muted = light ? { r: 70, g: 80, b: 78 } : { r: 135, g: 153, b: 149 };
  const accent = light ? mix(rgb, black, 0.32) : mix(rgb, white, 0.5);
  const set = (name: string, c: Rgb) => root.style.setProperty(name, `rgb(${c.r} ${c.g} ${c.b})`);
  set("--color-bg", bg0);
  set("--color-surface", bg1);
  set("--color-raised", bg2);
  set("--color-inset", bg3);
  set("--color-fg", fg);
  set("--color-muted", muted);
  set("--color-accent", accent);
  set("--color-accent-fg", light ? white : { r: 8, g: 14, b: 13 });
  const speak = hexToRgb(prefs.speakingColor) ?? { r: 145, g: 212, b: 199 };
  set("--color-speaking", speak);
  root.style.setProperty("--speaking-glow", `rgba(${speak.r}, ${speak.g}, ${speak.b}, ${(0.12 + prefs.speakingGlow * 0.5).toFixed(3)})`);
  root.style.setProperty("--panel-blur", `${Math.round(prefs.panelBlur)}px`);
  root.style.setProperty("--ui-scale", String(prefs.uiScale));
  root.style.setProperty("--app-opacity", prefs.overlay ? String(Math.max(0.35, prefs.overlayOpacity)) : "1");
  root.dataset.light = light ? "true" : "false";
  root.dataset.overlay = prefs.overlay ? "true" : "false";
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(value: string): Rgb | undefined {
  const m = /^#([0-9a-f]{6})$/i.exec(value);
  if (!m) return;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export async function playUiSound(prefs: UiSoundPreferences, event: UiSoundEvent) {
  if (!prefs.enabled) return;
  const spec = prefs.events[event];
  if (!spec.enabled) return;
  const def = (await import("./verdant-config")).UI_SOUND_LIBRARY[spec.soundId];
  const audio = new Audio(def.url);
  audio.volume = clamp((prefs.masterVolume / 100) * (spec.volume / 100), 0, 1);
  void audio.play().catch(() => {});
}

export async function prepareAvatar(file: File): Promise<string> {
  if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) throw new Error("Use PNG, JPEG ou WebP.");
  const bitmap = await createImageBitmap(file);
  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponível.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const sx = Math.floor((bitmap.width - side) / 2);
    const sy = Math.floor((bitmap.height - side) / 2);
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, 256, 256);
    return canvas.toDataURL("image/webp", 0.84);
  } finally {
    bitmap.close();
  }
}
