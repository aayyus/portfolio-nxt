"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LuLock, LuLoader } from "react-icons/lu";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass gradient-border relative z-10 w-full max-w-sm space-y-6 rounded-3xl p-8"
    >
      <div className="space-y-2 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-black shadow-[0_0_24px_rgba(34,197,94,0.5)]">
          <LuLock className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-bold">Admin Access</h1>
        <p className="text-sm text-white/50">Enter your password to manage the site.</p>
      </div>

      <div className="space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-green-400/60"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !password}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.4)] transition-all hover:shadow-[0_0_36px_rgba(34,197,94,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <LuLoader className="h-4 w-4 animate-spin" /> : "Sign In"}
      </button>
    </form>
  );
}
