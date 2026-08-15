"use client";

import { useId, useMemo, useState } from "react";

/**
 * Quadrant scatter: cost of living against what locals actually earn.
 *
 * Deliberately echoes the well-known cost-vs-quality-of-life chart, but built
 * on official World Bank statistics rather than crowdsourced survey entries —
 * the criticism that chart consistently attracts.
 *
 * COLOUR: a scatter is an all-pairs form, so the categorical ceiling is three.
 * Rather than spend that budget on regions (the source chart used six hues,
 * which is not CVD-safe), every point takes ONE hue and the quadrants carry the
 * meaning through position, background tint and text labels. Emphasis is used
 * for the highlighted countries. Palette validated against both surfaces:
 * #3573C4 light / #4E84D4 dark.
 *
 * Y is log-scaled: GNI per capita spans roughly $1k–$140k, and a linear axis
 * would crush four-fifths of the world into the bottom eighth of the plot.
 */

export interface ScatterPoint {
  iso2: string;
  name: string;
  /** Price level, US = 1. Higher = more expensive. */
  priceLevel: number;
  /** GNI per capita, PPP int$. */
  gni: number;
  currency: string;
}

interface Props {
  points: ScatterPoint[];
  /** Quadrant dividers — medians of the plotted set. */
  medPrice: number;
  medGni: number;
  /** Countries to direct-label; the rest are hover-only to avoid collisions. */
  labelled: string[];
}

const W = 720;
const H = 520;
const PAD = { t: 28, r: 20, b: 46, l: 60 };
const PW = W - PAD.l - PAD.r;
// Points whose label would collide with a close neighbour above; drop these below.
const LABEL_BELOW = new Set(["AE", "JP", "GB"]);
const PH = H - PAD.t - PAD.b;

