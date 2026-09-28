import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as getSql } from "./rolldown-runtime-D7D4PA-g.mjs";
import { o as MAX_MESSAGE_CHARS } from "./verdant-config-BzJNCK-j.mjs";
import { n as _enum, o as object, s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms-rQHart1X.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ID = string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
var NAME = string().trim().min(1).max(32);
var CODE = string().trim().min(4).max(12);
function normalizeName(value) {
	return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}
function newId(prefix) {
	return `${prefix}${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
function inviteCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "";
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	for (const b of bytes) out += alphabet[b % 32];
	return out;
}
var listServers_createServerFn_handler = createServerRpc({
	id: "ab668cb02cc5d0f5e442c8430ac2b4e511b36764c335c1788aa4754a28fda526",
	name: "listServers",
	filename: "src/lib/server/rooms.ts"
}, (opts) => listServers.__executeServer(opts));
var listServers = createServerFn({ method: "GET" }).handler(listServers_createServerFn_handler, async () => {
	return (await (await getSql()).query(`select s.id, s.name, s.description, s.invite_code, s.created_at::text as created_at,
            (select count(*)::int from members m where m.server_id = s.id) as member_count
     from servers s order by s.created_at asc`)).map((r) => ({
		id: r.id,
		name: r.name,
		description: r.description,
		inviteCode: r.invite_code,
		createdAt: r.created_at,
		memberCount: r.member_count
	}));
});
var createServer_createServerFn_handler = createServerRpc({
	id: "c76ce6a49e11f506175d4cf1dce99065afaa683f5b4b58bb939777fa4a777322",
	name: "createServer",
	filename: "src/lib/server/rooms.ts"
}, (opts) => createServer.__executeServer(opts));
var createServer = createServerFn({ method: "POST" }).validator((data) => {
	return object({
		name: NAME,
		description: string().max(240).optional(),
		memberId: ID,
		displayName: NAME,
		avatarData: string().max(52e4).nullable().optional()
	}).parse(data);
}).handler(createServer_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = newId("s");
	const code = inviteCode();
	await sql.query(`insert into servers (id, name, description, invite_code) values ($1, $2, $3, $4)`, [
		id,
		data.name,
		data.description ?? "",
		code
	]);
	await sql.query(`insert into channels (id, server_id, name, type, position) values
        ($1, $4, 'geral', 'text', 0),
        ($2, $4, 'jogos', 'text', 1),
        ($3, $4, 'sala', 'voice', 0)`, [
		newId("c"),
		newId("c"),
		newId("c"),
		id
	]);
	await sql.query(`insert into members (server_id, member_id, display_name, normalized_name, role, avatar_data)
       values ($1, $2, $3, $4, 'owner', $5)`, [
		id,
		data.memberId,
		data.displayName,
		normalizeName(data.displayName),
		data.avatarData ?? null
	]);
	return {
		id,
		inviteCode: code
	};
});
var joinServer_createServerFn_handler = createServerRpc({
	id: "d29143b30dce5a392e35b3135fe6af76f0dd257e1ba46f539f95e0270447bdd1",
	name: "joinServer",
	filename: "src/lib/server/rooms.ts"
}, (opts) => joinServer.__executeServer(opts));
var joinServer = createServerFn({ method: "POST" }).validator((data) => object({
	code: CODE,
	memberId: ID,
	displayName: NAME,
	avatarData: string().max(52e4).nullable().optional()
}).parse(data)).handler(joinServer_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const server = (await sql.query(`select id from servers where upper(invite_code) = upper($1) limit 1`, [data.code]))[0];
	if (!server) throw new Error("Convite inválido.");
	const existing = await sql.query(`select member_id, normalized_name from members where server_id = $1`, [server.id]);
	const normalized = normalizeName(data.displayName);
	if (!existing.find((m) => m.member_id === data.memberId) && existing.length >= 16) throw new Error(`Esta sala atingiu o limite de 16 pessoas.`);
	if (existing.find((m) => m.normalized_name === normalized && m.member_id !== data.memberId)) throw new Error("Esse nome já está em uso nesta sala.");
	await sql.query(`insert into members (server_id, member_id, display_name, normalized_name, role, avatar_data, last_seen)
       values ($1, $2, $3, $4, 'member', $5, now())
       on conflict (server_id, member_id) do update set
         display_name = excluded.display_name,
         normalized_name = excluded.normalized_name,
         avatar_data = coalesce(excluded.avatar_data, members.avatar_data),
         last_seen = now()`, [
		server.id,
		data.memberId,
		data.displayName,
		normalized,
		data.avatarData ?? null
	]);
	return { id: server.id };
});
var getServerBundle_createServerFn_handler = createServerRpc({
	id: "b89d0aa18eace7727d5425264becee39fb6adaf97953c58de9bcf9e475108ff4",
	name: "getServerBundle",
	filename: "src/lib/server/rooms.ts"
}, (opts) => getServerBundle.__executeServer(opts));
var getServerBundle = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	memberId: ID
}).parse(data)).handler(getServerBundle_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const server = (await sql.query(`select id, name, description, invite_code, created_at::text as created_at from servers where id = $1`, [data.serverId]))[0];
	if (!server) throw new Error("Servidor não encontrado.");
	await sql.query(`update members set last_seen = now() where server_id = $1 and member_id = $2`, [data.serverId, data.memberId]);
	const channels = await sql.query(`select id, server_id, name, type, position from channels where server_id = $1 order by type, position, name`, [data.serverId]);
	const members = await sql.query(`select member_id, display_name, role, avatar_data, last_seen::text as last_seen
       from members where server_id = $1 order by display_name`, [data.serverId]);
	return {
		server: {
			id: server.id,
			name: server.name,
			description: server.description,
			inviteCode: server.invite_code,
			createdAt: server.created_at,
			memberCount: members.length
		},
		channels: channels.map((c) => ({
			id: c.id,
			serverId: c.server_id,
			name: c.name,
			type: c.type,
			position: c.position
		})),
		members: members.map((m) => ({
			memberId: m.member_id,
			displayName: m.display_name,
			role: m.role,
			avatarData: m.avatar_data,
			lastSeen: m.last_seen
		}))
	};
});
var listMessages_createServerFn_handler = createServerRpc({
	id: "95702b845061e41160865a2597ab3376296de01a9a0a95ce834a991f31cb0c2a",
	name: "listMessages",
	filename: "src/lib/server/rooms.ts"
}, (opts) => listMessages.__executeServer(opts));
var listMessages = createServerFn({ method: "POST" }).validator((data) => object({ channelId: ID }).parse(data)).handler(listMessages_createServerFn_handler, async ({ data }) => {
	return (await (await getSql()).query(`select id, server_id, channel_id, author_id, author_name, content,
              created_at::text as created_at, edited_at::text as edited_at
       from messages where channel_id = $1
       order by created_at desc limit 80`, [data.channelId])).reverse().map((r) => ({
		id: r.id,
		serverId: r.server_id,
		channelId: r.channel_id,
		authorId: r.author_id,
		authorName: r.author_name,
		content: r.content,
		createdAt: r.created_at,
		editedAt: r.edited_at
	}));
});
var postMessage_createServerFn_handler = createServerRpc({
	id: "20f700ffcf9da90b09aea9644977aac097b939de3da9fd29fdf07bee6bae1237",
	name: "postMessage",
	filename: "src/lib/server/rooms.ts"
}, (opts) => postMessage.__executeServer(opts));
var postMessage = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	channelId: ID,
	authorId: ID,
	authorName: NAME,
	content: string().trim().min(1).max(MAX_MESSAGE_CHARS)
}).parse(data)).handler(postMessage_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = newId("m");
	const createdAt = (await sql.query(`insert into messages (id, server_id, channel_id, author_id, author_name, content)
       values ($1, $2, $3, $4, $5, $6)
       returning created_at::text as created_at`, [
		id,
		data.serverId,
		data.channelId,
		data.authorId,
		data.authorName,
		data.content
	]))[0]?.created_at ?? (/* @__PURE__ */ new Date()).toISOString();
	return {
		id,
		serverId: data.serverId,
		channelId: data.channelId,
		authorId: data.authorId,
		authorName: data.authorName,
		content: data.content,
		createdAt
	};
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "a8cb3d7e09c7facd7a76e4864bd9caa2e83495b5c9f73e4def0e93a85e63edd5",
	name: "updateProfile",
	filename: "src/lib/server/rooms.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	memberId: ID,
	displayName: NAME.optional(),
	avatarData: string().max(52e4).nullable().optional()
}).parse(data)).handler(updateProfile_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.displayName) {
		const normalized = normalizeName(data.displayName);
		if ((await sql.query(`select member_id from members where server_id = $1 and normalized_name = $2 and member_id <> $3`, [
			data.serverId,
			normalized,
			data.memberId
		]))[0]) throw new Error("Esse nome já está em uso nesta sala.");
		await sql.query(`update members set display_name = $3, normalized_name = $4, last_seen = now()
         where server_id = $1 and member_id = $2`, [
			data.serverId,
			data.memberId,
			data.displayName,
			normalized
		]);
	}
	if (data.avatarData !== void 0) await sql.query(`update members set avatar_data = $3, last_seen = now() where server_id = $1 and member_id = $2`, [
		data.serverId,
		data.memberId,
		data.avatarData
	]);
	return { ok: true };
});
var createChannel_createServerFn_handler = createServerRpc({
	id: "acf6304ae0766afa086290fd2dd54d9cd8d0360525354e94503820a49143a67c",
	name: "createChannel",
	filename: "src/lib/server/rooms.ts"
}, (opts) => createChannel.__executeServer(opts));
var createChannel = createServerFn({ method: "POST" }).validator((data) => object({
	serverId: ID,
	memberId: ID,
	name: string().trim().min(1).max(24),
	type: _enum(["text", "voice"])
}).parse(data)).handler(createChannel_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const owners = await sql.query(`select role from members where server_id = $1 and member_id = $2`, [data.serverId, data.memberId]);
	if (owners[0]?.role !== "owner" && owners[0]?.role !== "moderator") throw new Error("Só quem gerencia a sala pode criar canais.");
	const id = newId("c");
	const slug = data.name.normalize("NFKC").trim().toLocaleLowerCase("pt-BR").replace(/\s+/g, "-").replace(/[^a-z0-9à-ü-]/gi, "").slice(0, 24);
	await sql.query(`insert into channels (id, server_id, name, type, position) values ($1, $2, $3, $4, 10)`, [
		id,
		data.serverId,
		slug || "canal",
		data.type
	]);
	return { id };
});
//#endregion
export { createChannel_createServerFn_handler, createServer_createServerFn_handler, getServerBundle_createServerFn_handler, joinServer_createServerFn_handler, listMessages_createServerFn_handler, listServers_createServerFn_handler, postMessage_createServerFn_handler, updateProfile_createServerFn_handler };
