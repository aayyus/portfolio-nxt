import { promises as fs } from "fs";
import path from "path";

/**
 * Data lives in a two-column Postgres table (key, value jsonb); uploaded
 * images go to Vercel Blob. Both are auto-provisioned in the Vercel
 * dashboard — no manual token to create or watch expire.
 *
 * - Without POSTGRES_URL (local dev): read/write data/<name>.json on disk,
 *   and save uploaded images straight into /public.
 * - With POSTGRES_URL (Vercel): read/write the Postgres table, and upload
 *   images to Vercel Blob for a permanent public URL.
 */

type DataFile = "projects" | "skills";

const POSTGRES_URL = process.env.POSTGRES_URL;

const localPath = (name: DataFile) =>
  path.join(process.cwd(), "data", `${name}.json`);

// Lazily created so `postgres` (and its native bindings) are never
// imported when running purely on the local fs fallback.
let sqlPromise: Promise<import("postgres").Sql> | null = null;
async function getSql() {
  if (!POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }
  if (!sqlPromise) {
    sqlPromise = import("postgres").then((mod) => mod.default(POSTGRES_URL));
  }
  return sqlPromise;
}

let tableEnsured = false;
async function ensureTable() {
  if (tableEnsured) return;
  const sql = await getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_data (
      key text PRIMARY KEY,
      value jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  tableEnsured = true;
}

export async function readJson<T>(name: DataFile): Promise<T> {
  if (!POSTGRES_URL) {
    const raw = await fs.readFile(localPath(name), "utf8");
    return JSON.parse(raw) as T;
  }

  await ensureTable();
  const sql = await getSql();
  const rows = await sql<{ value: T }[]>`
    SELECT value FROM portfolio_data WHERE key = ${name}
  `;
  if (rows.length === 0) {
    throw new Error(
      `No "${name}" row in Postgres yet — run "npm run seed:db" once (with ` +
        `POSTGRES_URL pointing at this database) to load the existing data/${name}.json.`
    );
  }
  return rows[0].value;
}

export async function writeJson<T>(name: DataFile, data: T): Promise<void> {
  if (!POSTGRES_URL) {
    if (process.env.VERCEL) {
      throw new Error(
        "Cannot save changes: POSTGRES_URL is not set. On Vercel the filesystem is " +
          "read-only, so admin edits need a Postgres database connected in the " +
          "project's Storage tab."
      );
    }
    const body = JSON.stringify(data, null, 2) + "\n";
    await fs.writeFile(localPath(name), body, "utf8");
    return;
  }

  await ensureTable();
  const sql = await getSql();
  // sql.json() lets the driver serialize `data` for the jsonb column itself.
  // Interpolating a pre-`JSON.stringify`'d string with a bare `::jsonb` cast
  // double-encodes it — the driver still treats the parameter as a JSON
  // value to serialize, wrapping the already-stringified text in quotes
  // again, so it lands as a jsonb *string* instead of a jsonb array/object.
  await sql`
    INSERT INTO portfolio_data (key, value, updated_at)
    VALUES (${name}, ${sql.json(data as any)}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

/**
 * Save an uploaded cover image and return its public URL. Local dev writes
 * straight into /public and returns a root-relative path; in production
 * it uploads to Vercel Blob and returns the permanent blob URL.
 */
export async function writeBinary(
  filename: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  // Blob has its own token, independent of Postgres — check it directly
  // rather than piggybacking on POSTGRES_URL, since the two services are
  // connected separately in the Vercel dashboard.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    if (process.env.VERCEL) {
      throw new Error(
        "Cannot upload image: BLOB_READ_WRITE_TOKEN is not set. On Vercel the " +
          "filesystem is read-only, so admin uploads need a Blob store connected " +
          "in the project's Storage tab."
      );
    }
    await fs.writeFile(path.join(process.cwd(), "public", filename), data);
    return `/${filename}`;
  }

  const { put } = await import("@vercel/blob");
  const blob = await put(filename, data, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}
