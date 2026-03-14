import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Moneyremitter — Compare International Money Transfers";
export const size = {
  width: 1200,
  height: 630,
};
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 50%, #1565c0 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              background: "linear-gradient(145deg, #FFD700, #FFA000)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#7B5800",
                lineHeight: 1,
              }}
            >
              $
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "16px",
              marginRight: "16px",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "40px", color: "#81D4FA", lineHeight: 1, display: "flex" }}>→</div>
            <div style={{ fontSize: "40px", color: "#A5D6A7", lineHeight: 1, display: "flex" }}>←</div>
          </div>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              background: "linear-gradient(145deg, #4CAF50, #2E7D32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: "60px", lineHeight: 1 }}>🌍</span>
          </div>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-1px",
            display: "flex",
            marginBottom: "12px",
          }}
        >
          Moneyremitter
        </div>

        <div
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            display: "flex",
            marginBottom: "32px",
          }}
        >
          Compare 60+ providers · Best exchange rates · Updated every 6 hours
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "linear-gradient(90deg, #FFD700, #4CAF50, #1a73e8, #FFD700)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
