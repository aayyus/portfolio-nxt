import crypto from "crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readJson, writeJson, writeBinary } from "@/lib/storage";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // stay under Vercel's request limit
const IMAGE_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const ALIGNS = new Set(["top", "center", "bottom", "left", "right"]);

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Parses and validates the shared fields for both add and edit, and
 * uploads a new cover image when one was attached. Returns either the
 * parsed fields or a NextResponse to return immediately on error. */
async function parseProjectForm(
  form: FormData
): Promise<
  | {
      title: string;
      tag: string;
      link: string;
      cover: string;
      tech: string[];
      align: Project["align"];
    }
  | NextResponse
> {
  const title = String(form.get("title") ?? "").trim();
  const tag = String(form.get("tag") ?? "").trim();
  const link = String(form.get("link") ?? "").trim();
  let cover = String(form.get("cover") ?? "").trim();
  const alignRaw = String(form.get("align") ?? "top").trim();
  const align = (ALIGNS.has(alignRaw) ? alignRaw : "top") as Project["align"];
  let tech: string[] = [];
  try {
    const parsed = JSON.parse(String(form.get("tech") ?? "[]"));
    if (Array.isArray(parsed)) tech = parsed.filter((t) => typeof t === "string");
  } catch {}

  if (!title || !tag || !link) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  // Uploaded image wins over a pasted cover path; it's saved under the
  // project's title, e.g. "My Store" -> public/my-store.png -> /my-store.png
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    const ext = IMAGE_EXT[image.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Image must be PNG, JPEG, WebP, or GIF" },
        { status: 400 }
      );
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large — keep it under 4 MB" },
        { status: 400 }
      );
    }
    const slug = slugify(title);
    if (!slug) {
      return NextResponse.json({ error: "Title must contain letters or numbers" }, { status: 400 });
    }
    await writeBinary(`public/${slug}.${ext}`, Buffer.from(await image.arrayBuffer()));
    cover = `/${slug}.${ext}`;
  }

  if (!cover) {
    return NextResponse.json(
      { error: "Add a cover image — upload a file or paste a path/URL" },
      { status: 400 }
    );
  }
  if (!cover.startsWith("/") && !cover.startsWith("https://")) {
    return NextResponse.json(
      { error: "Cover must be a /public path or an https:// URL" },
      { status: 400 }
    );
  }

  return { title, tag, link, cover, tech, align };
}

export async function GET() {
  const projects = await readJson<Project[]>("projects");
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const parsed = await parseProjectForm(form);
  if (parsed instanceof NextResponse) return parsed;

  const projects = await readJson<Project[]>("projects");
  const project: Project = { id: crypto.randomUUID(), ...parsed };
  const updated = [project, ...projects];
  await writeJson("projects", updated);
  return NextResponse.json(updated);
}

export async function PATCH(request: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const id = String(form.get("id") ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const parsed = await parseProjectForm(form);
  if (parsed instanceof NextResponse) return parsed;

  const projects = await readJson<Project[]>("projects");
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const updated = [...projects];
  updated[index] = { ...projects[index], ...parsed, id };
  await writeJson("projects", updated);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json().catch(() => ({}));
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const projects = await readJson<Project[]>("projects");
  const updated = projects.filter((p) => p.id !== id);
  if (updated.length === projects.length) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  await writeJson("projects", updated);
  return NextResponse.json(updated);
}
