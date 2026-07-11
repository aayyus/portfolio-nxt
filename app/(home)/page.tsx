import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
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
    <main className="relative min-h-screen overflow-hidden bg-[#030705] text-white">
      <CursorGlow />

      {/* Ambient backdrop: glow orbs */}
      <div className="orb orb-green -top-40 -left-40 h-[34rem] w-[34rem]" />
      <div className="orb orb-emerald top-1/4 -right-52 h-[38rem] w-[38rem]" />
      <div className="orb orb-lime bottom-0 left-1/3 h-[30rem] w-[30rem]" />

      <div className="relative z-10">
        <Navbar />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <HeroSection />
          <Skills skills={skills} />
          <Projects projects={projects} />
        </div>
        <Footer />
      </div>
    </main>
  );
}
