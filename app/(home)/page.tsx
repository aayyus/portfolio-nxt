import React from "react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import About from "./components/About";
import Works from "./components/Works";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import CursorGlow from "./components/CursorGlow";
import SmoothScroll from "./components/SmoothScroll";
import Intro from "./components/Intro";
import { readJson } from "@/lib/storage";
import type { Project, Skill } from "@/lib/types";

// Re-read data on each request so admin edits show up without a manual rebuild
export const dynamic = "force-dynamic";

export default async function page() {
  const [projects, skills] = await Promise.all([
    readJson<Project[]>("projects"),
    readJson<Skill[]>("skills"),
  ]);

  return (
    <>
      <SmoothScroll />
      <Intro />
      <CursorGlow />
      <SiteHeader />
      {/* overflow-x-clip (not hidden) keeps the sticky header working */}
      <main className="overflow-x-clip">
        <Hero skills={skills} />
        <About projectCount={projects.length} skillCount={skills.length} />
        <Works projects={projects} />
        <Stack skills={skills} />
        <Contact />
      </main>
    </>
  );
}
