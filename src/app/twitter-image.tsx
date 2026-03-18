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
        {/* Background pattern - subtle geometric shapes */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "80px",
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "500px",
            height: "500px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.025)",
            display: "flex",
            transform: "rotate(-10deg)",
          }}
        />

        {/* Logo mark - abstract S flowing curves */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "28px",
          }}
        >
          <svg width="60" height="60" viewBox="0 0 32 32" fill="none">
            <path d="M9 10.5C9 10.5 13 10.5 16 10.5C20.5 10.5 23 12.5 23 15C23 17.5 20.5 19 16 19" stroke="#C7D2F6" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M23 21.5C23 21.5 19 21.5 16 21.5C11.5 21.5 9 19.5 9 17C9 14.5 11.5 13 16 13" strokeWidth="2.8" stroke="#F59E0B" strokeLinecap="round" fill="none" />
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
              fontSize: "60px",
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
              fontSize: "60px",
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
            fontSize: "24px",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
            display: "flex",
            marginBottom: "36px",
          }}
        >
          60+ Providers Compared — Real Rates, Updated Every 6 Hours
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            padding: "16px 40px",
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
                  fontSize: "28px",
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
            bottom: "16px",
            fontSize: "14px",
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
