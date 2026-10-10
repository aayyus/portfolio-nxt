import React from "react";
import { getIcon } from "@/lib/icons";
import type { Skill } from "@/lib/types";
import { Frame, SectionTitle } from "./ui";

/**
 * Numbered rows spanning the full width: the number sits in the left
 * gutter, and the name/description cells line up with the framed rails.
 * Rows flip to ink on hover.
 */
export default function Stack({ skills }: { skills: Skill[] }) {
  return (
    <section id="stack" className="scroll-mt-16">
      <Frame>
        {/* The list supplies the line under the title, full width */}
        <SectionTitle eyebrow="My" word="stack" className="border-b-0" />
      </Frame>
      <ul className="border-t border-ink/40">
        {skills.map((skill, i) => {
          const Icon = getIcon(skill.icon);
          return (
            <li
              key={skill.id}
              className="group grid grid-cols-4 border-b border-ink/40 transition-colors duration-300 hover:bg-ink hover:text-paper md:grid-cols-12"
            >
              <span className="label col-span-1 p-4 tabular-nums opacity-60 md:pt-9">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="col-span-3 flex items-center gap-3 border-l border-ink/40 p-4 text-2xl font-semibold tracking-[-0.03em] transition-colors group-hover:border-paper/30 md:col-span-6 md:border-r md:px-6 md:py-8 md:text-4xl">
                <Icon className="h-6 w-6 shrink-0 md:hidden" />
                {skill.text}
              </h3>
              <p className="col-span-3 col-start-2 border-l border-t border-ink/40 p-4 text-sm leading-relaxed opacity-80 transition-colors group-hover:border-paper/30 md:col-span-4 md:col-start-auto md:flex md:items-center md:border-l-0 md:border-r md:border-t-0 md:px-6">
                {skill.description}
              </p>
              <span className="hidden items-center justify-center md:flex">
                <Icon className="h-7 w-7 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
