import type Lenis from "lenis";

/*
 * Tiny shared state for page-level motion, so components that don't share a
 * parent (header menu, intro, hero) can coordinate without a context.
 */

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Pause or resume page scrolling (smooth or native). */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Scroll to an in-page anchor, through Lenis when it's running. */
export function scrollToHash(hash: string) {
  const el = hash === "#top" ? document.body : document.querySelector(hash);
  if (!el) return;
  // force: the menu may still have scrolling paused as its link is clicked
  if (lenis) lenis.scrollTo(hash === "#top" ? 0 : (el as HTMLElement), { offset: -64, force: true });
  else el.scrollIntoView({ behavior: "smooth" });
}

// "Intro finished" signal: the hero holds its entrance until then.
let introDone = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  introDone = true;
  listeners.forEach((fn) => fn());
}

export function onIntroDone(fn: () => void): () => void {
  if (introDone) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
