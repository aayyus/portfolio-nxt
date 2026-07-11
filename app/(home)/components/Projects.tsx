"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Title from "./Title";
import { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiBootstrap,
  SiShopify,
} from "react-icons/si";
import { LuArrowUpRight } from "react-icons/lu";

type Project = {
  title: string;
  tag: string;
  tech: IconType[];
  link: string;
  cover: string;
};

const projects: Project[] = [
  {
    title: "Lydian AU",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://lydian.au/",
    cover: "/project7.png",
  },
  {
    title: "Wellness with Jess",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://lesswithjess.com.au/",
    cover: "/project8.png",
  },
  {
    title: "Torbreck Vintners",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://torbreck.com/",
    cover: "/torbreck.png",
  },
  {
    title: "Etikette Candles",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://etikettecandles.com/",
    cover: "/etikette.png",
  },
  {
    title: "Neon Packaging",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://www.neonpackaging.com.au/",
    cover: "/neon.png",
  },
  {
    title: "UNTD2",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://untd2.com/",
    cover: "/untd.png",
  },
  {
    title: "Island Vibes",
    tag: "Shopify",
    tech: [SiJavascript, SiShopify],
    link: "https://www.island-vibes.com.au/",
    cover: "/island.png",
  },
  {
    title: "Dmerce",
    tag: "Web App",
    tech: [SiNextdotjs, SiCss3],
    link: "https://dmerce.vercel.app/",
    cover: "/project1.png",
  },
  {
    title: "Merav Services",
    tag: "Website",
    tech: [SiJavascript, SiHtml5, SiCss3, SiBootstrap],
    link: "https://www.meravservices.com.np/",
    cover: "/project2.png",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <Title eyebrow="02 — Work" text="Featured Projects" />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ y: 32, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: (idx % 3) * 0.1, ease: "easeOut" }}
          >
            <Link
              href={project.link}
              target="_blank"
              className="glass gradient-border group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_60px_rgba(139,92,246,0.25)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060c] via-transparent to-transparent opacity-60" />
                <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-300">
                  {project.tag}
                </span>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-white transition-colors group-hover:text-cyan-300">
                    {project.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-white/40">
                    {project.tech.map((Icon, i) => (
                      <Icon key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
                <span className="glass grid h-10 w-10 place-items-center rounded-xl text-white/50 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-fuchsia-500 group-hover:text-white">
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
