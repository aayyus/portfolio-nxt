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
import MotionPrefs from "./components/MotionPrefs";
import { site, socials } from "@/lib/site";
import { readJson } from "@/lib/storage";
import type { Project, Skill } from "@/lib/types";
import fallbackProjects from "@/data/projects.json";
import fallbackSkills from "@/data/skills.json";

// Served as a cached static page. Saving in the admin panel refreshes it
// immediately (the API routes call revalidatePath); this hourly refresh is
// only a safety net.
export const revalidate = 3600;

/** Live data, or the copy bundled with the build if the database is down —
 * a slightly stale portfolio beats an error page. */
async function loadContent(): Promise<{ projects: Project[]; skills: Skill[] }> {
  try {
    const [projects, skills] = await Promise.all([
      readJson<Project[]>("projects"),
      readJson<Skill[]>("skills"),
    ]);
    return { projects, skills };
  } catch (err) {
    console.error("Falling back to bundled data:", err);
    return {
      projects: fallbackProjects as Project[],
      skills: fallbackSkills as Skill[],
    };
  }
}

export default async function page() {
  const { projects, skills } = await loadContent();

  // Structured data so search engines understand who the site is about
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.roles[0],
    knowsAbout: skills.map((s) => s.text),
    sameAs: socials.map((s) => s.href),
  };

  return (
    <MotionPrefs>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* First tab stop: lets keyboard users jump past the header */}
      <a
        href="#work"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to work
      </a>
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
    </MotionPrefs>
  );
}
