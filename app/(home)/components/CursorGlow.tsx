"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor: a green dot that tracks the mouse exactly, a ring that
 * trails it on a spring and expands over interactive elements/headings,
 * and a large soft glow that lights up the design under the cursor.
 * Only mounts for fine pointers (mouse/trackpad), never on touch.
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
      const target = e.target as HTMLElement | null;
      setActive(
        !!target?.closest("a, button, input, label, [role='button'], h1, h2, h3")
      );
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
