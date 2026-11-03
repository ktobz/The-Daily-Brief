import { ImageResponse } from "next/og";

export const alt = "The Daily Brief — Nigeria & World News";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2119 100%)",
          padding: "64px 72px",
          color: "#fbf9f6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 6, background: "#b91c1c" }} />
          <div style={{ fontSize: 24, letterSpacing: 10, color: "#e8b4b4" }}>THE DAILY BRIEF</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, lineHeight: 1.05, fontWeight: 700 }}>Nigeria &amp; World News</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#d8d2ca", maxWidth: 940 }}>
            Authoritative journalism on politics, business, technology and culture.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#a8a09a" }}>
          <span>Independent. Reported. Delivered.</span>
          <span style={{ color: "#e8b4b4" }}>The Daily Brief</span>
        </div>
      </div>
    ),
    size
  );
}
