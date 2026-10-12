"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollToHash, setLenis } from "@/lib/motion";

/** Eased, momentum-style page scrolling (Lenis). Off for reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    setLenis(lenis);

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Route in-page anchor links through Lenis so they glide too
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || e.defaultPrevented) return;
      e.preventDefault();
      scrollToHash(link.getAttribute("href")!);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
