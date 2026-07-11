"use client";

import React from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import { getIcon } from "@/lib/icons";
import type { Skill } from "@/lib/types";

export default function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="py-24">
      <Title eyebrow="01 — Stack" text="Skills & Tools" />

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, idx) => {
          const Icon = getIcon(skill.icon);
          return (
            <motion.div
              key={skill.id}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: "easeOut" }}
              className="glass gradient-border shine group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(34,197,94,0.35)]"
            >
              <div className="flex items-start gap-4">
                <div className="glass icon-wiggle grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-300 group-hover:bg-green-500/10">
                  <Icon className="h-6 w-6 text-green-400 transition-colors duration-300 group-hover:text-green-300" />
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
