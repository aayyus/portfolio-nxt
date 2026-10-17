"use client";

import React, { useEffect, useState } from "react";
import { onIntroDone } from "@/lib/motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The content column: inset one column from each edge of a 12-col grid and
 * edged with hairlines, so stacked sections form continuous vertical rails.
 */
export function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12">
      <div
        className={cn(
          "col-span-4 border-x border-ink/40 md:col-span-10 md:col-start-2",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Small uppercase eyebrow over a huge lowercase word: "THE / developer." */
export function SectionTitle({
  eyebrow,
  word,
  punctuation = ".",
  className,
}: {
  eyebrow: string;
  word: string;
  punctuation?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-b border-ink/40 px-4 pb-6 pt-24 md:px-6 md:pt-40",
        className
      )}
    >
      <p className="label opacity-70">{eyebrow}</p>
      {/* The h2 (always visible) watches for scroll, not the word inside it:
          the word starts pushed below the clip, so observing it directly can
          read as never-in-view. Bottom padding leaves room for descenders. */}
      <motion.h2
        className="display-title mt-3 overflow-hidden pb-[0.2em] text-[clamp(3.5rem,10vw,6rem)]"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.span
          className="inline-block"
          variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {word}
          {punctuation}
        </motion.span>
      </motion.h2>
    </div>
  );
}

/**
 * Text that rolls on hover: the label drops out the bottom while an
 * identical copy drops in from the top. Trigger it from any ancestor with
 * the `group/roll` class.
 */
export function RollText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative block overflow-hidden leading-[1.35]", className)}>
      <span className="block transition-transform duration-450 ease-roll group-hover/roll:translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block -translate-y-full transition-transform duration-450 ease-roll group-hover/roll:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

/** Outlined button that fills with ink on hover while its label rolls. */
export function RollButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "label group/roll inline-flex h-11 items-center border border-ink px-5 transition-colors duration-450 ease-roll hover:bg-ink hover:text-paper",
        className
      )}
    >
      <RollText>{children}</RollText>
    </a>
  );
}

/**
 * Infinite horizontal ticker. Renders the children twice and slides the
 * track by half its width, so each copy must be at least as wide as the
 * container — repeat items as needed when calling.
 */
export function Marquee({
  children,
  className,
  seconds = 30,
}: {
  children: React.ReactNode;
  className?: string;
  seconds?: number;
}) {
  return (
    <div className={cn("flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 animate-marquee hover:[animation-play-state:paused]"
        style={{ animationDuration: `${seconds}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fades content up into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A word whose letters rise in one after another. */
export function StaggerWord({
  text,
  className,
  inView = false,
  afterIntro = false,
  label,
}: {
  text: string;
  className?: string;
  /** Wait until scrolled into view instead of animating on mount. */
  inView?: boolean;
  /** When animating on mount, hold until the opening intro has finished. */
  afterIntro?: boolean;
  /** Accessible name; the individual letters are hidden from screen readers. */
  label?: string;
}) {
  const ready = useIntroDone(afterIntro);

  // The wrapper (always visible) drives the animation and cascades it to the
  // letters. Observing the letters themselves fails: they start pushed below
  // the clip, so they can read as out of view until it's too late.
  return (
    <motion.span
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("flex overflow-hidden pb-[0.24em]", className)}
      initial="hidden"
      animate={inView ? undefined : ready ? "shown" : "hidden"}
      whileInView={inView ? "shown" : undefined}
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        shown: { transition: { delayChildren: 0.12, staggerChildren: 0.06 } },
      }}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** True once the opening intro has finished (immediately if not waiting). */
export function useIntroDone(wait = true) {
  const [done, setDone] = useState(!wait);
  useEffect(() => (wait ? onIntroDone(() => setDone(true)) : undefined), [wait]);
  return done;
}

/**
 * The "A" logo. Drawn with the theme's ink and paper rather than fixed
 * colours, so it inverts with dark mode. (The favicon in app/icon.svg is
 * the fixed-colour version.)
 */
export function Logo({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="208 38 264 264"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="340" cy="170" r="130" className="fill-ink" />
      <circle cx="340" cy="170" r="118" fill="none" strokeWidth="1.5" className="stroke-paper" />
      <path
        d="M288 238 L340 102 L392 238"
        fill="none"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-paper"
      />
      {/* Ink outline under the crossbar cuts small gaps where it meets the legs */}
      <path d="M296 196 Q345 184 408 188" fill="none" strokeWidth="20" strokeLinecap="round" className="stroke-ink" />
      <path d="M296 196 Q345 184 408 188" fill="none" strokeWidth="10" strokeLinecap="round" className="stroke-paper" />
      <circle cx="340" cy="102" r="5" className="fill-ink" />
    </svg>
  );
}
