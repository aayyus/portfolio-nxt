import type { ImageAlign } from "./types";

/** Site-wide copy and links, kept in one place so they're easy to edit. */
export const site = {
  name: "Aayush Sharma",
  wordmark: "aayush",
  email: "aayushat902@gmail.com",
  roles: ["Shopify Developer", "Klaviyo Automation", "Meta Advertising"],
  /** City highlighted in the header's world-clock ticker. */
  homeCity: "Kathmandu",
};

export const socials = [
  {
    label: "LinkedIn",
    handle: "in/aayush-sharma",
    href: "https://www.linkedin.com/in/aayush-sharma-3a167222b/",
  },
  { label: "GitHub", handle: "@aayyus", href: "https://github.com/aayyus/" },
  { label: "Instagram", handle: "@aayyus._", href: "https://www.instagram.com/aayyus._/" },
];

export const navLinks = [
  { label: "work", href: "#work" },
  { label: "about", href: "#about" },
  { label: "stack", href: "#stack" },
  { label: "contact", href: "#contact" },
];

export const clocks = [
  { city: "Kathmandu", tz: "Asia/Kathmandu" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "London", tz: "Europe/London" },
  { city: "New York", tz: "America/New_York" },
  { city: "Los Angeles", tz: "America/Los_Angeles" },
];

// Written out in full (not built as `object-${align}`) so Tailwind's
// content scanner keeps these classes in the production build.
export const objectPosition: Record<ImageAlign, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};
