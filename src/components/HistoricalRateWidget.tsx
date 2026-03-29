"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getProviderName, currencies } from "@/data/providers";
import { getRateInsight, rateLevelConfig, corridorToSlug, getAllInsights } from "@/lib/rate-history";
import { getGoUrl } from "@/lib/affiliate";
import HistoricalRateChart from "./HistoricalRateChart";

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

// Build a map of available corridors from insights data
function buildCorridorMap() {
  const insights = getAllInsights(2);
  const map: Record<string, Set<string>> = {}; // from → Set<to>
  for (const i of insights) {
    const [from, to] = i.corridor.split("-");
    if (!map[from]) map[from] = new Set();
    map[from].add(to);
  }
  return map;
}

export default function HistoricalRateWidget({ defaultCorridor = "USD-INR" }: { defaultCorridor?: string }) {
  const corridorMap = useMemo(buildCorridorMap, []);
  const sendCurrencies = useMemo(() => Object.keys(corridorMap).sort(), [corridorMap]);

  const [defaultFrom, defaultTo] = defaultCorridor.split("-");
  const [fromCurrency, setFromCurrency] = useState(
    sendCurrencies.includes(defaultFrom) ? defaultFrom : sendCurrencies[0] || "USD"
  );

  // Available payout currencies for selected send currency
  const payoutCurrencies = useMemo(() =>
    [...(corridorMap[fromCurrency] || [])].sort(),
  [corridorMap, fromCurrency]);

  const [toCurrency, setToCurrency] = useState(() => {
    const available = corridorMap[defaultFrom];
    return available?.has(defaultTo) ? defaultTo : payoutCurrencies[0] || "INR";
  });

  // When from changes, reset to if current to isn't available
  const handleFromChange = (newFrom: string) => {
    setFromCurrency(newFrom);
    const available = corridorMap[newFrom];
    if (!available?.has(toCurrency)) {
      setToCurrency([...(available || [])].sort()[0] || "");
    }
  };

  const current = useMemo(() =>
    getRateInsight(fromCurrency, toCurrency),
  [fromCurrency, toCurrency]);

  if (!current) {
    return (
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-3">Exchange Rate Trends</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <CurrencySelect label="Send" value={fromCurrency} options={sendCurrencies} onChange={handleFromChange} />
          <CurrencySelect label="Payout" value={toCurrency} options={payoutCurrencies} onChange={setToCurrency} />
        </div>
        <p className="text-sm text-[var(--color-on-surface-variant)] text-center py-8">
          No historical data available for {fromCurrency} → {toCurrency} yet.
        </p>
      </div>
    );
  }

  const lvl = rateLevelConfig(current.level);
  const slug = corridorToSlug(current.corridor);
  const bestProviderUrl = getGoUrl(current.today.bestProvider, {
    sourceCurrency: fromCurrency,
    targetCurrency: toCurrency,
    sourceAmount: 1000,
  });

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] overflow-hidden">
      {/* Header with currency selectors */}
      <div className="px-5 py-4 border-b border-[var(--color-outline)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)]">
              Exchange Rate Trends
            </h2>
            <span className="text-2sm text-[var(--color-on-surface-variant)] hidden sm:inline">
              {current.totalDays} days of data · {Object.keys(current.sparklines).length} providers
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <CurrencySelect label="Send" value={fromCurrency} options={sendCurrencies} onChange={handleFromChange} />
            <span className="text-[var(--color-on-surface-muted)] text-center hidden sm:block">→</span>
            <CurrencySelect label="Payout" value={toCurrency} options={payoutCurrencies} onChange={setToCurrency} />
          </div>
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
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
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
          See full {fromCurrency}/{toCurrency} history
        </Link>
        <a
          href={bestProviderUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] shadow-sm transition-all"
        >
          Send {fromCurrency} → {toCurrency}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ── Currency Select ───────────────────────────────────────────
function CurrencySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex-1">
      <label className="text-[10px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wide mb-0.5 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[var(--color-outline)] bg-[var(--color-surface-dim)] text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        {options.map((code) => {
          const info = getCurrencyInfo(code);
          return (
            <option key={code} value={code}>
              {info?.flag || ""} {code} — {info?.name || code}
            </option>
          );
        })}
      </select>
    </div>
  );
}
