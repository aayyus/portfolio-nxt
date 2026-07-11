import { IconType } from "react-icons";
import {
  SiShopify,
  SiMeta,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGoogleanalytics,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiGit,
  SiFigma,
  SiWordpress,
  SiNodedotjs,
} from "react-icons/si";
import { LuMail, LuCode } from "react-icons/lu";

/**
 * Icons available to projects/skills stored in data/*.json.
 * The JSON stores the key; components resolve it here.
 */
export const ICONS: Record<string, IconType> = {
  SiShopify,
  SiMeta,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGoogleanalytics,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiGit,
  SiFigma,
  SiWordpress,
  SiNodedotjs,
  LuMail,
};

export const ICON_LABELS: Record<string, string> = {
  SiShopify: "Shopify",
  SiMeta: "Meta",
  SiJavascript: "JavaScript",
  SiTypescript: "TypeScript",
  SiReact: "React",
  SiNextdotjs: "Next.js",
  SiTailwindcss: "Tailwind CSS",
  SiGoogleanalytics: "Google Analytics",
  SiHtml5: "HTML5",
  SiCss3: "CSS3",
  SiBootstrap: "Bootstrap",
  SiGit: "Git",
  SiFigma: "Figma",
  SiWordpress: "WordPress",
  SiNodedotjs: "Node.js",
  LuMail: "Email / Klaviyo",
};

/** Fallback so a bad icon key never crashes the page. */
export function getIcon(name: string): IconType {
  return ICONS[name] ?? LuCode;
}
