import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as EVENT_SOUND_OPTIONS, c as SPEAKING_PRESETS, d as recommendedScreenBitrateKbps, i as DEFAULT_VOICE_AUDIO_PREFERENCES, l as THEME_PRESETS, n as DEFAULT_SCREEN_PREFERENCES, o as MAX_MESSAGE_CHARS, r as DEFAULT_UI_SOUND_PREFERENCES, s as SCREEN_RESOLUTIONS, t as DEFAULT_CLIENT_PREFERENCES, u as UI_SOUND_LIBRARY } from "./verdant-config-BzJNCK-j.mjs";
import { n as _enum, o as object, s as string } from "../_libs/zod.mjs";
import { _ as Headphones, a as Users, c as Settings, d as PhoneOff, f as Palette, g as MicOff, h as Mic, i as Volume2, l as Search, m as MonitorUp, n as Wifi, o as UserRound, p as Monitor, r as VolumeX, t as X, u as Plus, v as Hash, y as Bell } from "../_libs/lucide-react.mjs";
import { n as Route$1 } from "./router-Cz_Q1UeF.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CQajQJnk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function newId(prefix = "") {
	return `${prefix}${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`.slice(0, 64);
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
function formatTime(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function clamp(n, min, max) {
	if (!Number.isFinite(n)) return min;
	return Math.min(max, Math.max(min, n));
}
function Avatar({ name, src, size = "md", speaking = false, className }) {
	const dim = {
		sm: "size-7 text-[10px]",
		md: "size-9 text-xs",
		lg: "size-12 text-sm",
		xl: "size-20 text-xl"
	}[size];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-raised font-semibold text-accent", dim, speaking && "speaking-ring", className),
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			className: "size-full object-cover"
		}) : initials(name)
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-raised text-fg hover:bg-inset",
			ghost: "text-muted hover:bg-raised hover:text-fg",
			danger: "bg-danger/15 text-danger hover:bg-danger/25",
			outline: "border border-line bg-transparent text-fg hover:bg-raised"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full rounded-md border border-line bg-inset px-3 text-sm text-fg placeholder:text-faint", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40", className),
		...props
	});
}
var CLIENT_KEY = "verdant.client.preferences.v4";
var VOICE_KEY = "verdant.voice.audio.preferences.v2";
var SCREEN_KEY = "verdant.screen.preferences.v2";
var SOUND_KEY = "verdant.ui-sounds.v2";
var IDENTITY_KEY = "verdant.identity.v1";
function readJson(key) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function writeJson(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function loadIdentity() {
	const raw = readJson(IDENTITY_KEY);
	if (!raw?.memberId || !raw.displayName) return null;
	return {
		memberId: String(raw.memberId).slice(0, 64),
		displayName: String(raw.displayName).slice(0, 32),
		avatarData: typeof raw.avatarData === "string" ? raw.avatarData : null
	};
}
function saveIdentity(identity) {
	writeJson(IDENTITY_KEY, identity);
	return identity;
}
function loadClientPreferences() {
	const raw = readJson(CLIENT_KEY) ?? {};
	return {
		backgroundColor: /^#[0-9a-fA-F]{6}$/.test(raw.backgroundColor ?? "") ? raw.backgroundColor : DEFAULT_CLIENT_PREFERENCES.backgroundColor,
		overlay: Boolean(raw.overlay),
		overlayOpacity: clamp(Number(raw.overlayOpacity ?? .72), .45, .95),
		uiScale: clamp(Number(raw.uiScale ?? 1), .8, 1.35),
		speakingColor: /^#[0-9a-fA-F]{6}$/.test(raw.speakingColor ?? "") ? raw.speakingColor : DEFAULT_CLIENT_PREFERENCES.speakingColor,
		speakingGlow: clamp(Number(raw.speakingGlow ?? .68), 0, 1),
		panelBlur: clamp(Number(raw.panelBlur ?? 18), 0, 32)
	};
}
function saveClientPreferences(prefs) {
	writeJson(CLIENT_KEY, prefs);
	applyClientPreferences(prefs);
	return prefs;
}
function loadVoicePreferences() {
	const raw = readJson(VOICE_KEY) ?? {};
	return {
		...DEFAULT_VOICE_AUDIO_PREFERENCES,
		...raw,
		suppressorModel: raw.suppressorModel === "verdant" ? "verdant" : "standard",
		suppressionLevel: raw.suppressionLevel === "low" || raw.suppressionLevel === "high" || raw.suppressionLevel === "maximum" ? raw.suppressionLevel : "medium",
		voiceDetectionMode: raw.voiceDetectionMode === "manual" ? "manual" : "auto",
		manualThresholdDb: clamp(Number(raw.manualThresholdDb ?? -42), -60, -20)
	};
}
function saveVoicePreferences(prefs) {
	writeJson(VOICE_KEY, prefs);
	return prefs;
}
function loadScreenPreferences() {
	const raw = readJson(SCREEN_KEY) ?? {};
	return {
		resolution: raw.resolution === "720p" || raw.resolution === "1440p" || raw.resolution === "2160p" || raw.resolution === "1080p" ? raw.resolution : "1080p",
		fps: raw.fps === 30 ? 30 : 60,
		includeAudio: raw.includeAudio !== false,
		sourcePreference: raw.sourcePreference === "monitor" || raw.sourcePreference === "window" || raw.sourcePreference === "browser" ? raw.sourcePreference : "any",
		bitrateKbps: clamp(Number(raw.bitrateKbps ?? 0), 0, 25e3)
	};
}
function saveScreenPreferences(prefs) {
	writeJson(SCREEN_KEY, prefs);
	return prefs;
}
function loadSoundPreferences() {
	const raw = readJson(SOUND_KEY) ?? {};
	const events = { ...DEFAULT_UI_SOUND_PREFERENCES.events };
	for (const key of Object.keys(events)) {
		const candidate = raw.events?.[key];
		if (!candidate) continue;
		const allowed = EVENT_SOUND_OPTIONS[key];
		events[key] = {
			enabled: candidate.enabled !== false,
			soundId: allowed.includes(candidate.soundId) ? candidate.soundId : events[key].soundId,
			volume: clamp(Number(candidate.volume ?? 70), 0, 100)
		};
	}
	return {
		enabled: raw.enabled !== false,
		masterVolume: clamp(Number(raw.masterVolume ?? 70), 0, 100),
		events
	};
}
function saveSoundPreferences(prefs) {
	writeJson(SOUND_KEY, prefs);
	return prefs;
}
function applyClientPreferences(prefs) {
	const root = document.documentElement;
	const hex = prefs.backgroundColor;
	const rgb = hexToRgb(hex) ?? {
		r: 8,
		g: 16,
		b: 15
	};
	const light = (Math.max(rgb.r, rgb.g, rgb.b) + Math.min(rgb.r, rgb.g, rgb.b)) / 510 >= .5;
	const mix = (a, b, t) => ({
		r: Math.round(a.r * (1 - t) + b.r * t),
		g: Math.round(a.g * (1 - t) + b.g * t),
		b: Math.round(a.b * (1 - t) + b.b * t)
	});
	const black = {
		r: 0,
		g: 0,
		b: 0
	};
	const white = {
		r: 255,
		g: 255,
		b: 255
	};
	const bg0 = light ? rgb : mix(rgb, black, .18);
	const bg1 = light ? mix(rgb, black, .04) : mix(rgb, white, .04);
	const bg2 = light ? mix(rgb, black, .08) : mix(rgb, white, .08);
	const bg3 = light ? mix(rgb, black, .12) : mix(rgb, white, .13);
	const fg = light ? {
		r: 18,
		g: 22,
		b: 21
	} : {
		r: 220,
		g: 232,
		b: 229
	};
	const muted = light ? {
		r: 70,
		g: 80,
		b: 78
	} : {
		r: 135,
		g: 153,
		b: 149
	};
	const accent = light ? mix(rgb, black, .32) : mix(rgb, white, .5);
	const set = (name, c) => root.style.setProperty(name, `rgb(${c.r} ${c.g} ${c.b})`);
	set("--color-bg", bg0);
	set("--color-surface", bg1);
	set("--color-raised", bg2);
	set("--color-inset", bg3);
	set("--color-fg", fg);
	set("--color-muted", muted);
	set("--color-accent", accent);
	set("--color-accent-fg", light ? white : {
		r: 8,
		g: 14,
		b: 13
	});
	const speak = hexToRgb(prefs.speakingColor) ?? {
		r: 145,
		g: 212,
		b: 199
	};
	set("--color-speaking", speak);
	root.style.setProperty("--speaking-glow", `rgba(${speak.r}, ${speak.g}, ${speak.b}, ${(.12 + prefs.speakingGlow * .5).toFixed(3)})`);
	root.style.setProperty("--panel-blur", `${Math.round(prefs.panelBlur)}px`);
	root.style.setProperty("--ui-scale", String(prefs.uiScale));
	root.style.setProperty("--app-opacity", prefs.overlay ? String(Math.max(.35, prefs.overlayOpacity)) : "1");
	root.dataset.light = light ? "true" : "false";
	root.dataset.overlay = prefs.overlay ? "true" : "false";
}
function hexToRgb(value) {
	const m = /^#([0-9a-f]{6})$/i.exec(value);
	if (!m) return;
	const n = parseInt(m[1], 16);
	return {
		r: n >> 16 & 255,
		g: n >> 8 & 255,
		b: n & 255
	};
}
async function playUiSound(prefs, event) {
	if (!prefs.enabled) return;
	const spec = prefs.events[event];
	if (!spec.enabled) return;
	const def = (await import("./verdant-config-BzJNCK-j.mjs").then((n) => n.f).then((n) => n.f)).UI_SOUND_LIBRARY[spec.soundId];
	const audio = new Audio(def.url);
	audio.volume = clamp(prefs.masterVolume / 100 * (spec.volume / 100), 0, 1);
	audio.play().catch(() => {});
}
async function prepareAvatar(file) {
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
		return canvas.toDataURL("image/webp", .84);
	} finally {
		bitmap.close();
	}
}
var PAGES = [
	{
		id: "profile",
		label: "Perfil",
		hint: "Nome e foto nesta sala",
		icon: UserRound,
		keywords: "nome foto avatar perfil"
	},
	{
		id: "appearance",
		label: "Aparência",
		hint: "Tema, escala, brilho de fala",
		icon: Palette,
		keywords: "tema cor overlay blur escala"
	},
	{
		id: "voice",
		label: "Voz",
		hint: "Microfone, ruído, detecção",
		icon: Volume2,
		keywords: "microfone ruido vad audio"
	},
	{
		id: "screen",
		label: "Tela",
		hint: "Resolução até 4K, fps, bitrate",
		icon: Monitor,
		keywords: "tela 4k 1080 1440 fps bitrate"
	},
	{
		id: "notifications",
		label: "Notificações",
		hint: "Sons da interface",
		icon: Bell,
		keywords: "som notificação clique"
	},
	{
		id: "network",
		label: "Rede",
		hint: "STUN, NAT, sem VPN",
		icon: Wifi,
		keywords: "rede vpn stun nat ice rtt"
	}
];
function SettingsOverlay(props) {
	const [page, setPage] = (0, import_react.useState)("profile");
	const [query, setQuery] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return PAGES;
		return PAGES.filter((p) => `${p.label} ${p.hint} ${p.keywords}`.includes(q));
	}, [query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex bg-bg/95 text-fg",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Configurações",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-[240px] shrink-0 flex-col border-r border-line bg-surface pt-8 max-sm:w-[72px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pb-4 max-sm:px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg text-fg max-sm:hidden",
						children: "Configurações"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted max-sm:hidden",
						children: "Organizadas por assunto"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 pb-3 max-sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Buscar",
							className: "h-9 pl-8"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-0.5 px-2",
					children: filtered.map((item) => {
						const Icon = item.icon;
						const active = page === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPage(item.id),
							className: cn("flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors", active ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-sm:hidden",
								children: item.label
							})]
						}, item.id);
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-4 border-b border-line px-8 py-6 max-sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: PAGES.find((p) => p.id === page)?.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: PAGES.find((p) => p.id === page)?.hint
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: props.onClose,
					"aria-label": "Fechar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-8 py-6 max-sm:px-4",
				children: [
					page === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, { ...props }),
					page === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearancePage, { ...props }),
					page === "voice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoicePage, { ...props }),
					page === "screen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenPage, { ...props }),
					page === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundsPage, { ...props }),
					page === "network" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkPage, { ...props })
				]
			})]
		})]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8 max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line",
			children
		})]
	});
}
function ToggleRow({ title, hint, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex cursor-pointer items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			className: "mt-1 size-4 accent-accent",
			checked,
			onChange: (e) => onChange(e.target.checked)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "block text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
			className: "text-xs text-muted",
			children: hint
		})] })]
	});
}
function RangeRow({ label, min, max, step, value, suffix, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex justify-between text-sm",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-muted",
				children: [value, suffix]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step: step ?? 1,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "w-full accent-accent"
		})]
	});
}
function ProfilePage({ identity, serverName, onIdentity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Nesta sala",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				name: identity.displayName,
				src: identity.avatarData,
				size: "xl"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-medium",
						children: identity.displayName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: serverName ?? "Entre em uma sala para publicar a foto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								const input = document.createElement("input");
								input.type = "file";
								input.accept = "image/png,image/jpeg,image/webp";
								input.onchange = async () => {
									const file = input.files?.[0];
									if (!file) return;
									const avatarData = await prepareAvatar(file);
									onIdentity({
										...identity,
										avatarData
									});
								};
								input.click();
							},
							children: "Trocar foto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => onIdentity({
								...identity,
								avatarData: null
							}),
							children: "Remover"
						})]
					})
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Nome",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: identity.displayName,
			maxLength: 32,
			onChange: (e) => onIdentity({
				...identity,
				displayName: e.target.value
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-muted",
			children: "Único dentro da sala. Sem conta online — só um apelido neste host."
		})]
	})] });
}
function AppearancePage({ client, onClient, identity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Tema",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: THEME_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onClient({
						...client,
						backgroundColor: p.color
					}),
					className: cn("flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm ring-1 ring-line", client.backgroundColor.toLowerCase() === p.color && "ring-accent"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-5 rounded-full ring-1 ring-line",
						style: { background: p.color }
					}), p.name]
				}, p.color))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-center gap-2 text-sm",
				children: ["Personalizado", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "color",
					value: client.backgroundColor,
					onChange: (e) => onClient({
						...client,
						backgroundColor: e.target.value
					}),
					className: "h-8 w-12 cursor-pointer rounded-sm border-0 bg-transparent"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Painéis",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					title: "Modo overlay",
					hint: "Painéis translúcidos com blur. Útil sobre um jogo em outra janela.",
					checked: client.overlay,
					onChange: (overlay) => onClient({
						...client,
						overlay
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
					label: "Opacidade",
					min: 45,
					max: 95,
					value: Math.round(client.overlayOpacity * 100),
					suffix: "%",
					onChange: (v) => onClient({
						...client,
						overlayOpacity: v / 100
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
					label: "Blur",
					min: 0,
					max: 32,
					value: Math.round(client.panelBlur),
					suffix: " px",
					onChange: (v) => onClient({
						...client,
						panelBlur: v
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
					label: "Escala da interface",
					min: 80,
					max: 135,
					step: 5,
					value: Math.round(client.uiScale * 100),
					suffix: "%",
					onChange: (v) => onClient({
						...client,
						uiScale: v / 100
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Quem está falando",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: SPEAKING_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onClient({
							...client,
							speakingColor: p.color
						}),
						className: cn("flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm ring-1 ring-line", client.speakingColor.toLowerCase() === p.color && "ring-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-5 rounded-full",
							style: { background: p.color }
						}), p.name]
					}, p.color))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
					label: "Intensidade",
					min: 0,
					max: 100,
					value: Math.round(client.speakingGlow * 100),
					suffix: "%",
					onChange: (v) => onClient({
						...client,
						speakingGlow: v / 100
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "speaking-ring mt-2 flex items-center gap-3 rounded-md bg-raised p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: identity.displayName,
						src: identity.avatarData,
						speaking: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Prévia ao vivo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "A cor muda sem recarregar o menu."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: () => onClient({ ...DEFAULT_CLIENT_PREFERENCES }),
					children: "Restaurar aparência"
				})
			]
		})
	] });
}
function VoicePage({ voice, onVoice, inputLevel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Microfone",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-inset",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-accent transition-[width] duration-75",
					style: { width: `${Math.round(inputLevel * 100)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Nível de entrada neste dispositivo. Fale para testar sem reabrir o menu."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Supressor de ruído",
				hint: "Filtra fundo antes do áudio sair. O modelo Padrão usa o Chromium; Verdant usa DSP próprio.",
				checked: voice.noiseSuppression,
				onChange: (noiseSuppression) => onVoice({
					...voice,
					noiseSuppression
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Modelo", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: voice.suppressorModel,
					disabled: !voice.noiseSuppression,
					onChange: (e) => onVoice({
						...voice,
						suppressorModel: e.target.value
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "standard",
						children: "Padrão · Chromium"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "verdant",
						children: "Verdant · intenso"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Nível", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: voice.suppressionLevel,
					disabled: !voice.noiseSuppression,
					onChange: (e) => onVoice({
						...voice,
						suppressionLevel: e.target.value
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "low",
							children: "Baixo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "medium",
							children: "Médio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "Alto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "maximum",
							children: "Máximo"
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Detecção de voz",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Ativar detecção",
				hint: "Fecha o microfone no silêncio e reabre na fala.",
				checked: voice.voiceDetection,
				onChange: (voiceDetection) => onVoice({
					...voice,
					voiceDetection
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Modo", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: voice.voiceDetectionMode,
					disabled: !voice.voiceDetection,
					onChange: (e) => onVoice({
						...voice,
						voiceDetectionMode: e.target.value
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "auto",
						children: "Automático"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "manual",
						children: "Manual"
					})]
				})]
			}),
			voice.voiceDetection && voice.voiceDetectionMode === "manual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
				label: "Limite",
				min: -60,
				max: -20,
				value: Math.round(voice.manualThresholdDb),
				suffix: " dBFS",
				onChange: (manualThresholdDb) => onVoice({
					...voice,
					manualThresholdDb
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: () => onVoice({ ...DEFAULT_VOICE_AUDIO_PREFERENCES }),
				children: "Restaurar voz"
			})
		]
	})] });
}
function ScreenPage({ screen, onScreen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Qualidade padrão",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "A captura pede até 4K 60 fps ao navegador. A camada enviada segue o preset abaixo — 1080p60 por padrão, bem acima do antigo teto de 720p."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Resolução", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: screen.resolution,
					onChange: (e) => onScreen({
						...screen,
						resolution: e.target.value
					}),
					children: Object.entries(SCREEN_RESOLUTIONS).map(([id, meta]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: id,
						children: [
							meta.label,
							" · ",
							meta.width,
							"×",
							meta.height
						]
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Quadros", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: screen.fps,
					onChange: (e) => onScreen({
						...screen,
						fps: Number(e.target.value)
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: 30,
						children: "30 fps"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: 60,
						children: "60 fps"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Bitrate", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: screen.bitrateKbps,
					onChange: (e) => onScreen({
						...screen,
						bitrateKbps: Number(e.target.value)
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 0,
							children: "Automático (recomendado)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 4e3,
							children: "4 Mbps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 8e3,
							children: "8 Mbps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 12e3,
							children: "12 Mbps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 18e3,
							children: "18 Mbps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 25e3,
							children: "25 Mbps"
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Captura",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Incluir áudio do sistema",
				hint: "Quando o navegador permitir, envia o som da janela junto da imagem.",
				checked: screen.includeAudio,
				onChange: (includeAudio) => onScreen({
					...screen,
					includeAudio
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Preferência de origem", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-10 w-full rounded-md border border-line bg-inset px-2",
					value: screen.sourcePreference,
					onChange: (e) => onScreen({
						...screen,
						sourcePreference: e.target.value
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "any",
							children: "Qualquer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "monitor",
							children: "Tela inteira"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "window",
							children: "Janela"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "browser",
							children: "Aba do navegador"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: () => onScreen({ ...DEFAULT_SCREEN_PREFERENCES }),
				children: "Restaurar tela"
			})
		]
	})] });
}
function SoundsPage({ sounds, onSounds }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Geral",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
			title: "Sons da interface",
			hint: "Não passa pela chamada. Só cliques e avisos locais.",
			checked: sounds.enabled,
			onChange: (enabled) => onSounds({
				...sounds,
				enabled
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
			label: "Volume mestre",
			min: 0,
			max: 100,
			value: sounds.masterVolume,
			suffix: "%",
			onChange: (masterVolume) => onSounds({
				...sounds,
				masterVolume
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Eventos",
		children: [[
			[
				"messageReceived",
				"Mensagem recebida",
				"Quando outra pessoa envia no canal."
			],
			[
				"voiceLeave",
				"Saída da voz",
				"Alguém sai do canal em que você está."
			],
			[
				"serverLeave",
				"Saída da sala",
				"Alguém desconecta da sala."
			],
			[
				"screenStart",
				"Começou a transmitir",
				"Uma tela entra no palco."
			],
			[
				"screenStop",
				"Parou de transmitir",
				"Uma tela sai do palco."
			]
		].map(([id, title, hint]) => {
			const spec = sounds.events[id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md bg-raised p-3 ring-1 ring-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						title,
						hint,
						checked: spec.enabled,
						onChange: (enabled) => onSounds({
							...sounds,
							events: {
								...sounds.events,
								[id]: {
									...spec,
									enabled
								}
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-9 flex-1 rounded-md border border-line bg-inset px-2 text-sm",
							value: spec.soundId,
							onChange: (e) => onSounds({
								...sounds,
								events: {
									...sounds.events,
									[id]: {
										...spec,
										soundId: e.target.value
									}
								}
							}),
							children: EVENT_SOUND_OPTIONS[id].map((sid) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: sid,
								children: UI_SOUND_LIBRARY[sid].label
							}, sid))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => void playUiSound(sounds, id),
							children: "Testar"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
						label: "Volume",
						min: 0,
						max: 100,
						value: spec.volume,
						suffix: "%",
						onChange: (volume) => onSounds({
							...sounds,
							events: {
								...sounds.events,
								[id]: {
									...spec,
									volume
								}
							}
						})
					})
				]
			}, id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			size: "sm",
			onClick: () => onSounds({ ...DEFAULT_UI_SOUND_PREFERENCES }),
			children: "Restaurar sons"
		})]
	})] });
}
function NetworkPage({ peers }) {
	const pathLabel = (type) => {
		if (type === "host") return "Rede local";
		if (type === "srflx" || type === "prflx") return "Internet direta (STUN)";
		if (type === "relay") return "Retransmissão (TURN)";
		return "Aguardando ICE";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Sem VPN",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted",
			children: "O sinal vai por HTTPS público. Voz e tela saem em WebRTC ponto a ponto, com STUN (Google, Cloudflare) para atravessar NAT. Hamachi/Radmin não são necessários — cada pessoa abre o link no navegador."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm leading-relaxed text-muted",
			children: [
				"Limite da sala: ",
				16,
				" pessoas. A malha de mídia é direta entre os clientes, então a qualidade não depende de um SFU na sua casa."
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Pares conectados",
		children: peers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Ninguém mais na chamada ainda. Entre em um canal de voz para ver o caminho ICE."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: peers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between rounded-md bg-raised px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name || p.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted",
					children: [
						p.connectionState,
						" · ",
						pathLabel(p.candidateType),
						p.rttMs != null ? ` · ${p.rttMs} ms` : ""
					]
				})]
			}, p.id))
		})
	})] });
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ID = string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
var NAME = string().trim().min(1).max(32);
var CODE = string().trim().min(4).max(12);
var listServers = createServerFn({ method: "GET" }).handler(createSsrRpc("ab668cb02cc5d0f5e442c8430ac2b4e511b36764c335c1788aa4754a28fda526"));
var createServer = createServerFn({ method: "POST" }).validator((data) => {
	return object({
		name: NAME,
		description: string().max(240).optional(),
		memberId: ID,
		displayName: NAME,
		avatarData: string().max(52e4).nullable().optional()
	}).parse(data);
}).handler(createSsrRpc("c76ce6a49e11f506175d4cf1dce99065afaa683f5b4b58bb939777fa4a777322"));
var joinServer = createServerFn({ method: "POST" }).validator((data) => object({
	code: CODE,
	memberId: ID,
	displayName: NAME,
	avatarData: string().max(52e4).nullable().optional()
}).parse(data)).handler(createSsrRpc("d29143b30dce5a392e35b3135fe6af76f0dd257e1ba46f539f95e0270447bdd1"));
var getServerBundle = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	memberId: ID
}).parse(data)).handler(createSsrRpc("b89d0aa18eace7727d5425264becee39fb6adaf97953c58de9bcf9e475108ff4"));
var listMessages = createServerFn({ method: "POST" }).validator((data) => object({ channelId: ID }).parse(data)).handler(createSsrRpc("95702b845061e41160865a2597ab3376296de01a9a0a95ce834a991f31cb0c2a"));
var postMessage = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	channelId: ID,
	authorId: ID,
	authorName: NAME,
	content: string().trim().min(1).max(MAX_MESSAGE_CHARS)
}).parse(data)).handler(createSsrRpc("20f700ffcf9da90b09aea9644977aac097b939de3da9fd29fdf07bee6bae1237"));
var updateProfile = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	memberId: ID,
	displayName: NAME.optional(),
	avatarData: string().max(52e4).nullable().optional()
}).parse(data)).handler(createSsrRpc("a8cb3d7e09c7facd7a76e4864bd9caa2e83495b5c9f73e4def0e93a85e63edd5"));
var createChannel = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	memberId: ID,
	name: string().trim().min(1).max(24),
	type: _enum(["text", "voice"])
}).parse(data)).handler(createSsrRpc("acf6304ae0766afa086290fd2dd54d9cd8d0360525354e94503820a49143a67c"));
var FAST_POLL_MS = 400;
var IDLE_POLL_MS = 2e3;
var PING_INTERVAL_MS = 2e3;
var STALL_MS = 1e4;
var MAX_RECOVERY_ATTEMPTS = 3;
var SIGNAL_RETRY_DELAYS_MS = [250, 750];
function defaultIceServers() {
	return [{ urls: [
		"stun:stun.l.google.com:19302",
		"stun:stun1.l.google.com:19302",
		"stun:stun2.l.google.com:19302",
		"stun:stun.cloudflare.com:3478",
		"stun:stun.relay.metered.ca:80"
	] }];
}
var P2PRoom = class {
	opts;
	peers = /* @__PURE__ */ new Map();
	localTracks = [];
	/** Per-remote-peer signal delivery chains (order-preserving). */
	signalQueues = /* @__PURE__ */ new Map();
	cursor = 0;
	pollTimer = null;
	pingTimer = null;
	closed = false;
	everPolled = false;
	lastPeersFingerprint = "";
	constructor(opts) {
		this.opts = opts;
	}
	/**
	* The first poll IS the join: it registers this peer and returns the
	* roster. A failed first poll (cold DB, offline tab) must not strand the
	* room: the loop and timers start regardless and the next poll retries.
	*/
	async join() {
		try {
			await this.pollOnce();
		} catch {}
		if (this.closed) return;
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
		this.pingTimer = setInterval(() => {
			this.pingAll();
			this.watchdog();
		}, PING_INTERVAL_MS);
	}
	close() {
		this.closed = true;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		if (this.pingTimer) clearInterval(this.pingTimer);
		for (const slot of this.peers.values()) slot.pc.close();
		this.peers.clear();
		fetch("/api/rtc", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				op: "leave",
				room: this.opts.room,
				peer: this.opts.selfId
			}),
			keepalive: true
		}).catch(() => {});
	}
	/** Send on the unreliable game-state channel (drops stale packets). */
	broadcast(data) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		for (const slot of this.peers.values()) if (slot.state?.readyState === "open") slot.state.send(wire);
	}
	/** Send reliably (ordered) to one peer, or to all when peerId is omitted. */
	send(data, peerId) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		const targets = peerId ? [this.peers.get(peerId)] : [...this.peers.values()];
		for (const slot of targets) if (slot?.reliable?.readyState === "open") slot.reliable.send(wire);
	}
	peerList() {
		return [...this.peers.values()].map((s) => ({ ...s.info }));
	}
	addTrack(track, stream) {
		this.localTracks.push({
			track,
			stream
		});
		for (const slot of this.peers.values()) try {
			slot.pc.addTrack(track, stream);
		} catch {}
	}
	removeTrack(track) {
		const idx = this.localTracks.findIndex((t) => t.track === track);
		if (idx >= 0) this.localTracks.splice(idx, 1);
		for (const slot of this.peers.values()) {
			const sender = slot.pc.getSenders().find((s) => s.track === track);
			if (sender) try {
				slot.pc.removeTrack(sender);
			} catch {}
		}
		try {
			track.stop();
		} catch {}
	}
	async replaceTrack(oldTrack, next) {
		for (const slot of this.peers.values()) {
			const sender = slot.pc.getSenders().find((s) => s.track === oldTrack);
			if (sender) try {
				await sender.replaceTrack(next);
			} catch {}
		}
		if (next) {
			const local = this.localTracks.find((t) => t.track === oldTrack);
			if (local) local.track = next;
		}
	}
	async configureVideoSenders(opts) {
		for (const slot of this.peers.values()) for (const sender of slot.pc.getSenders()) {
			if (sender.track?.kind !== "video") continue;
			const params = sender.getParameters();
			if (!params.encodings?.length) params.encodings = [{}];
			params.encodings[0].maxBitrate = opts.maxBitrate;
			params.encodings[0].maxFramerate = opts.maxFramerate;
			params.encodings[0].scaleResolutionDownBy = Math.max(1, opts.scaleResolutionDownBy);
			const extended = params;
			extended.degradationPreference = "maintain-resolution";
			try {
				await sender.setParameters(extended);
			} catch {}
		}
	}
	schedulePoll(delay) {
		if (this.closed) return;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		this.pollTimer = setTimeout(() => void this.poll(), delay);
	}
	anyPairConnecting() {
		for (const s of this.peers.values()) {
			if (s.terminal) continue;
			if (s.info.connectionState !== "connected") return true;
		}
		return false;
	}
	async pollOnce() {
		const params = new URLSearchParams({
			room: this.opts.room,
			peer: this.opts.selfId,
			name: this.opts.name ?? "",
			since: String(this.cursor)
		});
		const res = await fetch(`/api/rtc?${params}`);
		if (this.closed) return;
		if (!res.ok) throw new Error(`signaling poll failed: ${res.status}`);
		const body = await res.json();
		if (this.closed) return;
		if (!this.everPolled) {
			this.everPolled = true;
			this.opts.onConnected?.();
		}
		this.reconcileRoster(body.peers);
		const roster = new Set(body.peers.map((p) => p.id));
		for (const sig of body.signals) {
			this.cursor = Math.max(this.cursor, sig.id);
			await this.onSignal(sig.from, sig.kind, sig.payload, roster);
			if (this.closed) return;
		}
	}
	async poll() {
		if (this.closed) return;
		try {
			await this.pollOnce();
		} catch {}
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
	}
	reconcileRoster(peers) {
		const alive = new Set(peers.map((p) => p.id));
		for (const p of peers) {
			if (p.id === this.opts.selfId) continue;
			const existing = this.peers.get(p.id);
			if (existing) existing.info.name = p.name;
			else this.connectTo(p.id, p.name, this.opts.selfId > p.id);
		}
		for (const [id, slot] of this.peers) if (!alive.has(id)) {
			slot.pc.close();
			this.peers.delete(id);
		}
		this.emitPeers();
	}
	connectTo(peerId, name, initiator) {
		if (this.closed) return null;
		const pc = new RTCPeerConnection({
			iceServers: this.opts.iceServers ?? defaultIceServers(),
			iceCandidatePoolSize: 8,
			bundlePolicy: "max-bundle",
			rtcpMuxPolicy: "require"
		});
		const slot = {
			pc,
			makingOffer: false,
			ignoreOffer: false,
			pendingCandidates: [],
			lastProgressAt: Date.now(),
			recoveryAttempts: 0,
			info: {
				id: peerId,
				name,
				connectionState: pc.connectionState,
				candidateType: null,
				rttMs: null
			}
		};
		this.peers.set(peerId, slot);
		pc.onicecandidate = (e) => {
			if (e.candidate) this.sendSignal(peerId, "ice", e.candidate.toJSON());
		};
		pc.onconnectionstatechange = () => {
			slot.info.connectionState = pc.connectionState;
			if (pc.connectionState === "connecting" || pc.connectionState === "connected") slot.lastProgressAt = Date.now();
			if (pc.connectionState === "connected") {
				slot.recoveryAttempts = 0;
				slot.terminal = false;
				this.readCandidateType(slot);
			}
			this.emitPeers();
			if (pc.connectionState === "failed") pc.restartIce();
			if (pc.connectionState === "failed" || pc.connectionState === "disconnected") this.schedulePoll(FAST_POLL_MS);
		};
		pc.onnegotiationneeded = async () => {
			try {
				slot.makingOffer = true;
				await pc.setLocalDescription();
				await this.sendSignal(peerId, "offer", pc.localDescription.toJSON());
			} catch {} finally {
				slot.makingOffer = false;
			}
		};
		pc.ondatachannel = (e) => this.attachChannel(slot, e.channel);
		pc.ontrack = (event) => this.opts.onTrack?.(peerId, event);
		for (const { track, stream } of this.localTracks) if (track.readyState === "live") try {
			pc.addTrack(track, stream);
		} catch {}
		if (initiator) {
			this.attachChannel(slot, pc.createDataChannel("state", {
				ordered: false,
				maxRetransmits: 0
			}));
			this.attachChannel(slot, pc.createDataChannel("reliable", { ordered: true }));
		}
		return slot;
	}
	attachChannel(slot, channel) {
		if (channel.label === "state") slot.state = channel;
		else slot.reliable = channel;
		channel.onopen = () => {
			slot.lastProgressAt = Date.now();
		};
		channel.onmessage = (e) => {
			let msg;
			try {
				msg = JSON.parse(e.data);
			} catch {
				return;
			}
			if (msg.t === "ping") {
				if (slot.state?.readyState === "open") slot.state.send(JSON.stringify({ t: "pong" }));
			} else if (msg.t === "pong") {
				if (slot.pingSentAt) {
					slot.info.rttMs = Math.round(performance.now() - slot.pingSentAt);
					slot.pingSentAt = void 0;
					this.emitPeers();
				}
			} else this.opts.onMessage?.(slot.info.id, msg.d, channel.label === "state" ? "state" : "reliable");
		};
	}
	/** Apply buffered ICE candidates once a remote description is in place. */
	async flushPendingCandidates(slot) {
		while (slot.pendingCandidates.length > 0) {
			const candidate = slot.pendingCandidates.shift();
			try {
				await slot.pc.addIceCandidate(candidate);
			} catch (err) {
				if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
			}
			if (this.closed) return;
		}
	}
	async onSignal(from, kind, payload, roster) {
		if (this.closed) return;
		let slot = this.peers.get(from);
		if (!slot) {
			if (!roster.has(from)) return;
			const created = this.connectTo(from, "", false);
			if (!created) return;
			slot = created;
		}
		const polite = this.opts.selfId < from;
		try {
			if (kind === "offer" || kind === "answer") {
				const description = payload;
				const collision = kind === "offer" && (slot.makingOffer || slot.pc.signalingState !== "stable");
				slot.ignoreOffer = !polite && collision;
				if (slot.ignoreOffer) return;
				try {
					await slot.pc.setRemoteDescription(description);
				} catch (err) {
					if (kind !== "offer" || slot.recreatedForOffer) throw err;
					const attempts = slot.recoveryAttempts;
					const name = slot.info.name;
					slot.pc.close();
					this.peers.delete(from);
					const fresh = this.connectTo(from, name, false);
					if (!fresh) return;
					fresh.recoveryAttempts = attempts;
					fresh.recreatedForOffer = true;
					slot = fresh;
					await slot.pc.setRemoteDescription(description);
				}
				if (this.closed) return;
				await this.flushPendingCandidates(slot);
				if (this.closed) return;
				if (kind === "offer") {
					await slot.pc.setLocalDescription();
					if (this.closed) return;
					await this.sendSignal(from, "answer", slot.pc.localDescription.toJSON());
				}
			} else if (kind === "ice") {
				const candidate = payload;
				if (!slot.pc.remoteDescription) {
					slot.pendingCandidates.push(candidate);
					return;
				}
				try {
					await slot.pc.addIceCandidate(candidate);
				} catch (err) {
					if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
				}
			}
		} catch {}
	}
	/**
	* Signals are serialized per remote peer (a candidate must never overtake
	* its SDP into the DB) and retried on failure with short backoff.
	*/
	sendSignal(to, kind, payload) {
		const next = (this.signalQueues.get(to) ?? Promise.resolve()).then(() => this.postSignal(to, kind, payload));
		this.signalQueues.set(to, next.catch(() => {}));
		return next;
	}
	async postSignal(to, kind, payload) {
		for (let attempt = 0;; attempt++) {
			if (this.closed) return;
			try {
				const res = await fetch("/api/rtc", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						op: "signal",
						room: this.opts.room,
						from: this.opts.selfId,
						to,
						kind,
						payload
					})
				});
				if (res.ok) return;
				throw new Error(`signal POST failed: ${res.status}`);
			} catch (err) {
				if (attempt >= SIGNAL_RETRY_DELAYS_MS.length) {
					console.warn(`[p2p] signal ${kind} to ${to} failed after retries`, err);
					return;
				}
				await new Promise((r) => setTimeout(r, SIGNAL_RETRY_DELAYS_MS[attempt]));
			}
		}
	}
	pingAll() {
		const wire = JSON.stringify({ t: "ping" });
		for (const slot of this.peers.values()) {
			if (slot.state?.readyState !== "open") continue;
			const stale = slot.pingSentAt !== void 0 && performance.now() - slot.pingSentAt > 2 * PING_INTERVAL_MS;
			if (slot.pingSentAt === void 0 || stale) {
				slot.pingSentAt = performance.now();
				slot.state.send(wire);
			}
		}
	}
	/**
	* Stuck-pair recovery, piggybacked on the ping interval. A pair that has
	* made no progress for STALL_MS gets rebuilt by the dialer with a FRESH
	* RTCPeerConnection (new DTLS identity — fixes the suspend/resume
	* fingerprint wedge). After MAX_RECOVERY_ATTEMPTS the pair is terminal:
	* visible to the app as its last connectionState, ignored by fast-poll.
	*/
	watchdog() {
		if (this.closed) return;
		const now = Date.now();
		for (const [peerId, slot] of this.peers) {
			const live = slot.pc.connectionState;
			if (live !== slot.info.connectionState) {
				slot.info.connectionState = live;
				if (live === "connecting" || live === "connected") slot.lastProgressAt = now;
				this.emitPeers();
			}
			if (slot.terminal || live === "connected") continue;
			if (now - slot.lastProgressAt <= STALL_MS) continue;
			if (slot.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
				slot.terminal = true;
				this.emitPeers();
				continue;
			}
			slot.recoveryAttempts += 1;
			slot.lastProgressAt = now;
			if (this.opts.selfId > peerId) {
				const { name } = slot.info;
				const attempts = slot.recoveryAttempts;
				slot.pc.close();
				this.peers.delete(peerId);
				const fresh = this.connectTo(peerId, name, true);
				if (fresh) fresh.recoveryAttempts = attempts;
				this.schedulePoll(FAST_POLL_MS);
			}
		}
	}
	async readCandidateType(slot) {
		try {
			const stats = await slot.pc.getStats();
			let selected;
			stats.forEach((s) => {
				if (s.type === "candidate-pair" && s.nominated) selected = s;
			});
			const localId = selected?.localCandidateId;
			if (localId) {
				const local = stats.get(localId);
				slot.info.candidateType = local?.candidateType ?? null;
				this.emitPeers();
			}
		} catch {}
	}
	emitPeers() {
		const list = this.peerList();
		const fingerprint = JSON.stringify(list.map((p) => [
			p.id,
			p.name,
			p.connectionState,
			p.candidateType,
			p.rttMs
		]));
		if (fingerprint === this.lastPeersFingerprint) return;
		this.lastPeersFingerprint = fingerprint;
		this.opts.onPeersChanged?.(list);
	}
};
function captureConstraints(prefs) {
	return {
		echoCancellation: true,
		autoGainControl: true,
		noiseSuppression: prefs.noiseSuppression && prefs.suppressorModel === "standard",
		channelCount: 1
	};
}
function useMediaRoom(options) {
	const { room, selfId, name, voice, enabled } = options;
	const [peers, setPeers] = (0, import_react.useState)([]);
	const [joined, setJoined] = (0, import_react.useState)(false);
	const [muted, setMutedState] = (0, import_react.useState)(false);
	const [deafened, setDeafenedState] = (0, import_react.useState)(false);
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const [localScreenStream, setLocalScreen] = (0, import_react.useState)(null);
	const [remoteStreams, setRemoteStreams] = (0, import_react.useState)([]);
	const [peerState, setPeerState] = (0, import_react.useState)({});
	const [inputLevel, setInputLevel] = (0, import_react.useState)(0);
	const p2pRef = (0, import_react.useRef)(null);
	const micStream = (0, import_react.useRef)(null);
	const micTrack = (0, import_react.useRef)(null);
	const screenTracks = (0, import_react.useRef)([]);
	const mutedRef = (0, import_react.useRef)(false);
	const deafenedRef = (0, import_react.useRef)(false);
	const chatListeners = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const analyserRef = (0, import_react.useRef)(null);
	const audioCtxRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	const remoteAudioEls = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const publishState = (0, import_react.useCallback)(() => {
		p2pRef.current?.send({
			type: "voice-state",
			muted: mutedRef.current,
			deafened: deafenedRef.current,
			sharing: screenTracks.current.length > 0
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const p2p = new P2PRoom({
			room,
			selfId,
			name,
			onPeersChanged: setPeers,
			onConnected: () => setJoined(true),
			onMessage: (from, data) => {
				const msg = data;
				if (!msg || typeof msg !== "object") return;
				if (msg.type === "voice-state") setPeerState((prev) => ({
					...prev,
					[from]: {
						muted: Boolean(msg.muted),
						deafened: Boolean(msg.deafened),
						speaking: Boolean(msg.speaking) || prev[from]?.speaking || false,
						sharing: Boolean(msg.sharing)
					}
				}));
				else if (msg.type === "speaking") setPeerState((prev) => ({
					...prev,
					[from]: {
						muted: prev[from]?.muted ?? false,
						deafened: prev[from]?.deafened ?? false,
						speaking: Boolean(msg.on),
						sharing: prev[from]?.sharing ?? false
					}
				}));
				else if (msg.type === "chat") for (const fn of chatListeners.current) fn(from, msg.payload);
			},
			onTrack: (from, event) => {
				const track = event.track;
				const stream = event.streams[0] ?? new MediaStream([track]);
				const hint = track.kind === "video" || track.contentHint === "detail" ? "screen" : "voice";
				setRemoteStreams((prev) => {
					return [...prev.filter((s) => !(s.peerId === from && s.stream.id === stream.id && s.kind === track.kind)), {
						peerId: from,
						stream,
						kind: track.kind,
						hint
					}];
				});
				track.addEventListener("ended", () => {
					setRemoteStreams((prev) => prev.filter((s) => s.stream.id !== stream.id || s.kind !== track.kind));
				});
				if (track.kind === "audio") {
					const el = new Audio();
					el.autoplay = true;
					el.srcObject = stream;
					el.muted = deafenedRef.current;
					el.play().catch(() => {});
					remoteAudioEls.current.set(`${from}:${stream.id}`, el);
				}
			}
		});
		p2pRef.current = p2p;
		(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: captureConstraints(voice),
					video: false
				});
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
					const on = !mutedRef.current && level > .08;
					setSpeaking((prev) => {
						if (prev !== on) p2p.send({
							type: "speaking",
							on
						});
						return on;
					});
					rafRef.current = requestAnimationFrame(loop);
				};
				rafRef.current = requestAnimationFrame(loop);
			} catch {}
			await p2p.join();
			publishState();
		})();
		return () => {
			cancelAnimationFrame(rafRef.current);
			p2p.close();
			p2pRef.current = null;
			micStream.current?.getTracks().forEach((t) => t.stop());
			screenTracks.current.forEach((t) => t.stop());
			audioCtxRef.current?.close();
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
	}, [
		enabled,
		room,
		selfId,
		name
	]);
	(0, import_react.useEffect)(() => {
		for (const el of remoteAudioEls.current.values()) el.muted = deafened;
	}, [deafened]);
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
		setMuted: (0, import_react.useCallback)((next) => {
			mutedRef.current = next;
			setMutedState(next);
			if (micTrack.current) micTrack.current.enabled = !next && !deafenedRef.current;
			publishState();
		}, [publishState]),
		setDeafened: (0, import_react.useCallback)((next) => {
			deafenedRef.current = next;
			setDeafenedState(next);
			if (next) {
				mutedRef.current = true;
				setMutedState(true);
				if (micTrack.current) micTrack.current.enabled = false;
			} else if (micTrack.current) micTrack.current.enabled = !mutedRef.current;
			for (const el of remoteAudioEls.current.values()) el.muted = next;
			publishState();
		}, [publishState]),
		startScreen: (0, import_react.useCallback)(async (prefs) => {
			const target = SCREEN_RESOLUTIONS[prefs.resolution];
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width: {
						ideal: target.width,
						max: 3840
					},
					height: {
						ideal: target.height,
						max: 2160
					},
					frameRate: {
						ideal: prefs.fps,
						max: 60
					}
				},
				audio: prefs.includeAudio
			});
			const video = stream.getVideoTracks()[0];
			if (video) {
				video.contentHint = "detail";
				try {
					await video.applyConstraints({
						width: { ideal: target.width },
						height: { ideal: target.height },
						frameRate: { ideal: prefs.fps }
					});
				} catch {}
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
			const actualH = (video?.getSettings())?.height ?? target.height;
			const scale = Math.max(1, actualH / target.height);
			const bitrate = (prefs.bitrateKbps || recommendedScreenBitrateKbps(prefs.resolution, prefs.fps)) * 1e3;
			await p2pRef.current?.configureVideoSenders({
				maxBitrate: bitrate,
				maxFramerate: prefs.fps,
				scaleResolutionDownBy: scale
			});
			setLocalScreen(stream);
			setSharing(true);
			publishState();
		}, [publishState]),
		stopScreen: (0, import_react.useCallback)(() => {
			for (const track of screenTracks.current) p2pRef.current?.removeTrack(track);
			screenTracks.current = [];
			setLocalScreen(null);
			setSharing(false);
			publishState();
		}, [publishState]),
		sendChat: (0, import_react.useCallback)((payload) => {
			p2pRef.current?.send({
				type: "chat",
				payload
			});
		}, []),
		onChat: (0, import_react.useCallback)((fn) => {
			chatListeners.current.add(fn);
			return () => {
				chatListeners.current.delete(fn);
			};
		}, [])
	};
}
function VerdantApp({ invite }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [identity, setIdentity] = (0, import_react.useState)(null);
	const [nameDraft, setNameDraft] = (0, import_react.useState)("");
	const [servers, setServers] = (0, import_react.useState)([]);
	const [server, setServer] = (0, import_react.useState)(null);
	const [channels, setChannels] = (0, import_react.useState)([]);
	const [members, setMembers] = (0, import_react.useState)([]);
	const [channel, setChannel] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [voiceChannel, setVoiceChannel] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [client, setClient] = (0, import_react.useState)(DEFAULT_CLIENT_PREFERENCES);
	const [voice, setVoice] = (0, import_react.useState)(DEFAULT_VOICE_AUDIO_PREFERENCES);
	const [screen, setScreen] = (0, import_react.useState)(DEFAULT_SCREEN_PREFERENCES);
	const [sounds, setSounds] = (0, import_react.useState)(DEFAULT_UI_SOUND_PREFERENCES);
	const [code, setCode] = (0, import_react.useState)(invite ?? "");
	const [newServerName, setNewServerName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mobilePanel, setMobilePanel] = (0, import_react.useState)("chat");
	const [shareMenu, setShareMenu] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	const media = useMediaRoom({
		room: voiceChannel ? `vc${voiceChannel.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 62)}` : "idle",
		selfId: identity?.memberId ?? "pending",
		name: identity?.displayName ?? "",
		voice,
		enabled: Boolean(identity && voiceChannel)
	});
	(0, import_react.useEffect)(() => {
		const stored = loadIdentity();
		if (stored) setIdentity(stored);
		const prefs = loadClientPreferences();
		setClient(prefs);
		applyClientPreferences(prefs);
		setVoice(loadVoicePreferences());
		setScreen(loadScreenPreferences());
		setSounds(loadSoundPreferences());
		setReady(true);
		listServers().then(setServers).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!server || !identity) return;
		let cancel = false;
		const tick = async () => {
			try {
				const bundle = await getServerBundle({ data: {
					serverId: server.id,
					memberId: identity.memberId
				} });
				if (cancel) return;
				setServer(bundle.server);
				setChannels(bundle.channels);
				setMembers(bundle.members);
				setChannel((cur) => {
					if (cur && bundle.channels.some((c) => c.id === cur.id)) return cur;
					return bundle.channels.find((c) => c.type === "text") ?? bundle.channels[0] ?? null;
				});
			} catch {}
		};
		tick();
		const id = window.setInterval(() => void tick(), 8e3);
		return () => {
			cancel = true;
			window.clearInterval(id);
		};
	}, [server?.id, identity?.memberId]);
	(0, import_react.useEffect)(() => {
		if (!channel || channel.type !== "text") return;
		listMessages({ data: { channelId: channel.id } }).then(setMessages).catch(() => {});
	}, [channel?.id]);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
	}, [messages.length]);
	(0, import_react.useEffect)(() => {
		return media.onChat((_from, payload) => {
			const msg = payload;
			if (msg?.channelId) {
				setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
				if (msg.authorId !== identity?.memberId) playUiSound(sounds, "messageReceived");
			}
		});
	}, [
		media.onChat,
		identity?.memberId,
		sounds
	]);
	const persistClient = (next) => {
		setClient(next);
		saveClientPreferences(next);
	};
	const persistIdentity = (next) => {
		setIdentity(next);
		saveIdentity(next);
		if (server) updateProfile({ data: {
			serverId: server.id,
			memberId: next.memberId,
			displayName: next.displayName,
			avatarData: next.avatarData
		} }).catch((err) => toast.error(err instanceof Error ? err.message : "Falha ao salvar perfil"));
	};
	const enter = async (action) => {
		if (!identity) return;
		setBusy(true);
		try {
			if (action === "create") {
				const bundle = await getServerBundle({ data: {
					serverId: (await createServer({ data: {
						name: newServerName.trim() || "Sala",
						memberId: identity.memberId,
						displayName: identity.displayName,
						avatarData: identity.avatarData
					} })).id,
					memberId: identity.memberId
				} });
				setServer(bundle.server);
				setChannels(bundle.channels);
				setMembers(bundle.members);
				setChannel(bundle.channels.find((c) => c.type === "text") ?? null);
			} else {
				const bundle = await getServerBundle({ data: {
					serverId: (await joinServer({ data: {
						code: action === "bosque" ? "BOSQUE" : code.trim(),
						memberId: identity.memberId,
						displayName: identity.displayName,
						avatarData: identity.avatarData
					} })).id,
					memberId: identity.memberId
				} });
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
			const msg = await postMessage({ data: {
				serverId: server.id,
				channelId: channel.id,
				authorId: identity.memberId,
				authorName: identity.displayName,
				content
			} });
			setMessages((prev) => [...prev, msg]);
			media.sendChat(msg);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Falha ao enviar.");
		}
	};
	const voiceMembers = (0, import_react.useMemo)(() => {
		const live = /* @__PURE__ */ new Map();
		if (identity && voiceChannel) live.set(identity.memberId, {
			name: identity.displayName,
			speaking: media.speaking,
			muted: media.muted,
			sharing: media.sharing
		});
		for (const peer of media.peers) {
			const state = media.peerState[peer.id];
			live.set(peer.id, {
				name: peer.name || peer.id,
				speaking: Boolean(state?.speaking),
				muted: Boolean(state?.muted),
				sharing: Boolean(state?.sharing)
			});
		}
		return [...live.entries()];
	}, [
		identity,
		voiceChannel,
		media.speaking,
		media.muted,
		media.sharing,
		media.peers,
		media.peerState
	]);
	const screenTiles = (0, import_react.useMemo)(() => {
		const tiles = [];
		if (media.localScreenStream) tiles.push({
			id: "local",
			name: identity?.displayName ?? "Você",
			stream: media.localScreenStream,
			local: true
		});
		const seen = /* @__PURE__ */ new Set();
		for (const remote of media.remoteStreams) {
			if (remote.kind !== "video") continue;
			if (seen.has(remote.stream.id)) continue;
			seen.add(remote.stream.id);
			const name = media.peers.find((p) => p.id === remote.peerId)?.name ?? "Tela";
			tiles.push({
				id: remote.stream.id,
				name,
				stream: remote.stream
			});
		}
		return tiles;
	}, [
		media.localScreenStream,
		media.remoteStreams,
		media.peers,
		identity?.displayName
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl text-accent",
			children: "Verdant"
		})
	});
	if (!identity) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Gate, {
		title: "Como você quer aparecer?",
		subtitle: "Só um nome. Sem conta, e-mail ou VPN.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			autoFocus: true,
			maxLength: 32,
			placeholder: "Seu nome",
			value: nameDraft,
			onChange: (e) => setNameDraft(e.target.value),
			onKeyDown: (e) => {
				if (e.key === "Enter" && nameDraft.trim()) {
					const next = {
						memberId: newId("u"),
						displayName: nameDraft.trim()
					};
					saveIdentity(next);
					setIdentity(next);
				}
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: !nameDraft.trim(),
			onClick: () => {
				const next = {
					memberId: newId("u"),
					displayName: nameDraft.trim()
				};
				saveIdentity(next);
				setIdentity(next);
			},
			children: "Continuar"
		})]
	});
	if (!server) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Gate, {
		title: `Olá, ${identity.displayName}`,
		subtitle: "Entre em uma sala ou crie a sua. Até 16 pessoas, pela internet.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: busy,
				onClick: () => void enter("bosque"),
				children: "Entrar no Bosque"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Código de convite",
					value: code,
					onChange: (e) => setCode(e.target.value.toUpperCase()),
					onKeyDown: (e) => {
						if (e.key === "Enter") enter("join");
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: busy || code.trim().length < 4,
					onClick: () => void enter("join"),
					children: "Entrar com convite"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Nome da nova sala",
					value: newServerName,
					onChange: (e) => setNewServerName(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: busy,
					onClick: () => void enter("create"),
					children: "Criar sala"
				})]
			}),
			servers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm text-muted",
				children: servers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					s.name,
					" · ",
					s.memberCount,
					"/",
					16,
					" · convite ",
					s.inviteCode
				] }, s.id))
			})
		]
	});
	const textChannels = channels.filter((c) => c.type === "text");
	const voiceChannels = channels.filter((c) => c.type === "voice");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "hidden flex-col items-center gap-3 border-r border-line bg-bg py-3 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 place-items-center rounded-2xl bg-accent font-display text-lg text-accent-fg",
						children: "V"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-line" }),
					servers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: s.name,
						onClick: () => {
							if (s.id === server.id) return;
							setServer(s);
							setVoiceChannel(null);
						},
						className: cn("grid size-11 place-items-center rounded-2xl bg-raised text-sm font-semibold transition-all", s.id === server.id && "rounded-[14px] bg-accent text-accent-fg"),
						children: s.name.slice(0, 2).toUpperCase()
					}, s.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center rounded-2xl bg-raised text-accent",
						onClick: () => setServer(null),
						title: "Nova sala",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("glass-panel flex-col border-r border-line", mobilePanel === "channels" ? "flex" : "hidden md:flex"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-14 items-center justify-between border-b border-line px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-semibold",
								children: server.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-[11px] text-muted",
								children: ["convite ", server.inviteCode]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setSettingsOpen(true),
							"aria-label": "Configurações",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-2 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
							title: "Texto",
							onAdd: async () => {
								const name = window.prompt("Nome do canal");
								if (!name || !identity) return;
								await createChannel({ data: {
									serverId: server.id,
									memberId: identity.memberId,
									name,
									type: "text"
								} });
								const bundle = await getServerBundle({ data: {
									serverId: server.id,
									memberId: identity.memberId
								} });
								setChannels(bundle.channels);
							},
							children: textChannels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "size-4" }),
								label: c.name,
								active: channel?.id === c.id,
								onClick: () => {
									setChannel(c);
									setMobilePanel("chat");
								}
							}, c.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
							title: "Voz",
							onAdd: async () => {
								const name = window.prompt("Nome do canal de voz");
								if (!name || !identity) return;
								await createChannel({ data: {
									serverId: server.id,
									memberId: identity.memberId,
									name,
									type: "voice"
								} });
								const bundle = await getServerBundle({ data: {
									serverId: server.id,
									memberId: identity.memberId
								} });
								setChannels(bundle.channels);
							},
							children: voiceChannels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelRow, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }),
								label: c.name,
								active: voiceChannel?.id === c.id,
								onClick: () => {
									setVoiceChannel(c);
									setChannel(c);
								}
							}), voiceChannel?.id === c.id && voiceMembers.map(([id, info]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-7 flex items-center gap-2 py-1 text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										name: info.name,
										size: "sm",
										speaking: info.speaking
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: info.name
									}),
									info.muted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-3" }),
									info.sharing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, { className: "size-3 text-accent" })
								]
							}, id))] }, c.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "flex items-center gap-2 border-t border-line p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								name: identity.displayName,
								src: identity.avatarData,
								speaking: media.speaking
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: identity.displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-muted",
									children: voiceChannel ? `em ${voiceChannel.name}` : "offline"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconToggle, {
								active: !media.muted,
								onClick: () => media.setMuted(!media.muted),
								label: "Microfone",
								children: media.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconToggle, {
								active: !media.deafened,
								onClick: () => media.setDeafened(!media.deafened),
								label: "Áudio",
								children: media.deafened ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: cn("flex min-w-0 flex-col bg-bg", mobilePanel === "chat" ? "flex" : "hidden md:flex"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center gap-2 border-b border-line px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "md:hidden",
							onClick: () => setMobilePanel("channels"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "size-4" })
						}),
						channel?.type === "voice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "size-4 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-semibold",
							children: channel?.name ?? "canal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto hidden text-xs text-muted sm:inline",
							children: [
								members.length,
								"/",
								16,
								" · ",
								SCREEN_RESOLUTIONS[screen.resolution].label,
								" ",
								screen.fps,
								"fps"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "md:hidden",
							onClick: () => setMobilePanel("members"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
						})
					]
				}), channel?.type === "voice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceStage, {
					tiles: screenTiles,
					members: voiceMembers,
					sharing: media.sharing,
					shareMenu,
					screen,
					onToggleShareMenu: () => setShareMenu((v) => !v),
					onStart: async () => {
						try {
							await media.startScreen(screen);
							setShareMenu(false);
							playUiSound(sounds, "screenStart");
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Não foi possível capturar a tela.");
						}
					},
					onStop: () => {
						media.stopScreen();
						playUiSound(sounds, "screenStop");
					},
					onLeave: () => {
						setVoiceChannel(null);
						setChannel(textChannels[0] ?? null);
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scroller,
					className: "flex-1 overflow-y-auto px-4 py-4",
					children: [messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-2xl",
							children: ["#", channel?.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Comece a conversa nesta sala."
						})] })
					}), messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "mb-3 flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: m.authorName,
							src: members.find((x) => x.memberId === m.authorId)?.avatarData
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: m.authorName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-[11px] text-faint",
									children: formatTime(m.createdAt)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed break-words whitespace-pre-wrap",
								children: m.content
							})]
						})]
					}, m.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					className: "p-3",
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft,
						placeholder: `Mensagem em #${channel?.name ?? ""}`,
						onChange: (e) => setDraft(e.target.value)
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("glass-panel flex-col border-l border-line", mobilePanel === "members" ? "flex" : "hidden md:flex"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center px-4 text-[11px] font-semibold tracking-[0.12em] text-faint uppercase",
					children: [
						"Membros — ",
						members.length,
						"/",
						16
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-2",
					children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-md px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: m.displayName,
							src: m.avatarData,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm",
								children: m.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-faint",
								children: m.role
							})]
						})]
					}, m.memberId))
				})]
			}),
			settingsOpen && identity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsOverlay, {
				identity,
				serverName: server.name,
				peers: media.peers,
				inputLevel: media.inputLevel,
				client,
				voice,
				screen,
				sounds,
				devices: {
					inputs: [],
					outputs: []
				},
				onClose: () => setSettingsOpen(false),
				onIdentity: persistIdentity,
				onClient: persistClient,
				onVoice: (next) => {
					setVoice(next);
					saveVoicePreferences(next);
				},
				onScreen: (next) => {
					setScreen(next);
					saveScreenPreferences(next);
				},
				onSounds: (next) => {
					setSounds(next);
					saveSoundPreferences(next);
				}
			})
		]
	});
}
function Gate({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-4 text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "bottom-right"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl bg-surface p-8 ring-1 ring-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm tracking-[0.2em] text-accent uppercase",
					children: "Verdant"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3",
					children
				})
			]
		})]
	});
}
function Group({ title, children, onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold tracking-[0.14em] text-faint uppercase",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-faint hover:text-fg",
				onClick: () => void onAdd(),
				"aria-label": `Criar ${title}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
			})]
		}), children]
	});
}
function ChannelRow({ icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm", active ? "bg-raised text-fg" : "text-muted hover:bg-raised/70 hover:text-fg"),
		children: [icon, label]
	});
}
function IconToggle({ active, onClick, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: cn("grid size-8 place-items-center rounded-md", active ? "text-fg hover:bg-raised" : "text-danger"),
		children
	});
}
function VoiceStage({ tiles, members, sharing, shareMenu, screen, onToggleShareMenu, onStart, onStop, onLeave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid flex-1 auto-rows-fr gap-3 overflow-auto p-4",
			children: tiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center rounded-lg bg-surface ring-1 ring-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-6 p-8",
					children: [members.map(([id, info]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid justify-items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: info.name,
							size: "xl",
							speaking: info.speaking
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: info.name
						})]
					}, id)), members.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Entrando no canal…"
					})]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid h-full gap-3", tiles.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"),
				children: tiles.map((tile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenTile, { tile }, tile.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-center justify-center gap-2 border-t border-line p-3",
			children: [
				shareMenu && !sharing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-16 rounded-lg bg-surface p-4 text-sm ring-1 ring-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Transmitir tela"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								SCREEN_RESOLUTIONS[screen.resolution].label,
								" · ",
								screen.fps,
								" fps · áudio",
								" ",
								screen.includeAudio ? "ligado" : "off"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Altere o padrão em Configurações → Tela."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3 w-full",
							size: "sm",
							onClick: onStart,
							children: "Começar"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: sharing ? "danger" : "secondary",
					onClick: sharing ? onStop : onToggleShareMenu,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, { className: "size-4" }), sharing ? "Parar tela" : "Tela"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "danger",
					onClick: onLeave,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" }), "Sair"]
				})
			]
		})]
	});
}
function ScreenTile({ tile }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ref.current) ref.current.srcObject = tile.stream;
	}, [tile.stream]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-lg bg-surface ring-1 ring-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref,
			autoPlay: true,
			playsInline: true,
			muted: tile.local,
			className: "size-full object-contain"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute bottom-2 left-2 rounded-md bg-bg/80 px-2 py-0.5 text-xs",
			children: tile.name
		})]
	});
}
function Home() {
	const { join } = Route$1.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdantApp, { invite: join });
}
//#endregion
export { Home as component };
