"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getIcon, ICON_LABELS } from "@/lib/icons";
import { site } from "@/lib/site";
import type { Project } from "@/lib/types";
import { EASE, Frame, Marquee, SectionTitle } from "./ui";

// Typical width/height of a desktop site screenshot, used until the real
// image has loaded and reported its own proportions.
const DEFAULT_RATIO = 1.9;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Works({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const railRef = useRef<HTMLDivElement>(null);
  const count = projects.length;

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + count) % count),
    [count]
  );

  // Keep the active thumbnail centred in the rail. Scrolling the rail
  // directly (rather than scrollIntoView) never moves the page itself.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !thumb) return;
    if (getComputedStyle(rail).flexDirection === "row") {
      rail.scrollTo({
        left: thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2,
        behavior: "smooth",
      });
    } else {
      rail.scrollTo({
        top: thumb.offsetTop - rail.clientHeight / 2 + thumb.clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [active]);

  if (count === 0) return null;
  const p = projects[active];

  return (
    <section id="work" className="scroll-mt-16">
      <Frame>
        <SectionTitle eyebrow="Selected" word="works" />
        <div
          tabIndex={0}
          aria-label="Project viewer — use the arrow keys to browse"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              go(1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              go(-1);
            }
          }}
          className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
        >
          {/* Full-width screenshot, sized to the image's own proportions so
              nothing is cropped. The box eases between ratios as you browse. */}
          <div
            className="relative overflow-hidden border-b border-ink/40 bg-ink/10 transition-[aspect-ratio] duration-500"
            style={{ aspectRatio: String(ratios[p.id] ?? DEFAULT_RATIO) }}
          >
            <AnimatePresence initial={false}>
              <motion.a
                key={p.id}
                href={p.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${p.title}`}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 84vw"
                  // Screenshots are full of small text, which the default
                  // quality (75) visibly blurs
                  quality={90}
                  className="object-contain"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      const r = img.naturalWidth / img.naturalHeight;
                      setRatios((prev) => (prev[p.id] === r ? prev : { ...prev, [p.id]: r }));
                    }
                  }}
                />
              </motion.a>
            </AnimatePresence>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-10">
            {/* Detail card */}
            <div className="flex min-h-[18rem] flex-col bg-ink p-5 text-paper md:col-span-4 md:p-6">
              <div className="label flex items-start justify-between gap-4 opacity-75">
                <span className="tabular-nums">
                  {pad(active + 1)} / {pad(count)}
                </span>
                <span>{p.tag}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <h3 className="mt-8 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-4xl">
                    {p.title}
                  </h3>
                  {p.tech.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.tech.map((name) => {
                        const Icon = getIcon(name);
                        return (
                          <li
                            key={name}
                            className="label flex items-center gap-1.5 border border-paper/50 px-2 py-1.5"
                          >
                            <Icon className="h-3 w-3" />
                            {ICON_LABELS[name] ?? name}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-auto flex items-center justify-between gap-4 pt-10">
                <div className="flex">
                  {([-1, 1] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => go(dir)}
                      aria-label={dir === -1 ? "Previous project" : "Next project"}
                      className="-ml-px grid h-10 w-10 place-items-center border border-paper/50 transition-colors first:ml-0 hover:bg-paper hover:text-ink"
                    >
                      {dir === -1 ? "←" : "→"}
                    </button>
                  ))}
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-lg tracking-[-0.01em] md:text-xl"
                >
                  VISIT SITE
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &gt;
                  </span>
                </a>
              </div>
            </div>

            {/* Thumbnail strip, wide like the screenshots */}
            <div
              ref={railRef}
              className="no-scrollbar relative flex items-stretch overflow-x-auto border-t border-ink/40 md:col-span-6 md:border-t-0"
            >
              {projects.map((proj, i) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${proj.title}`}
                  aria-pressed={i === active}
                  className="relative aspect-[19/10] w-44 shrink-0 self-end overflow-hidden border-r border-ink/40 md:w-56"
                >
                  <Image
                    src={proj.cover}
                    alt=""
                    fill
                    sizes="224px"
                    quality={85}
                    className={cn(
                      "object-cover object-top transition duration-500",
                      i === active ? "opacity-100" : "opacity-40 grayscale hover:opacity-80"
                    )}
                  />
                  {i === active && (
                    <span className="absolute inset-0 ring-2 ring-inset ring-ink" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Frame>

      <a
        href={`mailto:${site.email}`}
        className="block border-y border-ink/40 transition-colors duration-300 hover:bg-ink hover:text-paper"
      >
        <Marquee className="py-4 md:py-5" seconds={28}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center whitespace-nowrap text-2xl font-semibold uppercase tracking-[-0.03em] md:text-4xl"
            >
              <span className="px-6">Available for new projects</span>
              <span className="opacity-40">/</span>
            </span>
          ))}
        </Marquee>
      </a>
    </section>
  );
}
