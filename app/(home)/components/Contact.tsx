import React from "react";
import { site, socials } from "@/lib/site";
import { Frame, Reveal, RollButton, SectionTitle, StaggerWord } from "./ui";

export default function Contact() {
  const links = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    ...socials.map((s) => ({ label: s.label, value: s.handle, href: s.href })),
  ];

  return (
    <section id="contact" className="scroll-mt-16">
      <Frame>
        <SectionTitle eyebrow="Want to" word="chat" punctuation="?" />
        <div className="grid md:grid-cols-10">
          <div className="border-b border-ink/40 p-4 md:col-span-6 md:border-b-0 md:border-r md:p-6 md:pb-12">
            <Reveal>
              <p className="max-w-md text-2xl font-medium leading-snug tracking-[-0.02em] md:text-3xl">
                Got a store in mind? I&apos;d love to hear about it.
              </p>
            </Reveal>
            <div className="mt-10">
              <RollButton href={`mailto:${site.email}`}>Contact me</RollButton>
            </div>
          </div>
          <ul className="md:col-span-4">
            {links.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.label} className="border-b border-ink/40 last:border-b-0">
                  <a
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="group flex items-center justify-between gap-4 p-4 transition-colors duration-300 hover:bg-ink hover:text-paper md:px-6 md:py-5"
                  >
                    <span className="label opacity-70 group-hover:opacity-100">{link.label}</span>
                    <span className="truncate text-sm">
                      {link.value}{" "}
                      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Frame>

      <footer className="border-t border-ink/40">
        <div className="overflow-hidden px-2 pt-8 md:px-4">
          <StaggerWord
            text={`${site.wordmark}.`}
            inView
            className="wordmark select-none text-[27vw] leading-[0.78]"
          />
        </div>
        <div className="label flex flex-wrap items-center justify-between gap-3 border-t border-ink/40 px-4 py-4 opacity-80 md:px-6">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className="hidden sm:inline">Shopify · Klaviyo · Meta</span>
          <a href="#top" className="hover:opacity-70">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
