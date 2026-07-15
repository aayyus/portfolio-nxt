"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Finds the text node directly under a point, if any. Prefers the
 * standard caretPositionFromPoint, falling back to the older
 * caretRangeFromPoint (Safari/older Chrome) — neither is in the DOM
 * lib types yet, hence the casts.
 */
function textNodeAtPoint(x: number, y: number): Text | null {
  const doc = document as any;
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    return pos?.offsetNode?.nodeType === Node.TEXT_NODE ? pos.offsetNode : null;
  }
  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    return range?.startContainer.nodeType === Node.TEXT_NODE
      ? (range.startContainer as Text)
      : null;
  }
  return null;
}

/**
 * caretPositionFromPoint snaps to the *nearest* text position even when
 * the cursor is over empty padding next to it, so it alone isn't enough.
 * This confirms the point actually falls inside one of the text node's
 * rendered glyph rectangles.
 */
function isOverGlyph(x: number, y: number, node: Text): boolean {
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = range.getClientRects();
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return true;
    }
  }
  return false;
}

/**
 * Custom cursor: a green dot that tracks the mouse exactly, a ring that
 * trails it on a spring and expands over actual text glyphs (not just
 * anywhere inside a button/card/heading container), and a large soft
 * glow that lights up the design under the cursor. Only mounts for fine
 * pointers (mouse/trackpad), never on touch.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28 });
  const glowX = useSpring(x, { stiffness: 120, damping: 25 });
  const glowY = useSpring(y, { stiffness: 120, damping: 25 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const node = textNodeAtPoint(e.clientX, e.clientY);
      const hasText = !!node?.textContent?.trim();
      setActive(hasText && isOverGlyph(e.clientX, e.clientY, node!));
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-glow"
        style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: active ? 1.9 : 1,
          opacity: active ? 1 : 0.55,
          borderColor: active
            ? "rgba(74, 222, 128, 0.9)"
            : "rgba(74, 222, 128, 0.65)",
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: active ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
