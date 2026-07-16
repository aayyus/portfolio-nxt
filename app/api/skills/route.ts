import crypto from "crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readJson, writeJson } from "@/lib/storage";
import type { Skill } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Catches thrown errors (e.g. from lib/storage.ts) and turns them into a
 * real JSON response instead of Next's default HTML 500 page — otherwise
 * the client's res.json() call throws too and the real error is lost
 * behind a generic "network error". */
function safeHandler(handler: (request: Request) => Promise<NextResponse>) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected server error";
      console.error(message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}

export const GET = safeHandler(async () => {
  const skills = await readJson<Skill[]>("skills");
  return NextResponse.json(skills);
});

export const POST = safeHandler(async (request: Request) => {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { text, description, icon } = body ?? {};
  if (
    typeof text !== "string" || !text.trim() ||
    typeof description !== "string" || !description.trim() ||
    typeof icon !== "string" || !icon.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const skills = await readJson<Skill[]>("skills");
  const skill: Skill = {
    id: crypto.randomUUID(),
    text: text.trim(),
    description: description.trim(),
    icon: icon.trim(),
  };
  const updated = [...skills, skill];
  await writeJson("skills", updated);
  return NextResponse.json(updated);
});

export const DELETE = safeHandler(async (request: Request) => {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json().catch(() => ({}));
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const skills = await readJson<Skill[]>("skills");
  const updated = skills.filter((s) => s.id !== id);
  if (updated.length === skills.length) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }
  await writeJson("skills", updated);
  return NextResponse.json(updated);
});
