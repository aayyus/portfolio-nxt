import { NextResponse } from "next/server";
import { checkPassword, createToken, SESSION_COOKIE } from "@/lib/auth";

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const FAILURE_DELAY_MS = 500;

// Failed attempts per client address. Held in memory, so it resets when the
// server instance recycles: a speed bump against password guessing, not a
// hard guarantee. Every wrong guess is also delayed.
const failures = new Map<string, { count: number; lockedUntil: number }>();

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const record = failures.get(key);

  if (record && record.lockedUntil > Date.now()) {
    const minutes = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
      { status: 429 }
    );
  }

  const { password } = await request.json().catch(() => ({ password: "" }));

  if (typeof password !== "string" || !checkPassword(password)) {
    const count = (record?.count ?? 0) + 1;
    failures.set(key, {
      count: count >= MAX_FAILURES ? 0 : count,
      lockedUntil: count >= MAX_FAILURES ? Date.now() + LOCK_MS : 0,
    });
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  failures.delete(key);
  const { token, maxAge } = createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
