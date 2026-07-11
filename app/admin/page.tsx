import React from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readJson } from "@/lib/storage";
import type { Project, Skill } from "@/lib/types";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const [projects, skills] = await Promise.all([
    readJson<Project[]>("projects"),
    readJson<Skill[]>("skills"),
  ]);

  return <AdminDashboard initialProjects={projects} initialSkills={skills} />;
}
