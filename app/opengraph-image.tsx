import { ImageResponse } from "next/og";

export const alt =
  "Kodedristi Software — premium software company in Nepal: custom software, web and mobile apps, SaaS, AI and outsourcing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card every page falls back to when it has no artwork of its own.
 * The logo file is square and was being cropped to a banner by Facebook,
 * LinkedIn and X; this is built at the 1.91:1 size they actually display.
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
          justifyContent: "space-between",
          background: "#2e3192",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
          Kodedristi Software
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Premium software company in Nepal
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.3, color: "#dfe1ff" }}>
            Custom software · Web & mobile apps · SaaS · AI · Outsourcing & white label
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#b9bdf5" }}>kodedristi.com · Kathmandu, Nepal</div>
      </div>
    ),
    { ...size }
  );
}
