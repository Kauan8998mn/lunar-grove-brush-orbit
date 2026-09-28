create table if not exists servers (
  id text primary key,
  name text not null,
  description text not null default '',
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists channels (
  id text primary key,
  server_id text not null references servers(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text', 'voice')),
  position int not null default 0
);

create table if not exists members (
  server_id text not null references servers(id) on delete cascade,
  member_id text not null,
  display_name text not null,
  normalized_name text not null,
  role text not null default 'member',
  avatar_data text,
  last_seen timestamptz not null default now(),
  primary key (server_id, member_id)
);

create unique index if not exists members_name_uniq
  on members (server_id, normalized_name);

create index if not exists members_seen_idx
  on members (server_id, last_seen desc);

create table if not exists messages (
  id text primary key,
  server_id text not null,
  channel_id text not null,
  author_id text not null,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index if not exists messages_channel_idx
  on messages (channel_id, created_at);

insert into servers (id, name, description, invite_code)
values (
  'bosque',
  'Bosque',
  'Sala aberta do Verdant — voz, chat e tela em até 16 pessoas, pela internet, sem VPN.',
  'BOSQUE'
) on conflict (id) do nothing;

insert into channels (id, server_id, name, type, position)
values
  ('bosque-geral', 'bosque', 'geral', 'text', 0),
  ('bosque-jogos', 'bosque', 'jogos', 'text', 1),
  ('bosque-sala', 'bosque', 'sala', 'voice', 0)
on conflict (id) do nothing;
