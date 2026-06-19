import { ImageResponse } from "next/og";

// Site-wide Open Graph / Twitter card image, generated at request time.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Convert Statement Online — instantly transform PDF bank statements to Excel & CSV";

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
          padding: "84px",
          background: "linear-gradient(125deg,#13a89e 0%,#1f7fb8 46%,#163e96 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 92, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-3px" }}>
          <span style={{ color: "#ffffff" }}>CONVERT&nbsp;</span>
          <span style={{ color: "#f7931e" }}>STATEMENT&nbsp;</span>
          <span style={{ color: "#ffffff" }}>ONLINE</span>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", marginTop: 30, fontSize: 40, fontWeight: 600, color: "rgba(255,255,255,0.92)" }}>
          Instantly transform PDF bank statements to Excel &amp; CSV
        </div>

        {/* Flow chips */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 52, gap: 22 }}>
          <span style={{ display: "flex", padding: "12px 26px", borderRadius: 14, background: "rgba(255,255,255,0.16)", color: "#fff", fontSize: 30, fontWeight: 700 }}>PDF</span>
          <span style={{ display: "flex", color: "#fff", fontSize: 40, fontWeight: 800 }}>→</span>
          <span style={{ display: "flex", padding: "12px 26px", borderRadius: 14, background: "#1f7a44", color: "#fff", fontSize: 30, fontWeight: 700 }}>Excel</span>
          <span style={{ display: "flex", padding: "12px 26px", borderRadius: 14, background: "#1f7a44", color: "#fff", fontSize: 30, fontWeight: 700 }}>CSV</span>
          <span style={{ display: "flex", padding: "12px 26px", borderRadius: 14, background: "rgba(255,255,255,0.16)", color: "#fff", fontSize: 30, fontWeight: 700 }}>OFX · QFX · Sheets</span>
        </div>

        {/* Domain */}
        <div style={{ display: "flex", marginTop: 56, fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
          convertstatement.online
        </div>
      </div>
    ),
    { ...size }
  );
}
