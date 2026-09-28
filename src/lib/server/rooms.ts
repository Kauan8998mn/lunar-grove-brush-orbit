import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { MAX_MESSAGE_CHARS, MAX_PARTICIPANTS, type ChannelInfo, type MemberInfo, type MessageInfo, type Role, type ServerInfo } from "@/lib/verdant-config";

const ID = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
const NAME = z.string().trim().min(1).max(32);
const CODE = z.string().trim().min(4).max(12);

function normalizeName(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

function newId(prefix: string): string {
  return `${prefix}${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function inviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

export const listServers = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    name: string;
    description: string;
    invite_code: string;
    created_at: string;
    member_count: number;
  }>(
    `select s.id, s.name, s.description, s.invite_code, s.created_at::text as created_at,
            (select count(*)::int from members m where m.server_id = s.id) as member_count
     from servers s order by s.created_at asc`,
  );
  return rows.map(
    (r): ServerInfo => ({
      id: r.id,
      name: r.name,
      description: r.description,
      inviteCode: r.invite_code,
      createdAt: r.created_at,
      memberCount: r.member_count,
    }),
  );
});

export const createServer = createServerFn({ method: "POST" })
  .validator((data: { name: string; description?: string; memberId: string; displayName: string; avatarData?: string | null }) => {
    return z
      .object({
        name: NAME,
        description: z.string().max(240).optional(),
        memberId: ID,
        displayName: NAME,
        avatarData: z.string().max(520_000).nullable().optional(),
      })
      .parse(data);
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = newId("s");
    const code = inviteCode();
    await sql.query(`insert into servers (id, name, description, invite_code) values ($1, $2, $3, $4)`, [
      id,
      data.name,
      data.description ?? "",
      code,
    ]);
    await sql.query(
      `insert into channels (id, server_id, name, type, position) values
        ($1, $4, 'geral', 'text', 0),
        ($2, $4, 'jogos', 'text', 1),
        ($3, $4, 'sala', 'voice', 0)`,
      [newId("c"), newId("c"), newId("c"), id],
    );
    await sql.query(
      `insert into members (server_id, member_id, display_name, normalized_name, role, avatar_data)
       values ($1, $2, $3, $4, 'owner', $5)`,
      [id, data.memberId, data.displayName, normalizeName(data.displayName), data.avatarData ?? null],
    );
    return { id, inviteCode: code };
  });

export const joinServer = createServerFn({ method: "POST" })
  .validator((data: { code: string; memberId: string; displayName: string; avatarData?: string | null }) =>
    z
      .object({
        code: CODE,
        memberId: ID,
        displayName: NAME,
        avatarData: z.string().max(520_000).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const servers = await sql.query<{ id: string }>(
      `select id from servers where upper(invite_code) = upper($1) limit 1`,
      [data.code],
    );
    const server = servers[0];
    if (!server) throw new Error("Convite inválido.");
    const existing = await sql.query<{ member_id: string; normalized_name: string }>(
      `select member_id, normalized_name from members where server_id = $1`,
      [server.id],
    );
    const normalized = normalizeName(data.displayName);
    const self = existing.find((m) => m.member_id === data.memberId);
    if (!self && existing.length >= MAX_PARTICIPANTS) {
      throw new Error(`Esta sala atingiu o limite de ${MAX_PARTICIPANTS} pessoas.`);
    }
    const taken = existing.find((m) => m.normalized_name === normalized && m.member_id !== data.memberId);
    if (taken) throw new Error("Esse nome já está em uso nesta sala.");
    await sql.query(
      `insert into members (server_id, member_id, display_name, normalized_name, role, avatar_data, last_seen)
       values ($1, $2, $3, $4, 'member', $5, now())
       on conflict (server_id, member_id) do update set
         display_name = excluded.display_name,
         normalized_name = excluded.normalized_name,
         avatar_data = coalesce(excluded.avatar_data, members.avatar_data),
         last_seen = now()`,
      [server.id, data.memberId, data.displayName, normalized, data.avatarData ?? null],
    );
    return { id: server.id };
  });

export const getServerBundle = createServerFn({ method: "POST" })
  .validator((data: { serverId: string; memberId: string }) =>
    z.object({ serverId: ID, memberId: ID }).parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const servers = await sql.query<{
      id: string;
      name: string;
      description: string;
      invite_code: string;
      created_at: string;
    }>(`select id, name, description, invite_code, created_at::text as created_at from servers where id = $1`, [
      data.serverId,
    ]);
    const server = servers[0];
    if (!server) throw new Error("Servidor não encontrado.");
    await sql.query(`update members set last_seen = now() where server_id = $1 and member_id = $2`, [
      data.serverId,
      data.memberId,
    ]);
    const channels = await sql.query<{
      id: string;
      server_id: string;
      name: string;
      type: "text" | "voice";
      position: number;
    }>(`select id, server_id, name, type, position from channels where server_id = $1 order by type, position, name`, [
      data.serverId,
    ]);
    const members = await sql.query<{
      member_id: string;
      display_name: string;
      role: Role;
      avatar_data: string | null;
      last_seen: string;
    }>(
      `select member_id, display_name, role, avatar_data, last_seen::text as last_seen
       from members where server_id = $1 order by display_name`,
      [data.serverId],
    );
    const info: ServerInfo = {
      id: server.id,
      name: server.name,
      description: server.description,
      inviteCode: server.invite_code,
      createdAt: server.created_at,
      memberCount: members.length,
    };
    return {
      server: info,
      channels: channels.map(
        (c): ChannelInfo => ({
          id: c.id,
          serverId: c.server_id,
          name: c.name,
          type: c.type,
          position: c.position,
        }),
      ),
      members: members.map(
        (m): MemberInfo => ({
          memberId: m.member_id,
          displayName: m.display_name,
          role: m.role,
          avatarData: m.avatar_data,
          lastSeen: m.last_seen,
        }),
      ),
    };
  });

export const listMessages = createServerFn({ method: "POST" })
  .validator((data: { channelId: string }) => z.object({ channelId: ID }).parse(data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      server_id: string;
      channel_id: string;
      author_id: string;
      author_name: string;
      content: string;
      created_at: string;
      edited_at: string | null;
    }>(
      `select id, server_id, channel_id, author_id, author_name, content,
              created_at::text as created_at, edited_at::text as edited_at
       from messages where channel_id = $1
       order by created_at desc limit 80`,
      [data.channelId],
    );
    return rows.reverse().map(
      (r): MessageInfo => ({
        id: r.id,
        serverId: r.server_id,
        channelId: r.channel_id,
        authorId: r.author_id,
        authorName: r.author_name,
        content: r.content,
        createdAt: r.created_at,
        editedAt: r.edited_at,
      }),
    );
  });

export const postMessage = createServerFn({ method: "POST" })
  .validator((data: { serverId: string; channelId: string; authorId: string; authorName: string; content: string }) =>
    z
      .object({
        serverId: ID,
        channelId: ID,
        authorId: ID,
        authorName: NAME,
        content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = newId("m");
    const rows = await sql.query<{ created_at: string }>(
      `insert into messages (id, server_id, channel_id, author_id, author_name, content)
       values ($1, $2, $3, $4, $5, $6)
       returning created_at::text as created_at`,
      [id, data.serverId, data.channelId, data.authorId, data.authorName, data.content],
    );
    const createdAt = rows[0]?.created_at ?? new Date().toISOString();
    const message: MessageInfo = {
      id,
      serverId: data.serverId,
      channelId: data.channelId,
      authorId: data.authorId,
      authorName: data.authorName,
      content: data.content,
      createdAt,
    };
    return message;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .validator((data: { serverId: string; memberId: string; displayName?: string; avatarData?: string | null }) =>
    z
      .object({
        serverId: ID,
        memberId: ID,
        displayName: NAME.optional(),
        avatarData: z.string().max(520_000).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.displayName) {
      const normalized = normalizeName(data.displayName);
      const clash = await sql.query<{ member_id: string }>(
        `select member_id from members where server_id = $1 and normalized_name = $2 and member_id <> $3`,
        [data.serverId, normalized, data.memberId],
      );
      if (clash[0]) throw new Error("Esse nome já está em uso nesta sala.");
      await sql.query(
        `update members set display_name = $3, normalized_name = $4, last_seen = now()
         where server_id = $1 and member_id = $2`,
        [data.serverId, data.memberId, data.displayName, normalized],
      );
    }
    if (data.avatarData !== undefined) {
      await sql.query(`update members set avatar_data = $3, last_seen = now() where server_id = $1 and member_id = $2`, [
        data.serverId,
        data.memberId,
        data.avatarData,
      ]);
    }
    return { ok: true as const };
  });

export const createChannel = createServerFn({ method: "POST" })
  .validator((data: { serverId: string; memberId: string; name: string; type: "text" | "voice" }) =>
    z
      .object({
        serverId: ID,
        memberId: ID,
        name: z.string().trim().min(1).max(24),
        type: z.enum(["text", "voice"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const owners = await sql.query<{ role: string }>(
      `select role from members where server_id = $1 and member_id = $2`,
      [data.serverId, data.memberId],
    );
    if (owners[0]?.role !== "owner" && owners[0]?.role !== "moderator") {
      throw new Error("Só quem gerencia a sala pode criar canais.");
    }
    const id = newId("c");
    const slug = data.name
      .normalize("NFKC")
      .trim()
      .toLocaleLowerCase("pt-BR")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9à-ü-]/gi, "")
      .slice(0, 24);
    await sql.query(`insert into channels (id, server_id, name, type, position) values ($1, $2, $3, $4, 10)`, [
      id,
      data.serverId,
      slug || "canal",
      data.type,
    ]);
    return { id };
  });
