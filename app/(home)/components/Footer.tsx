"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { socials } from "./Navbar";
import { LuMail } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass gradient-border relative overflow-hidden rounded-3xl p-10 text-center sm:p-16"
        >
          <div className="orb orb-violet -top-24 left-1/2 h-64 w-64 -translate-x-1/2" />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s build something
            <br />
            <span className="text-gradient">extraordinary together.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-white/50">
            Have a project in mind? I&apos;m currently open to new opportunities and
            collaborations.
          </p>
          <Link
            href="mailto:aayushat902@gmail.com"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_32px_rgba(139,92,246,0.45)] transition-all hover:shadow-[0_0_48px_rgba(139,92,246,0.7)]"
          >
            <LuMail className="h-4 w-4" />
            Get In Touch
          </Link>
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Aayush Sharma. Crafted with Next.js.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((social) => {
              const Icon = social.Icon;
              return (
                <Link
                  key={social.Label}
                  href={social.Link}
                  aria-label={social.Label}
                  target="_blank"
                  className="glass grid h-10 w-10 place-items-center rounded-xl text-white/50 transition-all hover:text-cyan-300"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
