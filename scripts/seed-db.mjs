// One-time setup: loads the existing data/projects.json and data/skills.json
// into the Postgres table the app reads from. Safe to re-run — it upserts,
// so running it again just overwrites with whatever is currently in those
// files (handy if you ever want to reset the live site back to the repo's
// committed data).
//
// Usage:
//   1. In Vercel: create a Postgres database and connect it to this project
//      (Project -> Storage -> Create Database), which auto-adds POSTGRES_URL
//      to your environment variables.
//   2. Pull that env var locally:  npx vercel env pull .env.local
//   3. Run:  npm run seed:db

import { readFile } from "fs/promises";
import path from "path";
import postgres from "postgres";
import "dotenv/config";

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error(
    "POSTGRES_URL is not set. Run `npx vercel env pull .env.local` first, " +
      "or set POSTGRES_URL manually before running this script."
  );
  process.exit(1);
}

const sql = postgres(POSTGRES_URL);

async function seed(name) {
  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  const raw = await readFile(filePath, "utf8");
  const value = JSON.parse(raw);

  await sql`
    INSERT INTO portfolio_data (key, value, updated_at)
    VALUES (${name}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
  console.log(`Seeded "${name}" (${value.length} items)`);
}

try {
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_data (
      key text PRIMARY KEY,
      value jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await seed("projects");
  await seed("skills");
  console.log("Done.");
} finally {
  await sql.end();
}
