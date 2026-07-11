import { promises as fs } from "fs";
import path from "path";

/**
 * Data lives in data/<name>.json inside the repo.
 *
 * - Without GITHUB_TOKEN (local dev): read/write the files on disk.
 * - With GITHUB_TOKEN (Vercel): read/write through the GitHub contents API,
 *   so every admin edit becomes a commit and Vercel redeploys with the new data.
 */

type DataFile = "projects" | "skills";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? "aayyus/portfolio-nxt";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

const localPath = (name: DataFile) =>
  path.join(process.cwd(), "data", `${name}.json`);

const apiUrl = (name: DataFile) =>
  `https://api.github.com/repos/${GITHUB_REPO}/contents/data/${name}.json?ref=${GITHUB_BRANCH}`;

const fileApiUrl = (repoPath: string) =>
  `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}?ref=${GITHUB_BRANCH}`;

const ghHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export async function readJson<T>(name: DataFile): Promise<T> {
  if (!GITHUB_TOKEN) {
    const raw = await fs.readFile(localPath(name), "utf8");
    return JSON.parse(raw) as T;
  }

  const res = await fetch(apiUrl(name), {
    headers: { ...ghHeaders, Accept: "application/vnd.github.raw+json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub read failed for ${name}: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function writeJson<T>(name: DataFile, data: T): Promise<void> {
  const body = JSON.stringify(data, null, 2) + "\n";

  if (!GITHUB_TOKEN) {
    await fs.writeFile(localPath(name), body, "utf8");
    return;
  }

  // The contents API needs the current blob SHA to update an existing file.
  const metaRes = await fetch(apiUrl(name), {
    headers: ghHeaders,
    cache: "no-store",
  });
  if (!metaRes.ok) {
    throw new Error(`GitHub metadata read failed for ${name}: ${metaRes.status}`);
  }
  const meta = (await metaRes.json()) as { sha: string };

  const putRes = await fetch(apiUrl(name), {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify({
      message: `Update ${name} via admin panel`,
      content: Buffer.from(body).toString("base64"),
      sha: meta.sha,
      branch: GITHUB_BRANCH,
    }),
  });
  if (!putRes.ok) {
    throw new Error(`GitHub write failed for ${name}: ${putRes.status}`);
  }
}

/**
 * Save a binary file (e.g. an uploaded project cover) at a repo-relative
 * path like "public/my-project.png". Same split as writeJson: local disk
 * in dev, a GitHub commit in production.
 */
export async function writeBinary(repoPath: string, data: Buffer): Promise<void> {
  if (!GITHUB_TOKEN) {
    await fs.writeFile(path.join(process.cwd(), repoPath), data);
    return;
  }

  // Existing file needs its SHA to be overwritten; a new file has none.
  const metaRes = await fetch(fileApiUrl(repoPath), {
    headers: ghHeaders,
    cache: "no-store",
  });
  const sha = metaRes.ok
    ? ((await metaRes.json()) as { sha: string }).sha
    : undefined;

  const putRes = await fetch(fileApiUrl(repoPath), {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify({
      message: `Upload ${repoPath} via admin panel`,
      content: data.toString("base64"),
      ...(sha ? { sha } : {}),
      branch: GITHUB_BRANCH,
    }),
  });
  if (!putRes.ok) {
    throw new Error(`GitHub upload failed for ${repoPath}: ${putRes.status}`);
  }
}
