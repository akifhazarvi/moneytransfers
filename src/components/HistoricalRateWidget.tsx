"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getProviderName, currencies } from "@/data/providers";
import {
  getRateInsight,
  rateLevelConfig,
  corridorToSlug,
  getAllInsights,
  getMidMarketCurrencies,
  getMidMarketHistory,
  hasMidMarketPair,
  type SparklinePoint,
} from "@/lib/rate-history";
import { getGoUrl } from "@/lib/affiliate";
import { trackProviderClicked } from "@/lib/analytics";
import HistoricalRateChart from "./HistoricalRateChart";

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

// Build combined map: provider corridors + mid-market pairs
function buildCurrencyMap() {
  // Start with provider corridors
  const providerMap: Record<string, Set<string>> = {};
  for (const i of getAllInsights(2)) {
    const [from, to] = i.corridor.split("-");
    if (!providerMap[from]) providerMap[from] = new Set();
    providerMap[from].add(to);
  }

  // Expand with mid-market currencies
  const midCurrencies = getMidMarketCurrencies();
  const allFroms = new Set([...Object.keys(providerMap), ...midCurrencies]);
  const combined: Record<string, Set<string>> = {};

  for (const from of allFroms) {
    combined[from] = new Set(providerMap[from] || []);
    // Add mid-market pairs
    for (const to of midCurrencies) {
      if (to !== from && hasMidMarketPair(from, to)) {
        combined[from].add(to);
      }
    }
  }

  return combined;
}

