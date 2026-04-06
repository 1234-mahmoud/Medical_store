import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  // 1) Ensure id column is `userid` (old/new compatibility)
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'user_id'
      ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'userid'
      ) THEN
        ALTER TABLE users RENAME COLUMN user_id TO userid;
      END IF;
    END $$;
  `);

  // 2) Ensure password can store bcrypt hashes
  await pool.query(`ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(255);`);

  // 3) Show resulting columns
  const result = await pool.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name='users'
    ORDER BY ordinal_position;
  `);

  console.log("Users table columns after fix:");
  result.rows.forEach((r) =>
    console.log(`- ${r.column_name} (${r.data_type}${r.character_maximum_length ? `:${r.character_maximum_length}` : ""})`)
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
