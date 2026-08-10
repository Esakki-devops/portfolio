import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.roleLong}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * next/og renders with Satori: flexbox only (no grid), and any element with
 * more than one child needs an explicit display:flex.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(59,130,246,0.22), transparent 45%), radial-gradient(circle at 82% 78%, rgba(168,85,247,0.20), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontFamily: "monospace",
            color: "#22d3ee",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 99,
              background: "#22d3ee",
            }}
          />
          Portfolio
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#ecedf2",
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 36,
            fontFamily: "monospace",
            color: "#22d3ee",
          }}
        >
          {site.roleLong}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 24,
            lineHeight: 1.4,
            color: "#9698a8",
            maxWidth: 900,
          }}
        >
          Windows &amp; Linux support · Networking · AWS · Docker · Monitoring ·{" "}
          {site.location}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 5,
            width: 320,
            borderRadius: 99,
            background: "linear-gradient(90deg,#3b82f6,#22d3ee,#a855f7)",
          }}
        />
      </div>
    ),
    size,
  );
}
