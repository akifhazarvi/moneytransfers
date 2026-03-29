"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { SparklinePoint } from "@/lib/rate-history";
import { providers, getProviderName } from "@/data/providers";

// ── Provider colors ────────────────────────────────────────────
const PROVIDER_COLORS = [
  "#1a73e8", "#059669", "#dc2626", "#d97706", "#7c3aed",
  "#0891b2", "#be185d", "#65a30d", "#ea580c", "#4f46e5",
];

function getProviderColor(index: number): string {
  return PROVIDER_COLORS[index % PROVIDER_COLORS.length];
}

// ── Types ──────────────────────────────────────────────────────
interface ChartProps {
  sparklines: Record<string, SparklinePoint[]>;
  fromCurrency: string;
  toCurrency: string;
  maxProviders?: number;
}

interface TooltipData {
  date: string;
  x: number;
  y: number;
  providers: { slug: string; rate: number; color: string }[];
}

// ── Chart Component ────────────────────────────────────────────
export default function HistoricalRateChart({
  sparklines,
  fromCurrency,
  toCurrency,
  maxProviders = 6,
}: ChartProps) {
  // Extract mid-market line (special key from build-rate-insights)
  const midMarketData = useMemo(() => sparklines["__mid-market__"] || [], [sparklines]);

  // Sort providers by data points (most first), take top N (exclude mid-market)
  const sortedProviders = useMemo(() =>
    Object.entries(sparklines)
      .filter(([slug, pts]) => slug !== "__mid-market__" && pts.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, maxProviders),
  [sparklines, maxProviders]);

  const [enabledProviders, setEnabledProviders] = useState<Set<string>>(
    () => new Set(sortedProviders.slice(0, 5).map(([slug]) => slug))
  );
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [showMidMarket, setShowMidMarket] = useState(midMarketData.length >= 2);

  // Collect all dates across enabled providers + mid-market
  const allDates = useMemo(() => {
    const dateSet = new Set<string>();
    for (const [slug, pts] of sortedProviders) {
      if (!enabledProviders.has(slug)) continue;
      for (const p of pts) dateSet.add(p.date);
    }
    if (showMidMarket) {
      for (const p of midMarketData) dateSet.add(p.date);
    }
    return [...dateSet].sort();
  }, [sortedProviders, enabledProviders, midMarketData, showMidMarket]);

  // Compute Y range across enabled providers + mid-market
  const { minRate, maxRate } = useMemo(() => {
    let min = Infinity, max = -Infinity;
    for (const [slug, pts] of sortedProviders) {
      if (!enabledProviders.has(slug)) continue;
      for (const p of pts) {
        if (p.rate < min) min = p.rate;
        if (p.rate > max) max = p.rate;
      }
    }
    if (showMidMarket) {
      for (const p of midMarketData) {
        if (p.rate < min) min = p.rate;
        if (p.rate > max) max = p.rate;
      }
    }
    if (min === Infinity) return { minRate: 0, maxRate: 1 };
    const padding = (max - min) * 0.02 || 0.01;
    return { minRate: min - padding, maxRate: max + padding };
  }, [sortedProviders, enabledProviders, midMarketData, showMidMarket]);

  // SVG dimensions
  const width = 700;
  const height = 300;
  const padL = 65, padR = 16, padT = 16, padB = 40;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  // Map date index → X, rate → Y
  const xScale = useCallback((i: number) =>
    padL + (allDates.length > 1 ? (i / (allDates.length - 1)) * chartW : chartW / 2),
  [allDates.length, chartW]);

  const yScale = useCallback((rate: number) => {
    const range = maxRate - minRate || 1;
    return padT + chartH - ((rate - minRate) / range) * chartH;
  }, [minRate, maxRate, chartH]);

  // Build polyline points per provider
  const providerLines = useMemo(() => {
    const colorMap = new Map<string, string>();
    sortedProviders.forEach(([slug], i) => colorMap.set(slug, getProviderColor(i)));

    return sortedProviders
      .filter(([slug]) => enabledProviders.has(slug))
      .map(([slug, pts]) => {
        const dateMap = new Map(pts.map(p => [p.date, p]));
        const points = allDates
          .map((d, i) => {
            const pt = dateMap.get(d);
            return pt ? `${xScale(i)},${yScale(pt.rate)}` : null;
          })
          .filter(Boolean)
          .join(" ");
        return { slug, points, color: colorMap.get(slug)! };
      });
  }, [sortedProviders, enabledProviders, allDates, xScale, yScale]);

  // Y-axis ticks (5 ticks)
  const yTicks = useMemo(() => {
    const range = maxRate - minRate || 1;
    return Array.from({ length: 5 }, (_, i) => {
      const rate = minRate + (range * i) / 4;
      return { rate, y: yScale(rate) };
    });
  }, [minRate, maxRate, yScale]);

  // X-axis labels (show ~5-7 dates)
  const xLabels = useMemo(() => {
    if (allDates.length <= 7) return allDates.map((d, i) => ({ date: d, x: xScale(i) }));
    const step = Math.ceil(allDates.length / 6);
    return allDates
      .filter((_, i) => i % step === 0 || i === allDates.length - 1)
      .map(d => ({ date: d, x: xScale(allDates.indexOf(d)) }));
  }, [allDates, xScale]);

  // Hover handler
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || allDates.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;

    // Find nearest date
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < allDates.length; i++) {
      const dist = Math.abs(xScale(i) - mouseX);
      if (dist < minDist) { minDist = dist; nearestIdx = i; }
    }

    const date = allDates[nearestIdx];
    const provData: TooltipData["providers"] = [];
    const colorMap = new Map<string, string>();
    sortedProviders.forEach(([slug], i) => colorMap.set(slug, getProviderColor(i)));

    for (const [slug, pts] of sortedProviders) {
      if (!enabledProviders.has(slug)) continue;
      const pt = pts.find(p => p.date === date);
      if (pt) provData.push({ slug, rate: pt.rate, color: colorMap.get(slug)! });
    }
    // Add mid-market rate to tooltip
    if (showMidMarket) {
      const midPt = midMarketData.find(p => p.date === date);
      if (midPt) provData.push({ slug: "__mid-market__", rate: midPt.rate, color: "var(--color-on-surface-muted)" });
    }
    provData.sort((a, b) => b.rate - a.rate);

    setTooltip({ date, x: xScale(nearestIdx), y: padT, providers: provData });
  }, [allDates, sortedProviders, enabledProviders, midMarketData, showMidMarket, xScale]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  const toggleProvider = useCallback((slug: string) => {
    setEnabledProviders(prev => {
      const next = new Set(prev);
      if (next.has(slug)) { if (next.size > 1) next.delete(slug); }
      else next.add(slug);
      return next;
    });
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (allDates.length < 2) {
    return (
      <div className="text-center py-8 text-sm text-[var(--color-on-surface-variant)]">
        Not enough historical data to display a chart yet. Check back soon.
      </div>
    );
  }

  return (
    <div>
      {/* Chart */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[500px]"
          style={{ maxHeight: 340 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label={`${fromCurrency} to ${toCurrency} exchange rate history chart`}
        >
          {/* Grid lines */}
          {yTicks.map(({ rate, y }) => (
            <g key={rate}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="var(--color-outline)" strokeWidth="0.5" strokeDasharray="4 4" />
              <text x={padL - 8} y={y + 4} textAnchor="end" className="text-[11px]" fill="var(--color-on-surface-variant)">
                {rate.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xLabels.map(({ date, x }) => (
            <text key={date} x={x} y={height - 8} textAnchor="middle" className="text-[11px]" fill="var(--color-on-surface-variant)">
              {formatDate(date)}
            </text>
          ))}

          {/* Mid-market reference line (dashed) */}
          {showMidMarket && midMarketData.length >= 2 && (() => {
            const dateMap = new Map(midMarketData.map(p => [p.date, p]));
            const pts = allDates
              .map((d, i) => {
                const pt = dateMap.get(d);
                return pt ? `${xScale(i)},${yScale(pt.rate)}` : null;
              })
              .filter(Boolean)
              .join(" ");
            return (
              <polyline
                points={pts}
                fill="none"
                stroke="var(--color-on-surface-muted)"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })()}

          {/* Provider lines */}
          {providerLines.map(({ slug, points, color }) => (
            <polyline
              key={slug}
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Hover crosshair */}
          {tooltip && (
            <line x1={tooltip.x} x2={tooltip.x} y1={padT} y2={padT + chartH} stroke="var(--color-on-surface-muted)" strokeWidth="1" strokeDasharray="3 3" />
          )}

          {/* Hover dots */}
          {tooltip?.providers.map(({ slug, rate, color }) => (
            <circle key={slug} cx={tooltip.x} cy={yScale(rate)} r="4" fill={color} stroke="var(--color-surface)" strokeWidth="2" />
          ))}

          {/* Invisible overlay for mouse events */}
          <rect x={padL} y={padT} width={chartW} height={chartH} fill="transparent" />
        </svg>
      </div>

      {/* Tooltip card */}
      {tooltip && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-lg shadow-[var(--shadow-md)] px-3 py-2 mt-2 text-xs">
          <p className="font-semibold text-[var(--color-on-surface)] mb-1">{formatDate(tooltip.date)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-0.5">
            {tooltip.providers.map(({ slug, rate, color }) => (
              <div key={slug} className="flex items-center gap-1.5">
                {slug === "__mid-market__" ? (
                  <span className="w-3 h-0 border-t-2 border-dashed shrink-0" style={{ borderColor: color }} />
                ) : (
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                )}
                <span className={`truncate ${slug === "__mid-market__" ? "italic text-[var(--color-on-surface-muted)]" : "text-[var(--color-on-surface-variant)]"}`}>
                  {slug === "__mid-market__" ? "Mid-Market (XE)" : getProviderName(slug)}
                </span>
                <span className="font-medium text-[var(--color-on-surface)] tabular-nums ml-auto">{rate.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend / provider toggles */}
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Mid-market toggle */}
        {midMarketData.length >= 2 && (
          <button
            onClick={() => setShowMidMarket((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-2xs font-medium transition-all ${
              showMidMarket
                ? "border-[var(--color-on-surface-muted)] bg-[var(--color-surface)]"
                : "border-[var(--color-outline)] bg-[var(--color-surface-dim)] opacity-50"
            }`}
            style={{ color: showMidMarket ? "var(--color-on-surface-variant)" : "var(--color-on-surface-muted)" }}
          >
            <span className="w-3 h-0 border-t-2 border-dashed" style={{ borderColor: showMidMarket ? "var(--color-on-surface-muted)" : "var(--color-outline)" }} />
            Mid-Market (XE)
          </button>
        )}
        {sortedProviders.map(([slug], i) => {
          const color = getProviderColor(i);
          const enabled = enabledProviders.has(slug);
          return (
            <button
              key={slug}
              onClick={() => toggleProvider(slug)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-2xs font-medium transition-all ${
                enabled
                  ? "border-current bg-[var(--color-surface)]"
                  : "border-[var(--color-outline)] bg-[var(--color-surface-dim)] opacity-50"
              }`}
              style={{ color: enabled ? color : "var(--color-on-surface-muted)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: enabled ? color : "var(--color-outline)" }} />
              {getProviderName(slug)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
