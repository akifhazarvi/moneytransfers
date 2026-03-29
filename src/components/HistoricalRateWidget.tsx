"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getProviderName, currencies } from "@/data/providers";
import { getRateInsight, rateLevelConfig, corridorToSlug, type RateInsight } from "@/lib/rate-history";
import { getGoUrl } from "@/lib/affiliate";
import { Sparkline } from "./RateInsight";
import HistoricalRateChart from "./HistoricalRateChart";

// Top corridors to offer in the selector
const POPULAR_CORRIDORS = [
  "USD-INR", "USD-PHP", "USD-MXN", "GBP-EUR", "GBP-INR", "USD-PKR",
  "USD-NGN", "GBP-USD", "EUR-USD", "CAD-INR", "AUD-INR", "USD-EUR",
];

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

export default function HistoricalRateWidget({ defaultCorridor = "USD-INR" }: { defaultCorridor?: string }) {
  const [selected, setSelected] = useState(defaultCorridor);

  const corridors = useMemo(() =>
    POPULAR_CORRIDORS
      .map((key) => {
        const insight = getRateInsight(key.split("-")[0], key.split("-")[1]);
        return insight ? { key, insight } : null;
      })
      .filter(Boolean) as { key: string; insight: RateInsight }[],
  []);

  const current = useMemo(() => {
    const insight = getRateInsight(selected.split("-")[0], selected.split("-")[1]);
    return insight;
  }, [selected]);

  if (!current || corridors.length === 0) return null;

  const [from, to] = current.corridor.split("-");
  const fromInfo = getCurrencyInfo(from);
  const toInfo = getCurrencyInfo(to);
  const lvl = rateLevelConfig(current.level);
  const slug = corridorToSlug(current.corridor);
  const bestProviderUrl = getGoUrl(current.today.bestProvider, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: 1000,
  });

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--color-outline)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-[var(--color-on-surface)]">
              Exchange Rate Trends
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-0.5">
              Provider rates compared over {current.totalDays} days
            </p>
          </div>
          {/* Corridor selector */}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--color-outline)] bg-[var(--color-surface-dim)] text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full sm:w-auto"
          >
            {corridors.map(({ key, insight }) => {
              const [f, t] = key.split("-");
              const fi = getCurrencyInfo(f);
              const ti = getCurrencyInfo(t);
              return (
                <option key={key} value={key}>
                  {fi?.flag} {f} → {ti?.flag} {t}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Rate level pill */}
      <div className="px-5 pt-4 flex items-center gap-3 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ color: lvl.color, backgroundColor: lvl.bg }}
        >
          {lvl.icon} Rates are {lvl.label.toLowerCase()}
        </span>
        <span className="text-2sm text-[var(--color-on-surface-variant)]">
          Best today: <strong className="text-[var(--color-on-surface)]">{current.today.bestRate.toFixed(4)}</strong> via {getProviderName(current.today.bestProvider)}
        </span>
      </div>

      {/* Chart */}
      <div className="px-5 py-4">
        <HistoricalRateChart
          sparklines={current.sparklines}
          fromCurrency={from}
          toCurrency={to}
          maxProviders={4}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border-t border-[var(--color-outline)] bg-[var(--color-surface-dim)]">
        <div className="px-4 py-3 text-center border-r border-[var(--color-outline)]">
          <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-muted)] uppercase tracking-wide">Avg Rate</p>
          <p className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums mt-0.5">{current.stats.avgRate.toFixed(4)}</p>
        </div>
        <div className="px-4 py-3 text-center border-r border-[var(--color-outline)]">
          <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-muted)] uppercase tracking-wide">Best</p>
          <p className="text-sm font-semibold text-[var(--color-success)] tabular-nums mt-0.5">{current.stats.bestRate.toFixed(4)}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-muted)] uppercase tracking-wide">Worst</p>
          <p className="text-sm font-semibold text-[var(--color-danger)] tabular-nums mt-0.5">{current.stats.worstRate.toFixed(4)}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-[var(--color-outline)]">
        <Link
          href={`/exchange-rates/history/${slug}`}
          className="flex-1 text-center px-4 py-2.5 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary-surface)] transition-colors"
        >
          See full {from}/{to} history
        </Link>
        <a
          href={bestProviderUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] shadow-sm transition-all"
        >
          Send {from} → {to}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
