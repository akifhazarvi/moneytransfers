import { ImageResponse } from "next/og";
import { getCorridor } from "@/data/corridors";

export const runtime = "edge";

export const alt = "SendMoneyCompare — Live money transfer comparison";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Props = { params: Promise<{ corridor: string; locale: string }> };

export default async function Image({ params }: Props) {
  const { corridor: slug } = await params;
  const corridor = getCorridor(slug);

  const abbreviate = (name: string): string => {
    const map: Record<string, string> = {
      "United States": "USA",
      "United Kingdom": "UK",
      "United Arab Emirates": "UAE",
      "New Zealand": "NZ",
      "Saudi Arabia": "KSA",
      "South Africa": "S. AFRICA",
      "South Korea": "S. KOREA",
      "Hong Kong": "HK",
    };
    return (map[name] ?? name).toUpperCase();
  };
  const fromLabel = corridor ? abbreviate(corridor.fromCountry) : "SEND";
  const toLabel = corridor ? abbreviate(corridor.toCountry) : "MONEY";
  const fromCurrency = corridor?.fromCurrency ?? "";
  const toCurrency = corridor?.toCurrency ?? "";
  const showCurrencyLine = fromCurrency && toCurrency;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #2D3A8C 0%, #1E2761 50%, #151B4A 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
          padding: "72px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top row: brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 512 512" fill="none">
              <path d="M104 269L416 96L336 440L240 320Z" fill="white" />
              <path d="M240 320L416 96" stroke="#2D3A8C" strokeWidth="12" opacity="0.6" />
              <path d="M240 320L336 440L291 336Z" fill="white" opacity="0.5" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px", display: "flex" }}>
              SendMoney
            </span>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#F59E0B", letterSpacing: "-0.5px", display: "flex" }}>
              Compare
            </span>
          </div>
        </div>

        {/* Middle: corridor headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              flexWrap: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: fromLabel.length > 10 ? "76px" : "92px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-2px",
                lineHeight: 1,
                display: "flex",
              }}
            >
              {fromLabel}
            </span>
            <svg width="72" height="40" viewBox="0 0 72 40" fill="none" style={{ display: "flex" }}>
              <path
                d="M2 20 H60 M48 8 L62 20 L48 32"
                stroke="#F59E0B"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span
              style={{
                fontSize: toLabel.length > 10 ? "76px" : "92px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-2px",
                lineHeight: 1,
                display: "flex",
              }}
            >
              {toLabel}
            </span>
          </div>
          {showCurrencyLine ? (
            <div
              style={{
                fontSize: "32px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "2px",
                display: "flex",
              }}
            >
              {fromCurrency} TO {toCurrency}  —  LIVE COMPARISON
            </div>
          ) : (
            <div
              style={{
                fontSize: "32px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "2px",
                display: "flex",
              }}
            >
              LIVE MONEY TRANSFER COMPARISON
            </div>
          )}
        </div>

        {/* Bottom row: value props */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "40px" }}>
            {[
              { num: "50+", label: "Providers" },
              { num: "6hr", label: "Refresh" },
              { num: "$0", label: "Fee to compare" },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "36px", fontWeight: 800, color: "#FFFFFF", display: "flex", lineHeight: 1 }}>
                  {stat.num}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    display: "flex",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginTop: "6px",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 500,
              display: "flex",
            }}
          >
            sendmoneycompare.com
          </div>
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
      </div>
    ),
    {
      ...size,
    }
  );
}
