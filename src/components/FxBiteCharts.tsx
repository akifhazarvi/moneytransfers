"use client";

import { useId, useState } from "react";

/**
 * The two charts for /guides/fx-cost-vs-purchasing-power.
 *
 * Inline SVG, no chart library — the site's CSP is strict and a dependency
 * would not earn its bundle weight for two static-data charts.
 *
 * PALETTE (validated, do not eyeball-substitute)
 * Blue #3573C4 + amber #B57A12 (light) / #4E84D4 + #B98A34 (dark). Both modes
 * pass the full six-check validation against the site's own surfaces: lightness
 * band, chroma floor, CVD separation (ΔE ~24 protan — well clear of the 8 floor),
 * normal-vision floor and 3:1 contrast. Blue/amber was chosen over the intuitive
 * green/red precisely because green/red measured ΔE 6.4 under protanopia — the
 * classic red-green failure. Colours are also never the sole carrier of meaning
 * here: both series are direct-labelled and the table view repeats every value.
 */

export interface BiteRow {
  name: string;
  /** Purchasing-power multiplier vs home. */
  multiplier: number;
  /** % uplift in buying power, i.e. (multiplier - 1) * 100. */
  gainPct: number;
  /** Share of that uplift consumed by the dearest provider, %. */
  eatenWorst: number;
  /** Same for the cheapest provider, %. */
  eatenBest: number;
  /** Annual FX cost in the earner's currency. */
  costBest: number;
  costWorst: number;
}

interface Props {
  rows: BiteRow[];
  bestName: string;
  worstName: string;
  bestPct: number;
  worstPct: number;
  salary: number;
  currency: string;
}

const money = (n: number, ccy: string) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n);

