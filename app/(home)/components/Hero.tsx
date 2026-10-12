"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import { site } from "@/lib/site";
import type { Skill } from "@/lib/types";
import { EASE, StaggerWord } from "./ui";

const chipCls =
  "orbit-counter label flex cursor-default items-center gap-1.5 whitespace-nowrap border border-ink/50 bg-paper px-2.5 py-1.5 transition-colors duration-300 hover:bg-ink hover:text-paper";

/** Deterministic seed from a skill's id, so the scatter is stable across
 * server/client renders instead of using Math.random(). */
function seedFrom(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

type Placement = { angle: number; r: number };

const GAP = 10; // minimum clearance between any two chips, in px
const JITTER = 12; // how far a chip may sit off the ring, in px

/**
 * Lays chips out around a ring so no two can ever overlap at any point in
 * the rotation, while still looking scattered.
 *
 * Chips stay level as they orbit, so two neighbours are only safe if their
 * centres are further apart than the diagonal of their combined boxes. Each
 * neighbouring pair is given exactly that much arc (measured from the real
 * rendered widths), the ring grows if they don't all fit, and whatever arc
 * is left over is shared out unevenly per skill — so spacing looks random
 * but is always collision-free. Adapts to longer names, more skills from the
 * admin panel, and the icon-only chips used on small screens.
 */
function layoutOrbit(
  sizes: { w: number; h: number }[],
  seeds: number[],
  minR: number
): { R: number; place: Placement[] } {
  const n = sizes.length;
  const need = sizes.map((a, i) => {
    const b = sizes[(i + 1) % n];
    return Math.hypot((a.w + b.w) / 2 + GAP, (a.h + b.h) / 2 + GAP);
  });
  // Arc each pair needs, assuming the worst case of both chips sitting on
  // the inner edge of the jitter band.
  const arcs = (R: number) =>
    need.map((d) => 2 * Math.asin(Math.min(1, d / (2 * (R - JITTER)))));
  const total = (R: number) => arcs(R).reduce((a, b) => a + b, 0);

  let R = minR;
  while (n > 1 && total(R) > 2 * Math.PI && R < 800) R += 4;

  const gaps = arcs(R);
  const slack = Math.max(0, 2 * Math.PI - total(R));
  const weights = seeds.map((s) => 0.3 + ((s >> 3) % 100) / 100);
  const wsum = weights.reduce((a, b) => a + b, 0);

  let angle = -Math.PI / 2;
  const place = seeds.map((s, i) => {
    const p = { angle, r: R + ((s >> 4) % (2 * JITTER + 1)) - JITTER };
    angle += gaps[i] + (slack * weights[i]) / wsum;
    return p;
  });
  return { R, place };
}

/**
 * Every skill orbits the ring. Each chip's placement rotation is undone
 * right after positioning it (rotate → out → rotate back), so it sits
 * upright; .orbit-counter then cancels the live spin, keeping labels level.
 * Hovering the stage pauses it in place.
 */
function Orbit({ skills }: { skills: Skill[] }) {
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState<{ R: number; place: Placement[] } | null>(null);

  useEffect(() => {
    if (skills.length === 0) return;
    const seeds = skills.map((s) => seedFrom(s.id));
    const compute = () => {
      const sizes = chipRefs.current
        .slice(0, skills.length)
        .map((el) => ({ w: el?.offsetWidth ?? 0, h: el?.offsetHeight ?? 0 }));
      const minR = window.matchMedia("(min-width: 768px)").matches ? 150 : 80;
      setLayout(layoutOrbit(sizes, seeds, minR));
    };
    compute();
    // Widths shift slightly once the web font arrives
    document.fonts?.ready.then(compute);
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [skills]);

  const R = layout?.R ?? 150;

  return (
    <div className="orbit-stage relative shrink-0" style={{ width: R * 2, height: R * 2 }}>
      <div className="absolute inset-0 rounded-full border border-ink/40" />
      <div className="absolute inset-[24%] grid place-items-center rounded-full border border-dashed border-ink/30">
        <p className="label text-center leading-relaxed opacity-60">
          Shopify
          <br />
          360°
        </p>
      </div>
      {/* Hidden until measured, so chips never flash in the wrong spot */}
      <div
        className="orbit-rotor absolute inset-0 transition-opacity duration-700"
        style={{ opacity: layout ? 1 : 0 }}
      >
        {skills.map((skill, i) => {
          const Icon = getIcon(skill.icon);
          const p = layout?.place[i] ?? { angle: 0, r: 0 };
          const deg = (p.angle * 180) / Math.PI;
          return (
            <div
              key={skill.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${deg}deg) translate(${p.r}px) rotate(${-deg}deg)`,
              }}
            >
              <div
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                title={skill.text}
                className={chipCls}
              >
                <Icon className="h-3.5 w-3.5 md:h-3 md:w-3" />
                {/* Icon-only on small screens; the full list is in the Stack section */}
                <span className="hidden md:inline">{skill.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Black-and-white portrait for the hero's tall right-hand cell. */
function Portrait() {
  return (
    <div className="relative h-full min-h-[22rem] overflow-hidden bg-ink/10">
      <Image
        src="/aayush.jpg"
        alt={site.name}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 34vw"
        className="object-cover object-[55%_40%] contrast-[1.15] grayscale"
      />
    </div>
  );
}

/** Line-art monogram with a slowly turning dashed ring. */
function Monogram() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-20 w-20 md:h-28 md:w-28"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" strokeWidth="0.8" />
      <circle
        cx="50"
        cy="50"
        r="39"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity="0.6"
        className="origin-center animate-[spin_30s_linear_infinite] [transform-box:fill-box]"
      />
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-3"
        strokeWidth="0.9"
      >
        as
      </text>
    </svg>
  );
}

export default function Hero({ skills }: { skills: Skill[] }) {
  return (
    <section id="top" className="flex flex-col border-b border-ink/40 md:min-h-[calc(100svh-4rem)]">
      <div className="grid flex-1 grid-cols-4 md:grid-cols-12">
        <div className="relative col-span-4 flex min-h-[22rem] items-center justify-center overflow-hidden border-b border-ink/40 md:col-span-8 md:min-h-[26rem] md:border-b-0 md:border-r">
          <span className="label absolute left-4 top-4 opacity-60">
            Stack / {String(skills.length).padStart(2, "0")} tools
          </span>
          <span className="label absolute bottom-4 right-4 hidden opacity-40 md:block">
            Hover to pause
          </span>
          <Orbit skills={skills} />
        </div>
        <div className="col-span-4 min-h-[18rem]">
          <Portrait />
        </div>
      </div>

      <div className="grid grid-cols-4 border-t border-ink/40 md:grid-cols-12">
        <div className="col-span-4 flex items-end px-4 pt-8 md:col-span-7 md:px-6">
          <h1 className="w-full">
            <StaggerWord
              text={`${site.wordmark}.`}
              label={`${site.name}, ${site.roles[0]}`}
              className="wordmark text-[clamp(5rem,15vw,15rem)]"
            />
          </h1>
        </div>
        <ul className="col-span-3 flex flex-col justify-end border-t border-ink/40 p-4 text-xl font-medium leading-tight tracking-[-0.02em] md:col-span-3 md:border-l md:border-t-0 md:p-6 md:text-xl xl:text-2xl">
          {site.roles.map((role, i) => (
            <motion.li
              key={role}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: EASE }}
            >
              {role}
            </motion.li>
          ))}
        </ul>
        <div className="col-span-1 flex items-center justify-center border-l border-t border-ink/40 p-2 md:col-span-2 md:border-t-0 md:p-4">
          <Monogram />
        </div>
      </div>
    </section>
  );
}
