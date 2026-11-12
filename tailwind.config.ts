import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial palette (see globals.css). Stored as RGB channels so
        // opacity modifiers like border-ink/40 work.
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
      },
      transitionDuration: {
        450: "450ms",
        600: "600ms",
        900: "900ms",
      },
      transitionTimingFunction: {
        // Long, soft deceleration used for text reveals and row growth
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        // Symmetric ease for the hover text roll
        roll: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
