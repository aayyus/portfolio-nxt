"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { SiGithub, SiInstagram } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";

export const socials = [
  {
    Link: "https://www.linkedin.com/in/aayush-sharma-3a167222b/",
    Label: "LinkedIn",
    Icon: SlSocialLinkedin,
  },
  {
    Link: "https://github.com/aayyus/",
    Label: "GitHub",
    Icon: SiGithub,
  },
  {
    Link: "https://www.instagram.com/aayyus._/",
    Label: "Instagram",
    Icon: SiInstagram,
  },
];

export default function Navbar({ className }: { className?: string }) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("fixed inset-x-0 top-4 z-50 px-4", className)}
    >
      <nav className="glass mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-5 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-sm font-black text-black shadow-[0_0_24px_rgba(34,197,94,0.5)]">
            AS
          </span>
          <span className="hidden text-sm font-semibold tracking-wide text-white/90 sm:block">
            Aayush Sharma
            <span className="block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-green-400 to-emerald-500 transition-transform duration-300 group-hover:scale-x-100" />
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {socials.map((social) => {
            const Icon = social.Icon;
            return (
              <Link
                key={social.Label}
                href={social.Link}
                aria-label={social.Label}
                target="_blank"
                className="grid h-9 w-9 place-items-center rounded-xl text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-green-300 hover:shadow-[0_0_16px_rgba(34,197,94,0.4)]"
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
          <Link
            href="mailto:aayushat902@gmail.com"
            className="shine ml-2 hidden rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-green-500/80 hover:to-emerald-600/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] active:scale-95 sm:block"
          >
            Hire Me
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
