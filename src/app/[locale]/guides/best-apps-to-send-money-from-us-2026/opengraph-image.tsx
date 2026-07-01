import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Best Apps to Send Money from US Internationally (2026) — SendMoneyCompare independent rankings based on live rate data across 60+ providers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PROVIDERS = [
  { name: "Wise", score: "4.7", badge: "#1 Overall" },
  { name: "Remitly", score: "4.6", badge: "Best Speed" },
  { name: "TorFX", score: "4.9", badge: "Best Rated" },
  { name: "OFX", score: "4.4", badge: "Large Transfers" },
  { name: "TapTap Send", score: "4.7", badge: "Zero Fee" },
];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #0F1A4A 0%, #1a2d6b 40%, #1a3a5c 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "56px 72px 48px",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle accent */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top: wordmark + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              S
            </div>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.9)", fontWeight: 700, display: "flex" }}>
              SendMoneyCompare
            </span>
          </div>
          <div
            style={{
              background: "rgba(34,197,94,0.18)",
              border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 20,
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "flex" }} />
            <span style={{ fontSize: 13, color: "#86efac", fontWeight: 600, display: "flex" }}>
              Live data · Updated every 6h
            </span>
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span
            style={{
              fontSize: 14,
              color: "#93c5fd",
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Independent Rankings · 2026
          </span>
          <span
            style={{
              fontSize: 48,
              color: "#ffffff",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1,
              display: "flex",
              maxWidth: 700,
            }}
          >
            Best Apps to Send Money from the US
          </span>
          <span
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 400,
              lineHeight: 1.4,
              display: "flex",
              maxWidth: 650,
              marginTop: 6,
            }}
          >
            Ranked by real transfer cost across 60+ providers · 190+ countries · No paid placements
          </span>
        </div>

        {/* Bottom: provider pills */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {PROVIDERS.map((p) => (
            <div
              key={p.name}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10,
                padding: "10px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minWidth: 130,
              }}
            >
              <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 700, letterSpacing: 1, display: "flex" }}>
                {p.badge}
              </span>
              <span style={{ fontSize: 17, color: "#fff", fontWeight: 700, display: "flex" }}>{p.name}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex" }}>
                ★ {p.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
