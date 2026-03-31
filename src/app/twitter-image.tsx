import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SendMoneyCompare — Compare International Money Transfers";
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
          background: "linear-gradient(135deg, #2D3A8C 0%, #1E2761 50%, #151B4A 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Paper plane logo — matches brand icon.svg */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.1)",
            marginBottom: "32px",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 512 512" fill="none">
            <path d="M104 269L416 96L336 440L240 320Z" fill="white" />
            <path d="M240 320L416 96" stroke="#2D3A8C" strokeWidth="12" opacity="0.6" />
            <path d="M240 320L336 440L291 336Z" fill="white" opacity="0.5" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-1.5px",
              display: "flex",
            }}
          >
            SendMoney
          </span>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#F59E0B",
              letterSpacing: "-1.5px",
              display: "flex",
            }}
          >
            Compare
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
            display: "flex",
            marginBottom: "40px",
          }}
        >
          Compare 60+ Providers — Real Rates, Updated Every 6 Hours
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "56px",
            padding: "20px 48px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.07)",
          }}
        >
          {[
            { num: "60+", label: "Providers" },
            { num: "64+", label: "Corridors" },
            { num: "6hr", label: "Data Refresh" },
            { num: "$0", label: "To Compare" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  display: "flex",
                }}
              >
                {stat.num}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 500,
                  display: "flex",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #2D3A8C, #F59E0B, #2D3A8C)",
            display: "flex",
          }}
        />

        {/* URL watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "18px",
            fontSize: "15px",
            color: "rgba(255,255,255,0.3)",
            display: "flex",
          }}
        >
          sendmoneycompare.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
