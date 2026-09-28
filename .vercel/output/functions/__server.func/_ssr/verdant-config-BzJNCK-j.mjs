import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verdant-config-BzJNCK-j.js
var verdant_config_BzJNCK_j_exports = /* @__PURE__ */ __exportAll({
	a: () => EVENT_SOUND_OPTIONS,
	c: () => SPEAKING_PRESETS,
	d: () => recommendedScreenBitrateKbps,
	f: () => verdant_config_exports,
	i: () => DEFAULT_VOICE_AUDIO_PREFERENCES,
	l: () => THEME_PRESETS,
	n: () => DEFAULT_SCREEN_PREFERENCES,
	o: () => MAX_MESSAGE_CHARS,
	r: () => DEFAULT_UI_SOUND_PREFERENCES,
	s: () => SCREEN_RESOLUTIONS,
	t: () => DEFAULT_CLIENT_PREFERENCES,
	u: () => UI_SOUND_LIBRARY
});
var verdant_config_exports = /* @__PURE__ */ __exportAll$1({
	DEFAULT_CLIENT_PREFERENCES: () => DEFAULT_CLIENT_PREFERENCES,
	DEFAULT_SCREEN_PREFERENCES: () => DEFAULT_SCREEN_PREFERENCES,
	DEFAULT_UI_SOUND_PREFERENCES: () => DEFAULT_UI_SOUND_PREFERENCES,
	DEFAULT_VOICE_AUDIO_PREFERENCES: () => DEFAULT_VOICE_AUDIO_PREFERENCES,
	EVENT_SOUND_OPTIONS: () => EVENT_SOUND_OPTIONS,
	MAX_MESSAGE_CHARS: () => MAX_MESSAGE_CHARS,
	MAX_PARTICIPANTS: () => 16,
	MAX_SCREEN_SHARES: () => 4,
	SCREEN_RESOLUTIONS: () => SCREEN_RESOLUTIONS,
	SPEAKING_PRESETS: () => SPEAKING_PRESETS,
	THEME_PRESETS: () => THEME_PRESETS,
	UI_SOUND_LIBRARY: () => UI_SOUND_LIBRARY,
	recommendedScreenBitrateKbps: () => recommendedScreenBitrateKbps
});
var MAX_MESSAGE_CHARS = 4e3;
var SCREEN_RESOLUTIONS = {
	"720p": {
		width: 1280,
		height: 720,
		label: "720p HD"
	},
	"1080p": {
		width: 1920,
		height: 1080,
		label: "1080p Full HD"
	},
	"1440p": {
		width: 2560,
		height: 1440,
		label: "1440p QHD"
	},
	"2160p": {
		width: 3840,
		height: 2160,
		label: "2160p 4K"
	}
};
function recommendedScreenBitrateKbps(resolution, fps) {
	return Math.round({
		"720p": 3500,
		"1080p": 8e3,
		"1440p": 14e3,
		"2160p": 22e3
	}[resolution] * (fps === 60 ? 1.35 : 1));
}
var DEFAULT_VOICE_AUDIO_PREFERENCES = {
	noiseSuppression: true,
	suppressorModel: "standard",
	suppressionLevel: "medium",
	voiceDetection: true,
	voiceDetectionMode: "auto",
	manualThresholdDb: -42
};
var DEFAULT_CLIENT_PREFERENCES = {
	backgroundColor: "#08100f",
	overlay: false,
	overlayOpacity: .72,
	uiScale: 1,
	speakingColor: "#91d4c7",
	speakingGlow: .68,
	panelBlur: 18
};
var DEFAULT_SCREEN_PREFERENCES = {
	resolution: "1080p",
	fps: 60,
	includeAudio: true,
	sourcePreference: "any",
	bitrateKbps: 0
};
var THEME_PRESETS = [
	{
		name: "Verdant",
		color: "#08100f"
	},
	{
		name: "Obsidiana",
		color: "#0a0c0c"
	},
	{
		name: "Neve",
		color: "#f4f7f6"
	},
	{
		name: "Oceano",
		color: "#0a3142"
	},
	{
		name: "Âmbar",
		color: "#4a2f08"
	},
	{
		name: "Grafite",
		color: "#202528"
	}
];
var SPEAKING_PRESETS = [
	{
		name: "Menta",
		color: "#91d4c7"
	},
	{
		name: "Ciano",
		color: "#59d9ff"
	},
	{
		name: "Azul",
		color: "#6699ff"
	},
	{
		name: "Verde",
		color: "#72e68f"
	},
	{
		name: "Laranja",
		color: "#ffad66"
	},
	{
		name: "Branco",
		color: "#f4f7f6"
	}
];
var UI_SOUND_LIBRARY = {
	"message-click": {
		id: "message-click",
		label: "Click suave",
		url: "/sounds/message/clicksoundeffect.mp3"
	},
	"message-dog": {
		id: "message-dog",
		label: "Clicker",
		url: "/sounds/message/dog-clicker.mp3"
	},
	"participant-leave": {
		id: "participant-leave",
		label: "Saída",
		url: "/sounds/participant-leave/enter-da-game.mp3"
	},
	"screen-start": {
		id: "screen-start",
		label: "Início de tela",
		url: "/sounds/screen-start/steam-deck-enter-game.mp3"
	},
	"screen-stop": {
		id: "screen-stop",
		label: "Fim de tela",
		url: "/sounds/screen-stop/switch-sound.mp3"
	}
};
var EVENT_SOUND_OPTIONS = {
	messageReceived: ["message-click", "message-dog"],
	voiceLeave: ["participant-leave"],
	serverLeave: ["participant-leave"],
	screenStart: ["screen-start"],
	screenStop: ["screen-stop"]
};
var DEFAULT_UI_SOUND_PREFERENCES = {
	enabled: true,
	masterVolume: 70,
	events: {
		messageReceived: {
			enabled: true,
			soundId: "message-click",
			volume: 70
		},
		voiceLeave: {
			enabled: true,
			soundId: "participant-leave",
			volume: 70
		},
		serverLeave: {
			enabled: true,
			soundId: "participant-leave",
			volume: 70
		},
		screenStart: {
			enabled: true,
			soundId: "screen-start",
			volume: 70
		},
		screenStop: {
			enabled: true,
			soundId: "screen-stop",
			volume: 70
		}
	}
};
//#endregion
export { EVENT_SOUND_OPTIONS as a, SPEAKING_PRESETS as c, recommendedScreenBitrateKbps as d, verdant_config_BzJNCK_j_exports as f, DEFAULT_VOICE_AUDIO_PREFERENCES as i, THEME_PRESETS as l, DEFAULT_SCREEN_PREFERENCES as n, MAX_MESSAGE_CHARS as o, DEFAULT_UI_SOUND_PREFERENCES as r, SCREEN_RESOLUTIONS as s, DEFAULT_CLIENT_PREFERENCES as t, UI_SOUND_LIBRARY as u };
