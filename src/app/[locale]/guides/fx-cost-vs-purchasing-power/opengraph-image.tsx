import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "The cheaper the move, the less your transfer fee matters — US to UK lifts buying power 6% but the wrong provider eats 84% of it, while US to Egypt lifts 550% and the fee eats 0.9%";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The headline contrast, hard-coded rather than imported: this runs on the edge
// runtime, which cannot pull in the full ppp-index/weekend-markup chain. These
// four figures are the article's lede and change only when the underlying
// dataset shifts materially.
const ROWS = [
  { country: "United Kingdom", gain: "+6%", eaten: 84 },
  { country: "Sweden", gain: "+8%", eaten: 61 },
  { country: "Canada", gain: "+11%", eaten: 45 },
  { country: "Egypt", gain: "+550%", eaten: 1 },
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
          background: "#14171C",
          fontFamily: "system-ui, sans-serif",
          padding: "56px 68px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 1.6,
              color: "#B57A12",
              fontWeight: 600,
            }}
          >
            SENDMONEYCOMPARE · ORIGINAL RESEARCH
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              lineHeight: 1.1,
              color: "#FFFFFF",
              marginTop: 18,
              maxWidth: 980,
            }}
          >
            The cheaper the move, the less your transfer fee matters
          </div>
        </div>

        {/* Mini bar chart — share of the purchasing-power gain lost to FX */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ROWS.map((r) => (
            <div key={r.country} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", width: 210, fontSize: 24, color: "#D5D8DD" }}>
                {r.country}
              </div>
              <div style={{ display: "flex", width: 92, fontSize: 21, color: "#8A8F98" }}>
                {r.gain}
              </div>
              <div
                style={{
                  display: "flex",
                  width: Math.max(10, r.eaten * 6.4),
                  height: 30,
                  background: "#B57A12",
                  borderRadius: 6,
                }}
              />
              <div style={{ display: "flex", fontSize: 24, color: "#FFFFFF", marginLeft: 12 }}>
                {r.eaten}%
              </div>
            </div>
          ))}
          <div style={{ display: "flex", fontSize: 20, color: "#8A8F98", marginTop: 4 }}>
            Buying-power gain · share of it lost to the wrong provider
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 21, color: "#8A8F98" }}>
          World Bank PPP · 2.37M archived quotes · sendmoneycompare.com
        </div>
      </div>
    ),
    size,
  );
}