export default function HistoricalRateWidget({ defaultCorridor = "USD-INR" }: { defaultCorridor?: string }) {
  const currencyMap = useMemo(buildCurrencyMap, []);

  // Popular send currencies first, then the rest alphabetically
  const popularSend = ["USD", "GBP", "EUR", "CAD", "AUD", "AED", "SGD", "NZD", "CHF", "SAR"];
  const sendCurrencies = useMemo(() => {
    const all = Object.keys(currencyMap).sort();
    const popular = popularSend.filter((c) => all.includes(c));
    const rest = all.filter((c) => !popularSend.includes(c));
    return [...popular, ...rest];
  }, [currencyMap]);

  const [defaultFrom, defaultTo] = defaultCorridor.split("-");
  const [fromCurrency, setFromCurrency] = useState(
    sendCurrencies.includes(defaultFrom) ? defaultFrom : sendCurrencies[0] || "USD"
  );

  const payoutCurrencies = useMemo(() =>
    [...(currencyMap[fromCurrency] || [])].sort(),
  [currencyMap, fromCurrency]);

  const [toCurrency, setToCurrency] = useState(() => {
    const available = currencyMap[defaultFrom];
    return available?.has(defaultTo) ? defaultTo : payoutCurrencies[0] || "INR";
  });

  const handleFromChange = (newFrom: string) => {
    setFromCurrency(newFrom);
    const available = currencyMap[newFrom];
    if (!available?.has(toCurrency)) {
      setToCurrency([...(available || [])].sort()[0] || "");
    }
  };

  // Get provider insight (if available) and mid-market data
  const providerInsight = useMemo(() =>
    getRateInsight(fromCurrency, toCurrency),
  [fromCurrency, toCurrency]);

  const midMarketSparkline = useMemo(() =>
    getMidMarketHistory(fromCurrency, toCurrency),
  [fromCurrency, toCurrency]);

  // Build chart data: provider sparklines + mid-market fallback
  const chartSparklines = useMemo(() => {
    if (providerInsight) return providerInsight.sparklines;
    // Mid-market only — show as a single line
    if (midMarketSparkline && midMarketSparkline.length >= 2) {
      return { "__mid-market__": midMarketSparkline } as Record<string, SparklinePoint[]>;
    }
    return null;
  }, [providerInsight, midMarketSparkline]);

  const hasProviderData = !!providerInsight;
  const lvl = providerInsight ? rateLevelConfig(providerInsight.level) : null;
  const slug = providerInsight ? corridorToSlug(providerInsight.corridor) : `${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`;

  // Current rate from provider or mid-market
  const currentRate = providerInsight?.today.bestRate
    ?? (midMarketSparkline && midMarketSparkline.length > 0 ? midMarketSparkline[midMarketSparkline.length - 1].rate : null);

  const totalDays = providerInsight?.totalDays
    ?? (midMarketSparkline?.length || 0);

  const bestProviderUrl = providerInsight
    ? getGoUrl(providerInsight.today.bestProvider, { sourceCurrency: fromCurrency, targetCurrency: toCurrency, sourceAmount: 1000 })
    : null;

  if (!chartSparklines && !currentRate) {
    return (
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-3">Exchange Rate Trends</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <CurrencySelect label="Send" value={fromCurrency} options={sendCurrencies} onChange={handleFromChange} />
          <CurrencySelect label="Payout" value={toCurrency} options={payoutCurrencies} onChange={setToCurrency} />
        </div>
        <p className="text-sm text-[var(--color-on-surface-variant)] text-center py-8">
          No historical data available for {fromCurrency} → {toCurrency} yet. Check back tomorrow.
        </p>
      </div>
    );
  }

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
              {totalDays > 0 ? `${totalDays} days of data` : ""}
              {hasProviderData ? ` · ${Object.keys(providerInsight!.sparklines).length} providers` : " · Mid-market rate"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <CurrencySelect label="Send" value={fromCurrency} options={sendCurrencies} onChange={handleFromChange} />
            <span className="text-[var(--color-on-surface-muted)] text-center hidden sm:block">→</span>
            <CurrencySelect label="Payout" value={toCurrency} options={payoutCurrencies} onChange={setToCurrency} />
          </div>
        </div>
      </div>

      {/* Rate level pill (only for provider data) */}
      <div className="px-5 pt-4 flex items-center gap-3 flex-wrap">
        {lvl && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ color: lvl.color, backgroundColor: lvl.bg }}
          >
            {lvl.icon} Rates are {lvl.label.toLowerCase()}
          </span>
        )}
        {!hasProviderData && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]">
            Mid-market rate (XE)
          </span>
        )}
        {currentRate && (
          <span className="text-2sm text-[var(--color-on-surface-variant)]">
            {hasProviderData ? "Best today: " : "Rate: "}
            <strong className="text-[var(--color-on-surface)]">{currentRate.toFixed(4)}</strong>
            {hasProviderData && <> via {getProviderName(providerInsight!.today.bestProvider)}</>}
          </span>
        )}
      </div>

      {/* Chart */}
      {chartSparklines && (
        <div className="px-5 py-4">
          <HistoricalRateChart
            sparklines={chartSparklines}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            maxProviders={4}
          />
        </div>
      )}

      {/* Stats row (only for provider data with stats) */}
      {hasProviderData && (
        <div className="grid grid-cols-3 border-t border-[var(--color-outline)] bg-[var(--color-surface-dim)]">
          <div className="px-4 py-3 text-center border-r border-[var(--color-outline)]">
            <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-muted)] uppercase tracking-wide">Avg Rate</p>
            <p className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums mt-0.5">{providerInsight!.stats.avgRate.toFixed(4)}</p>
          </div>
          <div className="px-4 py-3 text-center border-r border-[var(--color-outline)]">
            <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-muted)] uppercase tracking-wide">Best</p>
            <p className="text-sm font-semibold text-[var(--color-success)] tabular-nums mt-0.5">{providerInsight!.stats.bestRate.toFixed(4)}</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-muted)] uppercase tracking-wide">Worst</p>
            <p className="text-sm font-semibold text-[var(--color-danger)] tabular-nums mt-0.5">{providerInsight!.stats.worstRate.toFixed(4)}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-[var(--color-outline)]">
        {hasProviderData ? (
          <>
            <Link
              href={`/exchange-rates/history/${slug}`}
              className="flex-1 text-center px-4 py-2.5 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary-surface)] transition-colors"
            >
              See full {fromCurrency}/{toCurrency} history
            </Link>
            <a
              href={bestProviderUrl!}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => providerInsight && trackProviderClicked(providerInsight.today.bestProvider, `${fromCurrency}-${toCurrency}`, 1, "rate_widget")}
              className="flex-1 text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] shadow-sm transition-all"
            >
              Send {fromCurrency} → {toCurrency}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </>
        ) : (
          <Link
            href="/send-money"
            className="flex-1 text-center px-4 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] shadow-sm transition-all"
          >
            Compare providers for {fromCurrency} → {toCurrency}
          </Link>
        )}
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
  const id = `currency-select-${label.toLowerCase()}`;
  return (
    <div className="flex-1">
      <label htmlFor={id} className="text-[10px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wide mb-0.5 block">
        {label}
      </label>
      <select
        id={id}
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
