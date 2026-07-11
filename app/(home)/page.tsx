import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

export default function page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060c] text-white">
      {/* Ambient backdrop: masked grid + glow orbs */}
      <div className="pointer-events-none absolute inset-0 bg-grid-white/[0.04] mask-radial-faded" />
      <div className="orb orb-cyan -top-40 -left-40 h-[34rem] w-[34rem]" />
      <div className="orb orb-violet top-1/4 -right-52 h-[38rem] w-[38rem]" />
      <div className="orb orb-fuchsia bottom-0 left-1/3 h-[30rem] w-[30rem]" />

      <div className="relative z-10">
        <Navbar />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <HeroSection />
          <Skills />
          <Projects />
        </div>
        <Footer />
      </div>
    </main>
  );
}
