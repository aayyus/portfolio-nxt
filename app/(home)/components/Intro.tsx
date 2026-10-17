"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lockScroll, markIntroDone } from "@/lib/motion";
import { site } from "@/lib/site";

const COUNT_MS = 1400;
const SEEN_KEY = "intro-seen";

// Runs while the HTML is still being parsed — before first paint — so a
// visitor who has already seen the intro this session (or prefers reduced
// motion) never gets even a flash of it.
const SKIP_SCRIPT = `try{if(sessionStorage.getItem("${SEEN_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-skip")}catch(e){}`;

/**
 * Full-screen opening: a counter runs to 100, then the panel wipes up to
 * reveal the page and the hero starts its entrance. Plays once per browser
 * session.
 *
 * It renders on the server too, so the page is covered from the very first
 * paint instead of flashing the hero underneath.
 */
export default function Intro() {
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-skip")) {
      setPhase("gone");
      markIntroDone();
      return;
    }

    lockScroll(true);
    let timer: ReturnType<typeof setTimeout>;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / COUNT_MS);
      // Ease-out so the count races early and settles on 100
      setCount(Math.round(100 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
      else timer = setTimeout(() => setPhase("leaving"), 250);
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      lockScroll(false);
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SCRIPT }} />
      {/* Without JavaScript nothing would ever dismiss it */}
      <noscript>
        <style>{".intro-overlay{display:none}"}</style>
      </noscript>
      {phase !== "gone" && (
        <AnimatePresence
          onExitComplete={() => {
            // Only now does it count as seen, so an interrupted intro replays
            sessionStorage.setItem(SEEN_KEY, "1");
            lockScroll(false);
            markIntroDone();
            setPhase("gone");
          }}
        >
          {phase === "playing" && (
            <motion.div
              aria-hidden
              className="intro-overlay fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-4 text-paper md:p-6"
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              initial={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="flex items-start justify-between">
                <span className="flex items-center gap-2.5 text-2xl font-bold tracking-[-0.08em]">
                  <img src="/logo.svg" alt="" className="h-8 w-8" />
                  {site.wordmark}.
                </span>
                <span className="label opacity-70">{site.roles[0]}</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="label opacity-70">Portfolio © {new Date().getFullYear()}</span>
                <span className="display-title tabular-nums text-[clamp(5rem,18vw,14rem)]">
                  {String(count).padStart(3, "0")}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
