import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SendMoneyCompare — Is now a good time to send money? Live rate timing across 60+ providers.";
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

        {/* Main editorial headline — the tool's actual question */}
        <div
          style={{
            marginTop: "48px",
            fontFamily: "Instrument Serif",
            fontSize: "82px",
            lineHeight: 1.04,
            letterSpacing: "-1.5px",
            color: "#0F172A",
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <span style={{ display: "flex" }}>Is now a good time</span>
          <span style={{ display: "flex" }}>
            to <span style={{ color: "#2D3A8C", fontStyle: "italic", marginLeft: "18px", display: "flex" }}>send money?</span>
          </span>
        </div>

        {/* Verdict pill — the unique hook */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "18px 26px",
            borderRadius: "999px",
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            alignSelf: "flex-start",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              background: "#059669",
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            ↗
          </div>
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#065F46", display: "flex" }}>
            Good time to send
          </span>
          <span style={{ fontSize: "26px", color: "#047857", display: "flex" }}>
            — today beats <span style={{ fontWeight: 700, marginLeft: "8px", display: "flex" }}>68%</span><span style={{ marginLeft: "8px", display: "flex" }}>of the last 80 days</span>
          </span>
        </div>

        {/* Provider breadth row — conveys "we compare everyone" */}
        <div
          style={{
            marginTop: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              color: "#94A3B8",
              display: "flex",
            }}
          >
            Compared live across every major provider
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {["Wise", "Xoom", "TapTap Send", "MoneyGram", "InstaReM", "Wells Fargo", "Western Union"].map(
              (name) => (
                <span
                  key={name}
                  style={{
                    display: "flex",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#334155",
                  }}
                >
                  {name}
                </span>
              ),
            )}
            <span
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: "999px",
                background: "#EEF2FF",
                border: "1px solid #C7D2FE",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2D3A8C",
              }}
            >
              +50 more
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            left: "88px",
            right: "88px",
            bottom: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E2E8F0",
            paddingTop: "24px",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: "16px", color: "#475569", fontWeight: 500, display: "flex" }}>
            Rates tracked daily across 800+ corridors · updated every 6 hours
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
