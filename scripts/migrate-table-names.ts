import postgres from "postgres";
import { config } from "dotenv";

config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment variables");
  process.exit(1);
}

console.log("📍 Connecting to database:", connectionString.replace(/:[^:@]+@/, ":****@"));

async function migrateTableNames() {
  const sql = postgres(connectionString, { prepare: false });

  try {
    console.log("🔍 Checking for old table names...\n");

    // Check which tables exist
    const existingTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user', 'account', 'session', 'verificationToken', 'users', 'accounts', 'sessions', 'verification_tokens')
    `;

    const tableNames = existingTables.map(t => t.table_name);
    console.log("📋 Found tables:", tableNames.join(", "));

    const hasOldNames = tableNames.some(name =>
      ['user', 'account', 'session', 'verificationToken'].includes(name)
    );

    const hasNewNames = tableNames.some(name =>
      ['users', 'accounts', 'sessions', 'verification_tokens'].includes(name)
    );

    if (!hasOldNames && hasNewNames) {
      console.log("\n✅ Tables already use new names. No migration needed!");
      return;
    }

    if (!hasOldNames && !hasNewNames) {
      console.log("\n⚠️  No Auth.js tables found. Run 'pnpm db:setup' first.");
      return;
    }

    console.log("\n🔄 Starting table renaming migration...\n");

    // Drop foreign key constraints first
    console.log("1️⃣ Dropping foreign key constraints...");

    try {
      await sql`ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_userId_user_id_fk"`;
      console.log("   ✓ Dropped account_userId_user_id_fk");
    } catch (err) {
      console.log("   ⚠ Constraint account_userId_user_id_fk not found");
    }

    try {
      await sql`ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_userId_user_id_fk"`;
      console.log("   ✓ Dropped session_userId_user_id_fk");
    } catch (err) {
      console.log("   ⚠ Constraint session_userId_user_id_fk not found");
    }

    // Rename tables
    console.log("\n2️⃣ Renaming tables...");

    if (tableNames.includes('user')) {
      await sql`ALTER TABLE "user" RENAME TO "users"`;
      console.log("   ✓ user → users");
    }

    if (tableNames.includes('account')) {
      await sql`ALTER TABLE "account" RENAME TO "accounts"`;
      console.log("   ✓ account → accounts");
    }

    if (tableNames.includes('session')) {
      await sql`ALTER TABLE "session" RENAME TO "sessions"`;
      console.log("   ✓ session → sessions");
    }

    if (tableNames.includes('verificationToken')) {
      await sql`ALTER TABLE "verificationToken" RENAME TO "verification_tokens"`;
      console.log("   ✓ verificationToken → verification_tokens");
    }

    // Rename constraints
    console.log("\n3️⃣ Renaming primary key constraints...");

    try {
      await sql`ALTER TABLE "accounts" RENAME CONSTRAINT "account_provider_providerAccountId_pk" TO "accounts_provider_providerAccountId_pk"`;
      console.log("   ✓ Renamed accounts primary key constraint");
    } catch (err) {
      console.log("   ⚠ Accounts constraint already renamed or not found");
    }

    try {
      await sql`ALTER TABLE "verification_tokens" RENAME CONSTRAINT "verificationToken_identifier_token_pk" TO "verification_tokens_identifier_token_pk"`;
      console.log("   ✓ Renamed verification_tokens primary key constraint");
    } catch (err) {
      console.log("   ⚠ Verification tokens constraint already renamed or not found");
    }

    // Add new foreign key constraints
    console.log("\n4️⃣ Adding new foreign key constraints...");

    try {
      await sql`
        ALTER TABLE "accounts"
        ADD CONSTRAINT "accounts_userId_users_id_fk"
        FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action
      `;
      console.log("   ✓ Added accounts_userId_users_id_fk");
    } catch (err: any) {
      if (err.code === "42710") {
        console.log("   ✓ accounts_userId_users_id_fk already exists");
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
      console.log("   ✓ Added sessions_userId_users_id_fk");
    } catch (err: any) {
      if (err.code === "42710") {
        console.log("   ✓ sessions_userId_users_id_fk already exists");
      } else {
        throw err;
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n💡 Run 'pnpm db:verify' to verify the new table names.");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrateTableNames();
