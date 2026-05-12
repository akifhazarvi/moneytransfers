import { ImageResponse } from "next/og";
import { providers } from "@/data/providers";
import { trustpilotIndex } from "@/lib/unified-quotes";

export const runtime = "edge";

export const alt = "SendMoneyCompare — Provider review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string; locale: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const provider = providers.find((p) => p.slug === slug);
  const tp = trustpilotIndex[slug];
  const year = new Date().getFullYear();

  const name = provider?.name ?? "Money Transfer";
  const ratingScore = tp?.score ?? provider?.rating ?? null;
  const ratingLabel = ratingScore !== null ? `${ratingScore.toFixed(1)} / 5` : null;
  const tagline =
    provider?.regulated && provider?.regulators?.length
      ? `${provider.regulators.slice(0, 3).join(" · ")} regulated`
      : "Independent review";

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
          padding: "72px 88px",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            S
          </div>
          <span style={{ fontSize: 24, color: "#fff", fontWeight: 700, letterSpacing: -0.3, display: "flex" }}>
            SendMoneyCompare
          </span>
        </div>

        {/* Editorial headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              fontSize: 18,
              color: "#A8B1E8",
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Provider Review · {year}
          </span>
          <span
            style={{
              fontSize: 108,
              lineHeight: 1.02,
              color: "#fff",
              fontWeight: 800,
              letterSpacing: -3,
              display: "flex",
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#CBD5F5",
              fontWeight: 500,
              display: "flex",
            }}
          >
            {tagline}
          </span>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 24,
          }}
        >
          {ratingLabel ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ color: "#F59E0B", fontSize: 28, fontWeight: 800, display: "flex" }}>
                ★ {ratingLabel}
              </span>
              <span style={{ color: "#A8B1E8", fontSize: 18, display: "flex" }}>
                Trustpilot
              </span>
            </div>
          ) : (
            <span style={{ color: "#A8B1E8", fontSize: 18, display: "flex" }}>
              Fees, rates and real-data comparison
            </span>
          )}
          <span style={{ color: "#A8B1E8", fontSize: 18, fontWeight: 700, display: "flex" }}>
            sendmoneycompare.com
          </span>
        </div>
      </div>
    ),
    size,
  );
}
