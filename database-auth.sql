-- Auth.js required tables for Drizzle adapter
-- Run this SQL if the tables don't already exist

CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp,
  "image" text
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "userId" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "sessionToken" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);

-- Add foreign key constraints
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk"
  FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk"
  FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