export default function FxBiteCharts({ rows, bestName, worstName, bestPct, worstPct, salary, currency }: Props) {
  const uid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<{ i: number; chart: "bar" | "dumb" } | null>(null);
  const [showTable, setShowTable] = useState(false);

  // ── Chart 1: share of the gain eaten ────────────────────────────
  const rowH = 30;
  const barTop = 8;
  const labelW = 132;
  const chartW = 560;
  const plotW = chartW - labelW - 56;
  const maxEaten = Math.max(...rows.map((r) => r.eatenWorst));
  const scale = (v: number) => (v / maxEaten) * plotW;
  const h1 = rows.length * rowH + barTop + 26;

  // ── Chart 2: net gain, best vs worst provider ───────────────────
  const maxGain = Math.max(...rows.map((r) => r.gainPct));
  const dScale = (v: number) => (v / maxGain) * plotW;
  const h2 = rows.length * rowH + barTop + 26;

  return (
    <div className="not-prose">
      {/* Dark steps are re-picked against the dark surface and re-validated —
          not an automatic flip of the light values. */}
      <style>{`
        .fxb-${uid} { --fxb-blue:#3573C4; --fxb-amber:#B57A12; --fxb-grid:#E5E3DE; }
        .dark .fxb-${uid} { --fxb-blue:#4E84D4; --fxb-amber:#B98A34; --fxb-grid:#2A2D33; }
      `}</style>

      <div className={`fxb-${uid}`}>
        {/* ══ Chart 1 ══════════════════════════════════════════ */}
        <figure className="m-0">
          <figcaption className="text-sm font-medium text-[var(--color-on-surface)]">
            How much of your gain the wrong provider takes
          </figcaption>
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
            Share of the purchasing-power uplift consumed by FX spread, if you use {worstName} ({worstPct}%)
            instead of {bestName} ({bestPct}%). Longer bar = more of your advantage gone.
          </p>

          <div className="mt-3 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${h1}`}
              width="100%"
              style={{ maxWidth: chartW, minWidth: 460 }}
              role="img"
              aria-label={`Share of purchasing-power gain lost to FX spread, by country. Highest: ${rows[0].name} at ${Math.round(rows[0].eatenWorst)} percent.`}
            >
              {[0, 25, 50, 75].filter((t) => t <= maxEaten).map((t) => (
                <g key={t}>
                  <line
                    x1={labelW + scale(t)} x2={labelW + scale(t)} y1={barTop} y2={h1 - 26}
                    stroke="var(--fxb-grid)" strokeWidth="1"
                  />
                  <text
                    x={labelW + scale(t)} y={h1 - 10} textAnchor="middle"
                    fontSize="10" fill="var(--color-on-surface-muted)"
                  >{t}%</text>
                </g>
              ))}

              {rows.map((r, i) => {
                const y = barTop + i * rowH;
                const w = Math.max(2, scale(r.eatenWorst));
                const on = hover?.chart === "bar" && hover.i === i;
                return (
                  <g
                    key={r.name}
                    onMouseEnter={() => setHover({ i, chart: "bar" })}
                    onMouseLeave={() => setHover(null)}
                  >
                    {/* hit target larger than the mark */}
                    <rect x={0} y={y} width={chartW} height={rowH} fill="transparent" />
                    <text
                      x={labelW - 8} y={y + 15} textAnchor="end" fontSize="11.5" dominantBaseline="middle"
                      fill="var(--color-on-surface)"
                    >{r.name}</text>
                    <rect
                      x={labelW} y={y + 5} width={w} height={16} rx="4"
                      fill="var(--fxb-amber)" opacity={on ? 1 : 0.88}
                    />
                    <text
                      x={labelW + w + 7} y={y + 15} fontSize="11" dominantBaseline="middle"
                      fill="var(--color-on-surface-variant)"
                    >{Math.round(r.eatenWorst)}%</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {hover?.chart === "bar" && (
            <p className="mt-2 text-xs text-[var(--color-on-surface)] bg-[var(--color-surface-container)] rounded-lg px-3 py-2">
              <strong>{rows[hover.i].name}</strong> — buying power {rows[hover.i].multiplier.toFixed(2)}× (a{" "}
              {Math.round(rows[hover.i].gainPct)}% uplift). {worstName} costs{" "}
              {money(rows[hover.i].costWorst, currency)}/yr, which is{" "}
              {Math.round(rows[hover.i].eatenWorst)}% of that uplift. {bestName} costs{" "}
              {money(rows[hover.i].costBest, currency)} — {rows[hover.i].eatenBest.toFixed(1)}%.
            </p>
          )}
        </figure>

        {/* ══ Chart 2 ══════════════════════════════════════════ */}
        <figure className="m-0 mt-10">
          <figcaption className="text-sm font-medium text-[var(--color-on-surface)]">
            What you actually keep
          </figcaption>
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
            Purchasing-power uplift after FX cost, on {money(salary, currency)} a year.
          </p>

          {/* legend — always present for 2 series */}
          <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "var(--fxb-blue)" }} />
              After {bestName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "var(--fxb-amber)" }} />
              After {worstName}
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${h2}`}
              width="100%"
              style={{ maxWidth: chartW, minWidth: 460 }}
              role="img"
              aria-label="Purchasing-power uplift remaining after FX cost, cheapest versus dearest provider, by country."
            >
              {[0, 25, 50, 75, 100].filter((t) => t <= maxGain).map((t) => (
                <g key={t}>
                  <line
                    x1={labelW + dScale(t)} x2={labelW + dScale(t)} y1={barTop} y2={h2 - 26}
                    stroke="var(--fxb-grid)" strokeWidth="1"
                  />
                  <text
                    x={labelW + dScale(t)} y={h2 - 10} textAnchor="middle"
                    fontSize="10" fill="var(--color-on-surface-muted)"
                  >{t}%</text>
                </g>
              ))}

              {rows.map((r, i) => {
                const y = barTop + i * rowH + 13;
                const netBest = r.gainPct - (r.gainPct * r.eatenBest) / 100;
                const netWorst = r.gainPct - (r.gainPct * r.eatenWorst) / 100;
                const xb = labelW + dScale(netBest);
                const xw = labelW + dScale(netWorst);
                const on = hover?.chart === "dumb" && hover.i === i;
                return (
                  <g
                    key={r.name}
                    onMouseEnter={() => setHover({ i, chart: "dumb" })}
                    onMouseLeave={() => setHover(null)}
                  >
                    <rect x={0} y={y - 13} width={chartW} height={rowH} fill="transparent" />
                    <text
                      x={labelW - 8} y={y} textAnchor="end" fontSize="11.5" dominantBaseline="middle"
                      fill="var(--color-on-surface)"
                    >{r.name}</text>
                    <line x1={xw} x2={xb} y1={y} y2={y} stroke="var(--fxb-grid)" strokeWidth="2" />
                    {/* 2px surface ring so overlapping dots stay separable */}
                    <circle cx={xw} cy={y} r={on ? 6 : 5} fill="var(--fxb-amber)" stroke="var(--color-surface)" strokeWidth="2" />
                    <circle cx={xb} cy={y} r={on ? 6 : 5} fill="var(--fxb-blue)" stroke="var(--color-surface)" strokeWidth="2" />
                    <text
                      x={Math.max(xb, xw) + 10} y={y} fontSize="11" dominantBaseline="middle"
                      fill="var(--color-on-surface-variant)"
                    >{Math.round(netBest)}%</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {hover?.chart === "dumb" && (
            <p className="mt-2 text-xs text-[var(--color-on-surface)] bg-[var(--color-surface-container)] rounded-lg px-3 py-2">
              <strong>{rows[hover.i].name}</strong> — a {Math.round(rows[hover.i].gainPct)}% uplift becomes{" "}
              {Math.round(rows[hover.i].gainPct - (rows[hover.i].gainPct * rows[hover.i].eatenBest) / 100)}% after{" "}
              {bestName}, but only{" "}
              {Math.round(rows[hover.i].gainPct - (rows[hover.i].gainPct * rows[hover.i].eatenWorst) / 100)}% after{" "}
              {worstName}.
            </p>
          )}
        </figure>

        {/* ══ Table view (accessibility + the numbers verbatim) ══ */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="text-sm text-[var(--color-primary)] hover:underline"
            aria-expanded={showTable}
          >
            {showTable ? "Hide" : "Show"} the numbers as a table
          </button>
          {showTable && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Purchasing power and FX cost by country
                </caption>
                <thead>
                  <tr className="text-left text-[var(--color-on-surface-variant)]">
                    <th className="pb-2 pr-3 font-medium">Country</th>
                    <th className="pb-2 px-3 font-medium text-right">Buying power</th>
                    <th className="pb-2 px-3 font-medium text-right">Uplift</th>
                    <th className="pb-2 px-3 font-medium text-right">{worstName} eats</th>
                    <th className="pb-2 pl-3 font-medium text-right">{bestName} eats</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.name} className="border-t border-[var(--color-outline)]">
                      <td className="py-2 pr-3 text-[var(--color-on-surface)]">{r.name}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{r.multiplier.toFixed(2)}×</td>
                      <td className="py-2 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{Math.round(r.gainPct)}%</td>
                      <td className="py-2 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{Math.round(r.eatenWorst)}%</td>
                      <td className="py-2 pl-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{r.eatenBest.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
