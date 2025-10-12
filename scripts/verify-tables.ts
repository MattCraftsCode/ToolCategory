import postgres from "postgres";
import { config } from "dotenv";

config();

const connectionString = process.env.DATABASE_URL!;

async function verifyTables() {
  const sql = postgres(connectionString, { prepare: false });

  try {
    console.log("🔍 Verifying Auth.js tables...\n");

    const tables = await sql`
      SELECT
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log("❌ No Auth.js tables found!");
      process.exit(1);
    }

    console.log("✅ Found Auth.js tables:");
    tables.forEach((table) => {
      console.log(`  - ${table.table_name} (${table.column_count} columns)`);
    });

    // Check foreign keys
    const fks = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name IN ('accounts', 'sessions')
    `;

    console.log("\n✅ Foreign key constraints:");
    fks.forEach((fk) => {
      console.log(`  - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    console.log("\n✅ All Auth.js database tables are properly configured!");

  } catch (error) {
    console.error("❌ Error verifying tables:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

verifyTables();