export default function CostIncomeScatter({ points, medPrice, medGni, labelled }: Props) {
  const uid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<ScatterPoint | null>(null);
  const [query, setQuery] = useState("");

  const xMax = Math.max(...points.map((p) => p.priceLevel)) * 1.06;
  const xMin = Math.min(...points.map((p) => p.priceLevel)) * 0.94;
  const yMin = Math.min(...points.map((p) => p.gni)) * 0.85;
  const yMax = Math.max(...points.map((p) => p.gni)) * 1.15;

  const x = (v: number) => PAD.l + ((v - xMin) / (xMax - xMin)) * PW;
  // log scale — see header note
  const y = (v: number) =>
    PAD.t + PH - ((Math.log(v) - Math.log(yMin)) / (Math.log(yMax) - Math.log(yMin))) * PH;

  const xMed = x(medPrice);
  const yMed = y(medGni);

  const match = useMemo(
    () => (query ? points.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : []),
    [points, query],
  );
  const matchSet = useMemo(() => new Set(match.map((p) => p.iso2)), [match]);

  const yTicks = [2000, 5000, 10000, 25000, 50000, 100000].filter((t) => t >= yMin && t <= yMax);
  const xTicks = [0.3, 0.5, 0.7, 0.9, 1.1].filter((t) => t >= xMin && t <= xMax);

  const shortName = (n: string) =>
    ({ "United Arab Emirates": "UAE", "United Kingdom": "UK", "United States": "US" } as Record<string, string>)[
      n.replace(/,.*$/, "")
    ] ?? n.replace(/,.*$/, "").replace(" SAR China", "");

  return (
    <div className={`csc-${uid} not-prose`}>
      <style>{`
        .csc-${uid} { --csc-dot:#3573C4; --csc-grid:#E5E3DE; --csc-q:#F2F1EE; }
        .dark .csc-${uid} { --csc-dot:#4E84D4; --csc-grid:#2A2D33; --csc-q:#16181D; }
      `}</style>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-[var(--color-on-surface-variant)] m-0">
          Each dot is a country. Hover for detail; type to highlight.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Highlight a country…"
          aria-label="Highlight a country on the chart"
          className="h-9 border border-[var(--color-outline)] rounded-lg px-3 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="mt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ maxWidth: W, minWidth: 520 }}
          role="img"
          aria-label="Scatter plot of cost of living against gross national income per capita for 83 countries. Cost and income are strongly correlated, so most countries fall along a diagonal."
        >
          {/* quadrant tints — cheap+rich (top-left) and expensive+poor (bottom-right) */}
          <rect x={PAD.l} y={PAD.t} width={xMed - PAD.l} height={yMed - PAD.t} fill="var(--csc-q)" />
          <rect x={xMed} y={yMed} width={PAD.l + PW - xMed} height={PAD.t + PH - yMed} fill="var(--csc-q)" />

          {/* grid */}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={PAD.l} x2={PAD.l + PW} y1={y(t)} y2={y(t)} stroke="var(--csc-grid)" strokeWidth="1" />
              <text x={PAD.l - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="var(--color-on-surface-muted)">
                ${t >= 1000 ? `${t / 1000}k` : t}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={x(t)} x2={x(t)} y1={PAD.t} y2={PAD.t + PH} stroke="var(--csc-grid)" strokeWidth="1" />
              <text x={x(t)} y={PAD.t + PH + 16} textAnchor="middle" fontSize="10" fill="var(--color-on-surface-muted)">
                {Math.round(t * 100)}%
              </text>
            </g>
          ))}

          {/* median dividers */}
          <line x1={xMed} x2={xMed} y1={PAD.t} y2={PAD.t + PH} stroke="var(--color-on-surface-muted)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <line x1={PAD.l} x2={PAD.l + PW} y1={yMed} y2={yMed} stroke="var(--color-on-surface-muted)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

          {/* quadrant labels */}
          <text x={PAD.l + 8} y={PAD.t + 15} fontSize="10.5" fontWeight="600" fill="var(--color-on-surface-variant)">CHEAP · HIGH EARNING</text>
          <text x={PAD.l + PW - 8} y={PAD.t + 15} textAnchor="end" fontSize="10.5" fontWeight="600" fill="var(--color-on-surface-variant)">EXPENSIVE · HIGH EARNING</text>
          <text x={PAD.l + 8} y={PAD.t + PH - 8} fontSize="10.5" fontWeight="600" fill="var(--color-on-surface-variant)">CHEAP · LOW EARNING</text>
          <text x={PAD.l + PW - 8} y={PAD.t + PH - 8} textAnchor="end" fontSize="10.5" fontWeight="600" fill="var(--color-on-surface-variant)">EXPENSIVE · LOW EARNING</text>

          {/* Points and labels are drawn in TWO passes, not interleaved.
              With one pass, a later country's dot paints over an earlier
              country's label — India rendered as "ndia" because a neighbouring
              dot landed on its first glyph. Dots first, labels second, so text
              is always on top regardless of array order. */}
          {points.map((p) => {
            const isMatch = matchSet.has(p.iso2);
            const dim = query.length > 0 && !isMatch;
            const on = hover?.iso2 === p.iso2 || isMatch;
            return (
              <g
                key={p.iso2}
                onMouseEnter={() => setHover(p)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={x(p.priceLevel)} cy={y(p.gni)} r={14} fill="transparent" />
                <circle
                  cx={x(p.priceLevel)}
                  cy={y(p.gni)}
                  r={on ? 6.5 : 4.5}
                  fill="var(--csc-dot)"
                  fillOpacity={dim ? 0.18 : 0.85}
                  stroke="var(--color-surface)"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {points.map((p) => {
            const isMatch = matchSet.has(p.iso2);
            const dim = query.length > 0 && !isMatch;
            if (!(labelled.includes(p.iso2) || isMatch) || dim) return null;
            // Flip inward near either edge, or the label clips (Switzerland
            // right, India left). Drop a few below their dot where neighbours
            // would otherwise overprint.
            const px = x(p.priceLevel);
            const nearRight = px > PAD.l + PW - 90;
            const dy = LABEL_BELOW.has(p.iso2) ? 14 : -6;
            return (
              <text
                key={`l-${p.iso2}`}
                x={nearRight ? px - 8 : px + 8}
                y={y(p.gni) + dy}
                textAnchor={nearRight ? "end" : "start"}
                fontSize="10.5"
                fill="var(--color-on-surface)"
                stroke="var(--color-surface)"
                strokeWidth="3"
                paintOrder="stroke"
                strokeLinejoin="round"
                pointerEvents="none"
              >{shortName(p.name)}</text>
            );
          })}

          {/* axis titles */}
          <text x={PAD.l + PW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--color-on-surface-variant)">
            Cost of living (US = 100%) →
          </text>
          <text x={14} y={PAD.t + PH / 2} textAnchor="middle" fontSize="11" fill="var(--color-on-surface-variant)"
            transform={`rotate(-90 14 ${PAD.t + PH / 2})`}>
            Income per person (GNI, PPP) →
          </text>
        </svg>
      </div>

      <p className="mt-2 text-xs min-h-[2.5rem] text-[var(--color-on-surface)]">
        {hover ? (
          <span className="bg-[var(--color-surface-container)] rounded-lg px-3 py-2 inline-block">
            <strong>{shortName(hover.name)}</strong> — costs {Math.round(hover.priceLevel * 100)}% of US
            prices, income ${hover.gni.toLocaleString()} per person. Your money goes{" "}
            <strong>{(1 / hover.priceLevel).toFixed(2)}×</strong> as far as at home in the US.
          </span>
        ) : (
          <span className="text-[var(--color-on-surface-variant)]">
            Dashed lines are the medians of the 83 countries plotted.
          </span>
        )}
      </p>
    </div>
  );
}
