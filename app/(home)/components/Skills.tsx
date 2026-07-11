"use client";

import React from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import { IconType } from "react-icons";
import {
  SiShopify,
  SiMeta,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGoogleanalytics,
} from "react-icons/si";
import { LuMail } from "react-icons/lu";

type Skill = {
  text: string;
  description: string;
  Icon: IconType;
  glow: string;
  iconColor: string;
};

const skills: Skill[] = [
  {
    text: "Shopify",
    description: "Theme development, Liquid, custom apps & storefront features",
    Icon: SiShopify,
    glow: "group-hover:shadow-[0_0_40px_rgba(52,211,153,0.25)]",
    iconColor: "text-emerald-400",
  },
  {
    text: "Klaviyo",
    description: "Email flows, segmentation & lifecycle marketing automation",
    Icon: LuMail,
    glow: "group-hover:shadow-[0_0_40px_rgba(217,70,239,0.25)]",
    iconColor: "text-fuchsia-400",
  },
  {
    text: "Meta Ads",
    description: "Pixel setup, conversion APIs & advertising integrations",
    Icon: SiMeta,
    glow: "group-hover:shadow-[0_0_40px_rgba(96,165,250,0.25)]",
    iconColor: "text-blue-400",
  },
  {
    text: "JavaScript",
    description: "Modern ES6+, DOM APIs & interactive storefront logic",
    Icon: SiJavascript,
    glow: "group-hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]",
    iconColor: "text-yellow-400",
  },
  {
    text: "TypeScript",
    description: "Type-safe applications that scale with confidence",
    Icon: SiTypescript,
    glow: "group-hover:shadow-[0_0_40px_rgba(56,189,248,0.25)]",
    iconColor: "text-sky-400",
  },
  {
    text: "React",
    description: "Component-driven UIs with hooks & modern patterns",
    Icon: SiReact,
    glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]",
    iconColor: "text-cyan-400",
  },
  {
    text: "Next.js",
    description: "Full-stack React with SSR, ISR & the App Router",
    Icon: SiNextdotjs,
    glow: "group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]",
    iconColor: "text-white",
  },
  {
    text: "Tailwind CSS",
    description: "Utility-first styling for rapid, consistent design",
    Icon: SiTailwindcss,
    glow: "group-hover:shadow-[0_0_40px_rgba(45,212,191,0.25)]",
    iconColor: "text-teal-400",
  },
  {
    text: "Analytics",
    description: "GA4, tracking & data-driven conversion optimization",
    Icon: SiGoogleanalytics,
    glow: "group-hover:shadow-[0_0_40px_rgba(251,146,60,0.25)]",
    iconColor: "text-orange-400",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24">
      <Title eyebrow="01 — Stack" text="Skills & Tools" />

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, idx) => {
          const Icon = skill.Icon;
          return (
            <motion.div
              key={skill.text}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: "easeOut" }}
              className={`glass gradient-border group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${skill.glow}`}
            >
              <div className="flex items-start gap-4">
                <div className="glass grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                  <Icon className={`h-6 w-6 ${skill.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{skill.text}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">
                    {skill.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
