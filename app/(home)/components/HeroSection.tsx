"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { LuMail, LuArrowDown } from "react-icons/lu";
import { getIcon } from "@/lib/icons";
import type { Skill } from "@/lib/types";

const chipCls =
  "orbit-counter glass flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-white/80 transition-colors duration-300 hover:border-green-400/50 hover:text-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]";

/** Deterministic seed from a skill's id, so scatter is stable across
 * server/client renders instead of using Math.random(). */
function seedFrom(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection({ skills }: { skills: Skill[] }) {
  return (
    <section className="flex min-h-screen flex-col-reverse items-center justify-center gap-16 pb-16 pt-32 lg:flex-row lg:justify-between lg:gap-0">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl space-y-8 text-center lg:text-left"
      >
        <motion.h1
          variants={item}
          className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
        >
          Building the
          <br />
          <span className="text-gradient">future of commerce.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto max-w-xl text-lg leading-relaxed text-white/60 lg:mx-0"
        >
          I&apos;m <span className="font-semibold text-white">Aayush Sharma</span> — a
          Shopify 360 developer crafting high-converting storefronts with custom theme
          development, Klaviyo automation, and Meta advertising integrations.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
        >
          <Link
            href="mailto:aayushat902@gmail.com"
            className="shine group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(34,197,94,0.45)] transition-all duration-300 hover:shadow-[0_0_56px_rgba(34,197,94,0.8)] active:scale-95"
          >
            <LuMail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            Contact Me
          </Link>
          <Link
            href="#projects"
            className="glass shine group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-green-300 active:scale-95"
          >
            View Projects
            <LuArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-10 pt-4 lg:justify-start"
        >
          {[
            { value: "7+", label: "Stores shipped" },
            { value: "360°", label: "Shopify expertise" },
            { value: "100%", label: "Client focused" },
          ].map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-xs tracking-wide text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Futuristic visual: hover to set the tech chips orbiting; they
          freeze wherever they land the moment the cursor leaves */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative grid place-items-center"
      >
        <div className="group relative h-72 w-72 sm:h-96 sm:w-96">
          {/* Static faint ring */}
          <div className="absolute inset-6 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full bg-green-500/10 blur-3xl animate-pulse-glow" />

          {/* Core glass card */}
          <div className="glass absolute inset-14 grid place-items-center rounded-full">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Shopify Dev
            </p>
          </div>

          {/* Every skill orbits the ring, scattered at a natural-looking
              spot rather than a perfectly even clock face — each chip
              gets a stable random-ish angle/radius offset seeded from its
              id. Each chip's placement rotate is canceled right after
              positioning it (rotate → out → rotate back), so it sits
              upright at rest; .orbit-counter then cancels only the live
              spin, keeping labels level while they swing around on
              hover. */}
          <div className="orbit-rotor absolute inset-0">
            {skills.map((skill, i) => {
              const Icon = getIcon(skill.icon);
              const seed = seedFrom(skill.id);
              const baseAngle = (360 / skills.length) * i;
              const angle = baseAngle + ((seed % 29) - 14); // ±14° scatter
              const radiusJitter = ((seed >> 4) % 71) - 35; // ±35px scatter
              return (
                <div
                  key={skill.id}
                  className="absolute left-1/2 top-1/2 [--orbit-r:150px] sm:[--orbit-r:195px]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translate(calc(var(--orbit-r) + ${radiusJitter}px)) rotate(${-angle}deg)`,
                  }}
                >
                  <div className={chipCls}>
                    <Icon className="h-3.5 w-3.5 text-green-400" /> {skill.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
