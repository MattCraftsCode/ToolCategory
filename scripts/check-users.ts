import postgres from "postgres";
import { config } from "dotenv";

config();

const connectionString = process.env.DATABASE_URL!;

async function checkUsers() {
  const sql = postgres(connectionString, { prepare: false });

  try {
    console.log("🔍 Checking users and accounts...\n");

    const users = await sql`
      SELECT id, name, email, "emailVerified", image
      FROM "users"
      ORDER BY email
    `;

    console.log(`📋 Found ${users.length} user(s):\n`);

    for (const user of users) {
      console.log(`👤 User: ${user.name || 'No name'}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   ✓ Verified: ${user.emailVerified ? 'Yes' : 'No'}`);

      // Get accounts for this user
      const accounts = await sql`
        SELECT provider, type, "providerAccountId"
        FROM accounts
        WHERE "userId" = ${user.id}
      `;

      console.log(`   🔗 Linked accounts: ${accounts.length}`);
      accounts.forEach(acc => {
        console.log(`      - ${acc.provider} (${acc.type})`);
      });
      console.log("");
    }

    // Check for duplicate emails
    const duplicates = await sql`
      SELECT email, COUNT(*) as count
      FROM "users"
      GROUP BY email
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length > 0) {
      console.log("⚠️  Warning: Duplicate emails found:");
      duplicates.forEach(d => {
        console.log(`   - ${d.email}: ${d.count} users`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sql.end();
  }
}

checkUsers();
