"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

/** Makes every Framer Motion animation honour the visitor's "reduce motion"
 * system setting: elements jump to their final state instead of moving. */
export default function MotionPrefs({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
