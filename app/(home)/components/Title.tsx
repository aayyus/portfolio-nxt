"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Title({
  text,
  eyebrow,
  className,
}: {
  text: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("flex flex-col items-center gap-3 text-center", className)}
    >
      {eyebrow && (
        <span className="glass rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-green-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="text-gradient">{text}</span>
      </h2>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
    </motion.div>
  );
}
