"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project, Skill } from "@/lib/types";
import { getIcon, ICON_LABELS } from "@/lib/icons";
import {
  LuTrash2,
  LuPlus,
  LuLogOut,
  LuLoader,
  LuExternalLink,
  LuLayoutGrid,
  LuWrench,
  LuImagePlus,
  LuX,
} from "react-icons/lu";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-green-400/60";

const emptyProject = { title: "", tag: "Shopify", link: "", cover: "", tech: [] as string[] };
const emptySkill = { text: "", description: "", icon: "SiShopify" };

export default function AdminDashboard({
  initialProjects,
  initialSkills,
}: {
  initialProjects: Project[];
  initialSkills: Skill[];
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [skills, setSkills] = useState(initialSkills);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function call(
    url: string,
    method: "POST" | "DELETE",
    body: unknown,
    busyKey: string
  ): Promise<any[] | null> {
    setBusy(busyKey);
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return null;
      }
      return data;
    } catch {
      setError("Network error — try again.");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setBusy("add-project");
    setError("");
    try {
      // Multipart so an image file can ride along; the server names it
      // after the project title and stores the resulting path as cover.
      const fd = new FormData();
      fd.append("title", projectForm.title);
      fd.append("tag", projectForm.tag);
      fd.append("link", projectForm.link);
      fd.append("cover", projectForm.cover);
      fd.append("tech", JSON.stringify(projectForm.tech));
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch("/api/projects", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }
      setProjects(data);
      setProjectForm(emptyProject);
      setImageFile(null);
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteProject(id: string) {
    const updated = await call("/api/projects", "DELETE", { id }, `del-${id}`);
    if (updated) setProjects(updated);
  }

  async function addSkill(e: React.FormEvent) {
    e.preventDefault();
    const updated = await call("/api/skills", "POST", skillForm, "add-skill");
    if (updated) {
      setSkills(updated);
      setSkillForm(emptySkill);
    }
  }

  async function deleteSkill(id: string) {
    const updated = await call("/api/skills", "DELETE", { id }, `del-${id}`);
    if (updated) setSkills(updated);
  }

  function toggleTech(name: string) {
    setProjectForm((f) => ({
      ...f,
      tech: f.tech.includes(name)
        ? f.tech.filter((t) => t !== name)
        : [...f.tech, name],
    }));
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030705] text-white">
      <div className="orb orb-green -top-40 -left-40 h-[30rem] w-[30rem]" />
      <div className="orb orb-emerald top-1/2 -right-40 h-[30rem] w-[30rem]" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {/* Header */}
        <header className="glass flex items-center justify-between rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-sm font-black text-black">
              AS
            </span>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white/70 transition-colors hover:text-green-300"
            >
              View Site <LuExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={logout}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white/70 transition-colors hover:text-red-400"
            >
              Logout <LuLogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Projects */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <LuLayoutGrid className="h-5 w-5 text-green-400" />
            Projects <span className="text-sm font-normal text-white/40">({projects.length})</span>
          </h2>

          <form
            onSubmit={addProject}
            className="glass gradient-border mt-4 space-y-4 rounded-2xl p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className={inputCls}
                placeholder="Title *"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Tag (e.g. Shopify) *"
                value={projectForm.tag}
                onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Live link (https://…) *"
                value={projectForm.link}
                onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={
                  imageFile ? "Using uploaded image" : "Cover image (/name.png or https://…)"
                }
                value={projectForm.cover}
                disabled={!!imageFile}
                onChange={(e) => setProjectForm({ ...projectForm, cover: e.target.value })}
              />
            </div>

            {/* Image upload — saved as <title-slug>.<ext> in /public */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="glass flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-2.5 text-xs font-semibold text-white/70 transition-all hover:border-green-400/50 hover:text-green-300">
                <LuImagePlus className="h-4 w-4" />
                {imageFile ? "Change image" : "Upload cover image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {imageFile && (
                <span className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs text-green-300">
                  {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(1)} MB)
                  <button
                    type="button"
                    aria-label="Remove selected image"
                    onClick={() => setImageFile(null)}
                    className="text-white/50 transition-colors hover:text-red-400"
                  >
                    <LuX className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              <span className="text-[11px] text-white/30">
                Saved as the project title, e.g. “My Store” → my-store.png (max 4 MB)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ICON_LABELS).map(([name, label]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleTech(name)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    projectForm.tech.includes(name)
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-black"
                      : "glass text-white/60 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={busy === "add-project"}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.4)] disabled:opacity-50"
            >
              {busy === "add-project" ? (
                <LuLoader className="h-4 w-4 animate-spin" />
              ) : (
                <LuPlus className="h-4 w-4" />
              )}
              Add Project
            </button>
          </form>

          <ul className="mt-4 space-y-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="glass flex items-center justify-between gap-4 rounded-xl px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {p.title}{" "}
                    <span className="ml-2 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-300">
                      {p.tag}
                    </span>
                  </p>
                  <p className="truncate text-xs text-white/40">{p.link}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden items-center gap-2 text-white/40 sm:flex">
                    {p.tech.map((t) => {
                      const Icon = getIcon(t);
                      return <Icon key={t} className="h-4 w-4" />;
                    })}
                  </div>
                  <button
                    onClick={() => deleteProject(p.id)}
                    disabled={busy === `del-${p.id}`}
                    aria-label={`Delete ${p.title}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    {busy === `del-${p.id}` ? (
                      <LuLoader className="h-4 w-4 animate-spin" />
                    ) : (
                      <LuTrash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section className="mt-12 pb-16">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <LuWrench className="h-5 w-5 text-green-400" />
            Skills <span className="text-sm font-normal text-white/40">({skills.length})</span>
          </h2>

          <form
            onSubmit={addSkill}
            className="glass gradient-border mt-4 space-y-4 rounded-2xl p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                className={inputCls}
                placeholder="Name *"
                value={skillForm.text}
                onChange={(e) => setSkillForm({ ...skillForm, text: e.target.value })}
              />
              <input
                className={`${inputCls} sm:col-span-2`}
                placeholder="Short description *"
                value={skillForm.description}
                onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ICON_LABELS).map(([name, label]) => {
                const Icon = getIcon(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSkillForm({ ...skillForm, icon: name })}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      skillForm.icon === name
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-black"
                        : "glass text-white/60 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                );
              })}
            </div>
            <button
              type="submit"
              disabled={busy === "add-skill"}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.4)] disabled:opacity-50"
            >
              {busy === "add-skill" ? (
                <LuLoader className="h-4 w-4 animate-spin" />
              ) : (
                <LuPlus className="h-4 w-4" />
              )}
              Add Skill
            </button>
          </form>

          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {skills.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <li
                  key={s.id}
                  className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="glass grid h-9 w-9 shrink-0 place-items-center rounded-lg">
                      <Icon className="h-4 w-4 text-green-400" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{s.text}</p>
                      <p className="truncate text-xs text-white/40">{s.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSkill(s.id)}
                    disabled={busy === `del-${s.id}`}
                    aria-label={`Delete ${s.text}`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    {busy === `del-${s.id}` ? (
                      <LuLoader className="h-4 w-4 animate-spin" />
                    ) : (
                      <LuTrash2 className="h-4 w-4" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
