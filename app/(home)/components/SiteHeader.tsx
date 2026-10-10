"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { clocks, navLinks, site, socials } from "@/lib/site";
import { EASE, Marquee } from "./ui";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Live times for each city. Blank until mount so server and client match. */
function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatters = useMemo(
    () =>
      clocks.map(({ tz }) => ({
        time: new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        zone: new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }),
      })),
    []
  );

  return (
    <Marquee className="label w-full" seconds={45}>
      {clocks.map(({ city }, i) => {
        const home = city === site.homeCity;
        const time = now ? formatters[i].time.format(now) : "--:--:--";
        const zone = now
          ? formatters[i].zone.formatToParts(now).find((p) => p.type === "timeZoneName")?.value
          : "";
        return (
          <span key={city} className="flex items-center whitespace-nowrap">
            <span className={cn("px-2 py-1.5", home && "bg-ink font-bold text-paper")}>
              {city} <span className="tabular-nums">{time}</span>{" "}
              <span className={home ? undefined : "opacity-50"}>{zone}</span>
            </span>
            <span className="px-3 opacity-40">/</span>
          </span>
        );
      })}
    </Marquee>
  );
}

function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="label flex h-full items-center gap-2 px-4 transition-colors duration-300 hover:bg-ink hover:text-paper"
    >
      {dark ? "Dark" : "Light"}
      <span className={cn("h-2.5 w-2.5 border border-current", dark && "bg-current")} />
    </button>
  );
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-ink text-paper"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex h-16 items-stretch border-b border-paper/30">
            <span className="flex items-center px-4 text-2xl font-bold tracking-[-0.08em]">
              {site.wordmark}.
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="label border-l border-paper/30 px-6 transition-colors hover:bg-paper hover:text-ink"
            >
              Close
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-4 md:px-[8.333%]">
            {navLinks.map((link, i) => (
              <div key={link.href} className="overflow-hidden border-b border-paper/20">
                <motion.a
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between py-1"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: EASE }}
                >
                  <span className="display-title pb-[0.08em] text-[clamp(3rem,11vw,7.5rem)] transition-transform duration-500 group-hover:translate-x-4">
                    {link.label}.
                  </span>
                  <span className="label tabular-nums opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.a>
              </div>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/30 px-4 py-5 md:px-[8.333%]">
            <a href={`mailto:${site.email}`} className="label hover:opacity-70">
              {site.email}
            </a>
            <div className="flex gap-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label hover:opacity-70"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-stretch border-b border-ink/40 bg-paper/90 backdrop-blur-md">
        <a
          href="#top"
          className="flex shrink-0 items-center border-r border-ink/40 px-4 text-2xl font-bold tracking-[-0.08em] md:w-[16.666%]"
        >
          {site.wordmark}.
        </a>
        <div className="hidden min-w-0 flex-1 items-center border-r border-ink/40 sm:flex">
          <WorldClock />
        </div>
        <div className="flex-1 sm:hidden" />
        <div className="border-r border-ink/40">
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="group flex w-16 shrink-0 flex-col items-center justify-center gap-[5px] transition-colors duration-300 hover:bg-ink"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-px w-5 bg-ink transition-colors group-hover:bg-paper" />
          ))}
        </button>
      </header>
      <MenuOverlay open={open} onClose={close} />
    </>
  );
}
