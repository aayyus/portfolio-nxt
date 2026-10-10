import React from "react";
import { cn } from "@/lib/utils";
import { Frame, Reveal, RollButton, SectionTitle } from "./ui";

export default function About({
  projectCount,
  skillCount,
}: {
  projectCount: number;
  skillCount: number;
}) {
  const stats = [
    { value: String(projectCount), label: "Stores & sites shipped" },
    { value: String(skillCount), label: "Tools in the stack" },
    { value: "360°", label: "Shopify coverage" },
    { value: "100%", label: "Client focused" },
  ];

  return (
    <section id="about" className="scroll-mt-16">
      <Frame>
        <SectionTitle eyebrow="The" word="developer" />
        <div className="grid md:grid-cols-10">
          <div className="border-b border-ink/40 p-4 md:col-span-4 md:border-b-0 md:border-r md:p-6 md:pb-10">
            <Reveal>
              <p className="text-lg leading-relaxed md:text-xl">
                I&apos;m Aayush — a Shopify 360 developer who builds storefronts that
                actually sell. I work across the whole life of an online store, from the
                first line of theme code to the email that brings a customer back.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed opacity-80">
                That means custom theme development in Liquid and JavaScript, Klaviyo
                flows and segmentation that turn one-time buyers into regulars, and Meta
                pixel and Conversions API setups that make every ad dollar measurable.
              </p>
            </Reveal>
            <div className="mt-10">
              <RollButton href="#contact">Let&apos;s talk</RollButton>
            </div>
          </div>

          <div className="grid grid-cols-2 md:col-span-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "flex min-h-[11rem] flex-col justify-between p-4 md:min-h-[14rem] md:p-6",
                  i % 2 === 0 && "border-r border-ink/40",
                  i < 2 && "border-b border-ink/40"
                )}
              >
                <span className="label tabular-nums opacity-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Reveal delay={i * 0.08}>
                  <p className="display-title text-[clamp(3rem,7vw,5.5rem)]">{stat.value}</p>
                  <p className="label mt-4 leading-relaxed opacity-75">{stat.label}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
