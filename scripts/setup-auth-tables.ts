import postgres from "postgres";
import { config } from "dotenv";

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment variables");
  process.exit(1);
}

console.log("📍 Connecting to database:", connectionString.replace(/:[^:@]+@/, ":****@"));

async function setupAuthTables() {
  const sql = postgres(connectionString, { prepare: false });

  try {
    console.log("🔍 Checking existing tables...");

    // Check if tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
    `;

    console.log("📋 Existing Auth tables:", tables.map(t => t.table_name).join(", ") || "none");

    console.log("\n🔨 Creating Auth.js tables...");

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text,
        "email" text NOT NULL UNIQUE,
        "emailVerified" timestamp,
        "image" text
      )
    `;
    console.log("✓ users table created/verified");

    // Create accounts table
    await sql`
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
      )
    `;
    console.log("✓ accounts table created/verified");

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "sessionToken" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL,
        "expires" timestamp NOT NULL
      )
    `;
    console.log("✓ sessions table created/verified");

    // Create verification_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
      )
    `;
    console.log("✓ verification_tokens table created/verified");

    // Add foreign key constraints (only if they don't exist)
    console.log("\n🔗 Adding foreign key constraints...");

    try {
      await sql`
        ALTER TABLE "accounts"
        ADD CONSTRAINT "accounts_userId_users_id_fk"
        FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action
      `;
      console.log("✓ accounts foreign key added");
    } catch (err: any) {
      if (err.code === "42710") {
        console.log("✓ accounts foreign key already exists");
      } else {
        throw err;
      }
    }

    try {
      await sql`
        ALTER TABLE "sessions"
        ADD CONSTRAINT "sessions_userId_users_id_fk"
        FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action
      `;
      console.log("✓ sessions foreign key added");
    } catch (err: any) {
      if (err.code === "42710") {
        console.log("✓ sessions foreign key already exists");
      } else {
        throw err;
      }
    }

    console.log("\n✅ All Auth.js tables are ready!");

  } catch (error) {
    console.error("❌ Error setting up tables:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

setupAuthTables();
