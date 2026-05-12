import { ImageResponse } from "next/og";
import { getAuthor } from "@/data/authors";

export const runtime = "edge";

export const alt = "SendMoneyCompare — Author";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(family: string, weight = 400): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

type Props = { params: Promise<{ author: string; locale: string }> };

export default async function Image({ params }: Props) {
  const { author: slug } = await params;
  const author = getAuthor(slug);

  const name = author?.name ?? "SendMoneyCompare";
  const role = author?.role ?? "Editorial team";
  const tags = (author?.expertise ?? []).slice(0, 3);

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

        <div
          style={{
            marginTop: "64px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#2D3A8C",
              display: "flex",
            }}
          >
            Author
          </span>
          <span
            style={{
              fontFamily: "Instrument Serif",
              fontSize: "96px",
              lineHeight: 1.02,
              letterSpacing: "-2px",
              color: "#0F172A",
              display: "flex",
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontSize: "28px",
              color: "#475569",
              fontWeight: 500,
              display: "flex",
            }}
          >
            {role}
          </span>
        </div>

        {tags.length > 0 && (
          <div
            style={{
              marginTop: "48px",
              display: "flex",
              gap: "12px",
              zIndex: 1,
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#2D3A8C",
                  background: "#E8ECFB",
                  borderRadius: "999px",
                  padding: "10px 20px",
                  display: "flex",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

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
            Editorial team · independent reviews
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
