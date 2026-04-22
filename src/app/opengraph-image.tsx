import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SendMoneyCompare — Compare International Money Transfers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Load Instrument Serif (display) + Inter (UI) at build-time so the OG matches
// the site's typography exactly. Google Fonts CSS → extract the .ttf URL → fetch.
async function loadFont(family: string, weight = 400): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [serif, inter, interBold] = await Promise.all([
    loadFont("Instrument+Serif", 400),
    loadFont("Inter", 500),
    loadFont("Inter", 700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FAFAF8",
          padding: "72px 88px",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Subtle grid background for premium editorial feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(45,58,140,0.06) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* Top bar — logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", zIndex: 1 }}>
          <svg width="36" height="36" viewBox="0 0 30 30" fill="none">
            <path d="M3.5 15.8L26.5 4.5L21 27L14.5 19.5Z" fill="#2D3A8C" />
            <path d="M14.5 19.5L26.5 4.5" stroke="#2D3A8C" strokeWidth="1.2" opacity="0.55" />
            <path d="M14.5 19.5L21 27L18 20.5Z" fill="#2D3A8C" opacity="0.45" />
          </svg>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
              color: "#0F172A",
              display: "flex",
            }}
          >
            SendMoney<span style={{ color: "#2D3A8C", display: "flex" }}>Compare</span>
          </span>
        </div>

        {/* Main editorial headline — serif, confident */}
        <div
          style={{
            marginTop: "56px",
            fontFamily: "Instrument Serif",
            fontSize: "84px",
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            color: "#0F172A",
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <span style={{ display: "flex" }}>The cheapest way to</span>
          <span style={{ display: "flex" }}>
            send money <span style={{ color: "#2D3A8C", fontStyle: "italic", marginLeft: "18px", display: "flex" }}>abroad.</span>
          </span>
        </div>

        {/* Comparison card — shows the product */}
        <div
          style={{
            marginTop: "56px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "26px 32px",
              borderRadius: "20px",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 12px 32px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)",
              minWidth: "380px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  borderRadius: "999px",
                  background: "#FFFBEB",
                  fontSize: "13px",
                  color: "#D97706",
                  fontWeight: 700,
                }}
              >
                ★
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#D97706",
                  display: "flex",
                }}
              >
                Best rate today
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: "52px",
                  lineHeight: 1,
                  color: "#0F172A",
                  letterSpacing: "-1px",
                  display: "flex",
                }}
              >
                Wise
              </span>
              <span style={{ fontSize: "18px", color: "#64748B", display: "flex" }}>
                0.6% fee · arrives in seconds
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "14px", color: "#64748B", display: "flex" }}>
              You get
            </span>
            <span
              style={{
                fontFamily: "Instrument Serif",
                fontSize: "44px",
                lineHeight: 1,
                color: "#059669",
                display: "flex",
              }}
            >
              ₹84,210
            </span>
            <span style={{ fontSize: "14px", color: "#059669", fontWeight: 600, display: "flex" }}>
              ↑ ₹1,840 more than banks
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            left: "88px",
            right: "88px",
            bottom: "56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E2E8F0",
            paddingTop: "24px",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: "16px", color: "#475569", fontWeight: 500, display: "flex" }}>
            60+ providers · 64+ corridors · updated every 6 hours
          </span>
          <span
            style={{
              fontSize: "15px",
              color: "#2D3A8C",
              fontWeight: 700,
              letterSpacing: "0.2px",
              display: "flex",
            }}
          >
            sendmoneycompare.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Inter", data: inter, style: "normal", weight: 500 },
        { name: "Inter", data: interBold, style: "normal", weight: 700 },
      ],
    },
  );
}
