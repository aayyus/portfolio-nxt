import type { ImageAlign } from "./types";

/** Site-wide copy and links, kept in one place so they're easy to edit. */
export const site = {
  name: "Aayush Sharma",
  wordmark: "aayush",
  email: "aayushat902@gmail.com",
  roles: [
    "Shopify Developer",
    "Klaviyo Automation",
    "Meta Advertising",
    "Conversion Rate Optimisation",
  ],
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

// One city per major time zone, west to east, so the ticker runs around
// the whole globe.
export const clocks = [
  { city: "Honolulu", tz: "Pacific/Honolulu" },
  { city: "Anchorage", tz: "America/Anchorage" },
  { city: "Los Angeles", tz: "America/Los_Angeles" },
  { city: "Denver", tz: "America/Denver" },
  { city: "Chicago", tz: "America/Chicago" },
  { city: "New York", tz: "America/New_York" },
  { city: "São Paulo", tz: "America/Sao_Paulo" },
  { city: "Reykjavik", tz: "Atlantic/Reykjavik" },
  { city: "London", tz: "Europe/London" },
  { city: "Paris", tz: "Europe/Paris" },
  { city: "Cairo", tz: "Africa/Cairo" },
  { city: "Moscow", tz: "Europe/Moscow" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Karachi", tz: "Asia/Karachi" },
  { city: "Delhi", tz: "Asia/Kolkata" },
  { city: "Kathmandu", tz: "Asia/Kathmandu" },
  { city: "Dhaka", tz: "Asia/Dhaka" },
  { city: "Bangkok", tz: "Asia/Bangkok" },
  { city: "Singapore", tz: "Asia/Singapore" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Adelaide", tz: "Australia/Adelaide" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "Auckland", tz: "Pacific/Auckland" },
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
