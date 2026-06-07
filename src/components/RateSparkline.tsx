/**
 * RateSparkline — a tiny, dependency-free, SERVER-RENDERED SVG sparkline.
 *
 * No "use client": this renders to static SVG markup in the HTML so AI
 * crawlers and Bing see the trend shape without executing JS. Used on the
 * /exchange-rates top-5 rate cards.
 */

interface RateSparklineProps {
  points: { rate: number }[];
  /** Trend tint — green up, red down, neutral flat. */
  direction?: "up" | "down" | "flat";
  width?: number;
  height?: number;
  className?: string;
}

export default function RateSparkline({
  points,
  direction = "flat",
  width = 120,
  height = 36,
  className,
}: RateSparklineProps) {
  if (!points || points.length < 2) {
    return <div style={{ width, height }} className={className} aria-hidden="true" />;
  }

  const rates = points.map((p) => p.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * w;
    const y = pad + h - ((p.rate - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const stroke =
    direction === "up"
      ? "var(--color-success)"
      : direction === "down"
      ? "var(--color-danger)"
      : "var(--color-on-surface-muted)";

  // Area fill under the line for a richer look
  const last = coords[coords.length - 1].split(",")[0];
  const first = coords[0].split(",")[0];
  const areaPts = `${first},${height - pad} ${coords.join(" ")} ${last},${height - pad}`;
  const gradId = `spark-${direction}-${Math.round(min * 1000)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="90-day rate trend"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill={`url(#${gradId})`} stroke="none" />
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
