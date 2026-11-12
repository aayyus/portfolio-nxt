import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// The preview card shown when the site is shared (Slack, WhatsApp, X, ...)
export const alt = `${site.name} — ${site.roles[0]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#EDE6D6";
const INK = "#1F3D2B";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: 64,
          border: `2px solid ${INK}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 6 }}>
          <span>PORTFOLIO</span>
          <span>{new URL(site.url).host.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 240, fontWeight: 700, letterSpacing: -16, lineHeight: 0.9 }}>
            {`${site.wordmark}.`}
          </div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 30, letterSpacing: 1 }}>
            {site.roles.join("  /  ")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
