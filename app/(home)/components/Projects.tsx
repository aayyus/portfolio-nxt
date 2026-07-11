"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Title from "./Title";
import { getIcon } from "@/lib/icons";
import type { Project } from "@/lib/types";
import { LuArrowUpRight } from "react-icons/lu";

function trackSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-24">
      <Title eyebrow="02 — Work" text="Featured Projects" />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ y: 32, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: (idx % 3) * 0.1, ease: "easeOut" }}
          >
            <Link
              href={project.link}
              target="_blank"
              onMouseMove={trackSpotlight}
              className="glass gradient-border group relative block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(34,197,94,0.3)]"
            >
              <div className="spotlight z-10" />
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030705] via-transparent to-transparent opacity-60" />
                <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-green-300">
                  {project.tag}
                </span>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-white transition-colors group-hover:text-green-300">
                    {project.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-white/40">
                    {project.tech.map((name) => {
                      const Icon = getIcon(name);
                      return <Icon key={name} className="h-4 w-4" />;
                    })}
                  </div>
                </div>
                <span className="glass grid h-10 w-10 place-items-center rounded-xl text-white/50 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-600 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                  <LuArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
