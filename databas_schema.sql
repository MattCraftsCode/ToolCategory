create table public.accounts (
  "userId" text not null,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text null,
  access_token text null,
  expires_at integer null,
  token_type text null,
  scope text null,
  id_token text null,
  session_state text null,
  constraint accounts_provider_providerAccountId_pk primary key (provider, "providerAccountId"),
  constraint accounts_userId_users_id_fk foreign KEY ("userId") references users (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.categories (
  id bigserial not null,
  name character varying(100) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  slug character varying null,
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

create table public.friend_links (
  id bigserial not null,
  site_name character varying(100) null,
  site_url character varying(512) null,
  image_url character varying(512) null,
  code text null,
  status smallint null default 1,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint friend_links_pkey primary key (id)
) TABLESPACE pg_default;

create table public.sessions (
  "sessionToken" text not null,
  "userId" text not null,
  expires timestamp without time zone not null,
  constraint session_pkey primary key ("sessionToken"),
  constraint sessions_userId_users_id_fk foreign KEY ("userId") references users (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.site_categories (
  id bigserial not null,
  category_id bigint null,
  site_id bigint null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint site_categories_pkey primary key (id)
) TABLESPACE pg_default;


create table public.site_tags (
  id bigserial not null,
  tag_id bigint null,
  site_id bigint null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint site_tags_pkey primary key (id)
) TABLESPACE pg_default;


create table public.sites (
  id bigserial not null,
  name character varying(100) not null,
  introduction text null,
  image character varying(512) null,
  link character varying(512) null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  description text null,
  is_featured boolean null,
  user_id bigint null,
  slug character varying null,
  constraint sites_pkey primary key (id)
) TABLESPACE pg_default;

create table public.subscriptions (
  id bigserial not null,
  email character varying(255) not null,
  created_at timestamp with time zone null default now(),
  constraint subscriptions_pkey primary key (id)
) TABLESPACE pg_default;


create table public.tags (
  id bigserial not null,
  name character varying(100) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  slug character varying null,
  constraint tags_pkey primary key (id)
) TABLESPACE pg_default;


create table public.users (
  id text not null,
  name text null,
  email text not null,
  "emailVerified" timestamp without time zone null,
  image text null,
  constraint user_pkey primary key (id),
  constraint user_email_key unique (email)
) TABLESPACE pg_default;

create table public.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp without time zone not null,
  constraint verification_tokens_identifier_token_pk primary key (identifier, token)
) TABLESPACE pg_default;
