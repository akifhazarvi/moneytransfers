"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ComparisonTable from "@/components/ComparisonTable";
import SectionHeader from "@/components/SectionHeader";
import CurrencyPicker from "@/components/CurrencyPicker";
import { AddCurrencyPicker } from "@/components/CurrencyPicker";
import { currencies } from "@/data/transfer-currencies";
import CircleFlag from "@/components/CircleFlag";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { getRate } from "@/lib/rates-util";
import { useConverterPagePrefs } from "@/lib/useConverterPrefs";
import ConverterProviderQuotes from "@/components/ConverterProviderQuotes";
import { trackConverterCTAClicked } from "@/lib/analytics";

interface TargetCurrency {
  id: string;
  code: string;
}

const MAX_TARGETS = 6;

const popularPairs = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "USD", to: "INR" },
  { from: "GBP", to: "EUR" },
  { from: "EUR", to: "GBP" },
  { from: "USD", to: "JPY" },
  { from: "USD", to: "CAD" },
  { from: "USD", to: "AUD" },
];

// Top 10 most-used currencies shown in the main rate table (vs USD)
const topCurrencyCodes = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "HKD", "SGD", "INR"];

// Region grouping for the remaining currencies (collapsible sections)
const regionOrder = ["Europe & Central Asia", "Asia & Pacific", "Middle East", "Africa", "Americas", "Other"];

const currencyRegionMap: Record<string, string> = {
  // Europe & Central Asia
  NOK: "Europe & Central Asia", SEK: "Europe & Central Asia", DKK: "Europe & Central Asia",
  PLN: "Europe & Central Asia", RON: "Europe & Central Asia", CZK: "Europe & Central Asia",
  HUF: "Europe & Central Asia", BGN: "Europe & Central Asia", RSD: "Europe & Central Asia",
  BAM: "Europe & Central Asia", MKD: "Europe & Central Asia", ALL: "Europe & Central Asia",
  ISK: "Europe & Central Asia", MDL: "Europe & Central Asia", UAH: "Europe & Central Asia",
  BYN: "Europe & Central Asia", GEL: "Europe & Central Asia", AMD: "Europe & Central Asia",
  KZT: "Europe & Central Asia", KGS: "Europe & Central Asia", UZS: "Europe & Central Asia",
  TRY: "Europe & Central Asia",
  // Asia & Pacific
  KRW: "Asia & Pacific", TWD: "Asia & Pacific", PHP: "Asia & Pacific", PKR: "Asia & Pacific",
  BDT: "Asia & Pacific", NPR: "Asia & Pacific", LKR: "Asia & Pacific", VND: "Asia & Pacific",
  IDR: "Asia & Pacific", THB: "Asia & Pacific", MYR: "Asia & Pacific", NZD: "Asia & Pacific",
  FJD: "Asia & Pacific", KHR: "Asia & Pacific", LAK: "Asia & Pacific", MMK: "Asia & Pacific",
  MNT: "Asia & Pacific", MVR: "Asia & Pacific", BND: "Asia & Pacific",
  // Middle East
  AED: "Middle East", SAR: "Middle East", KWD: "Middle East", QAR: "Middle East",
  BHD: "Middle East", OMR: "Middle East", ILS: "Middle East", JOD: "Middle East",
  LBP: "Middle East", IQD: "Middle East",
  // Africa
  NGN: "Africa", KES: "Africa", GHS: "Africa", ZAR: "Africa", MAD: "Africa",
  EGP: "Africa", ETB: "Africa", UGX: "Africa", TZS: "Africa", XOF: "Africa",
  XAF: "Africa", RWF: "Africa", ZMW: "Africa", DZD: "Africa", MZN: "Africa",
  MGA: "Africa", MUR: "Africa", GMD: "Africa", GNF: "Africa", AOA: "Africa",
  SDG: "Africa", SOS: "Africa", BIF: "Africa", CVE: "Africa", SCR: "Africa",
  ERN: "Africa",
  // Americas
  MXN: "Americas", BRL: "Americas", COP: "Americas", GTQ: "Americas", PEN: "Americas",
  JMD: "Americas", DOP: "Americas", ARS: "Americas", CLP: "Americas", CRC: "Americas",
  HNL: "Americas", NIO: "Americas", TTD: "Americas", HTG: "Americas", BOB: "Americas",
  PYG: "Americas", UYU: "Americas", BZD: "Americas", GYD: "Americas", SRD: "Americas",
};

/* ─── Main Component ─── */
export default function CurrencyConverterClient() {
  const t = useTranslations("currencyConverterClient");
  const idCounter = useRef(1);
  function genId() {
    return `tc-${idCounter.current++}`;
  }

  const prefs = useConverterPagePrefs();
  const [amount, setAmountRaw] = useState(1000);
  const [fromCurrency, setFromCurrencyRaw] = useState("USD");
  const [targets, setTargetsRaw] = useState<TargetCurrency[]>(() => [
    { id: `tc-0`, code: "EUR" },
  ]);
  const { rates, isLive, lastUpdated, secondsUntilRefresh } = useExchangeRates();

  // Hydrate state from localStorage once prefs are loaded.
  // If no saved prefs exist, fall back to geo cookies set by middleware.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!prefs.loaded || hydratedRef.current) return;
    hydratedRef.current = true;

    const hasSavedPrefs = typeof window !== "undefined" && localStorage.getItem("converter-prefs") !== null;

    if (!hasSavedPrefs) {
      function readCookie(name: string) {
        return (document.cookie.match(`(?:^|; )${name}=([^;]*)`) || [])[1];
      }
      const geoCurrency = readCookie("geo-currency");
      const geoDefaultTo = readCookie("geo-default-to");
      const geoDefaultAmount = readCookie("geo-default-amount");

      const validFrom = geoCurrency && currencies.some((c) => c.code === geoCurrency);
      const validTo = geoDefaultTo && currencies.some((c) => c.code === geoDefaultTo);

      if (validFrom) setFromCurrencyRaw(geoCurrency!);
      if (validTo) setTargetsRaw([{ id: genId(), code: geoDefaultTo! }]);
      if (geoDefaultAmount) {
        const parsed = Math.round(parseFloat(geoDefaultAmount));
        if (Number.isFinite(parsed) && parsed > 0) setAmountRaw(parsed);
      }
      return;
    }

    setFromCurrencyRaw(prefs.from);
    setAmountRaw(prefs.amount);
    setTargetsRaw(prefs.targets.map((code) => ({ id: genId(), code })));
  }, [prefs.loaded, prefs.from, prefs.amount, prefs.targets]);

  // Wrap setters to also persist
  const setAmount = useCallback((v: number) => {
    setAmountRaw(v);
    prefs.setAmount(v);
  }, [prefs]);

  const setFromCurrency = useCallback((v: string) => {
    setFromCurrencyRaw(v);
    prefs.setFrom(v);
  }, [prefs]);

  const setTargets: typeof setTargetsRaw = useCallback((updater) => {
    setTargetsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      prefs.setTargets(next.map((t) => t.code));
      return next;
    });
  }, [prefs]);

  // Drag state
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function formatCountdown(secs: number | null) {
    if (secs === null) return "";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const usedCodes = [fromCurrency, ...targets.map((t) => t.code)];

  const addTarget = useCallback((code: string) => {
    setTargets((prev) => {
      if (prev.length >= MAX_TARGETS) return prev;
      return [...prev, { id: genId(), code }];
    });
  }, []);

  const removeTarget = useCallback((id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    // expanded state removed — CTA is always visible
  }, []);

  const updateTargetCode = useCallback((id: string, code: string) => {
    setTargets((prev) => prev.map((t) => (t.id === id ? { ...t, code } : t)));
  }, []);

  // Pin = swap this target currency with the base (top) currency
  const pinToTop = useCallback((id: string) => {
    setTargets((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      // Swap: the current base becomes a target, the target becomes the base
      const oldBase = fromCurrency;
      setFromCurrency(target.code);
      return prev.map((t) => (t.id === id ? { ...t, code: oldBase } : t));
    });
  }, [fromCurrency]);

  // Drag & drop handlers
  const handleDragStart = useCallback((id: string) => {
    setDragId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  }, []);

  const handleDrop = useCallback((targetDropId: string) => {
    if (!dragId || dragId === targetDropId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    setTargets((prev) => {
      const fromIdx = prev.findIndex((t) => t.id === dragId);
      const toIdx = prev.findIndex((t) => t.id === targetDropId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragId(null);
    setDragOverId(null);
  }, [dragId]);

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDragOverId(null);
  }, []);

  function renderRateRow(c: (typeof currencies)[number]) {
    return (
      <tr key={c.code} className="hover:bg-[var(--color-surface-dim)]">
        <td className="px-4 py-3 text-sm">
          <CircleFlag code={c.code} size={16} className="mr-1" />
          <span className="font-medium text-[var(--color-on-surface)]">{c.code}</span>
          <span className="text-[var(--color-on-surface-variant)] ml-2">{c.name}</span>
        </td>
        <td className="px-4 py-3 text-sm text-right font-mono text-[var(--color-on-surface)]">{(rates[c.code] ?? 0).toFixed(4)}</td>
        <td className="px-4 py-3 text-sm text-right font-mono font-medium text-[var(--color-on-surface)]">
          {c.symbol}{(rates[c.code] ?? 0).toFixed(2)}
        </td>
      </tr>
    );
  }

  return (
    <Container className="py-8">
      {/* Converter Card — custom wrapper for resting shadow */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[0_1px_4px_rgba(32,33,36,0.1)] mb-8">
        {/* Base Currency Row */}
        <div className="px-5 md:px-6 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <CurrencyPicker
              value={fromCurrency}
              onChange={setFromCurrency}
              label={t("baseCurrency")}
            />
            {/* Timer — right aligned, next to amount area */}
            {isLive && secondsUntilRefresh !== null && (
              <span className="text-2xs text-[var(--color-on-surface-variant)] flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatCountdown(secondsUntilRefresh)}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1" />
            <div className="text-right">
              <label htmlFor="converter-amount" className="sr-only">{t("amountToConvert")}</label>
              <input
                id="converter-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                className="text-h3 md:text-h2 font-medium text-[var(--color-on-surface)] text-right bg-transparent border-none focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              {targets.length > 0 && (() => {
                const first = targets[0];
                const r = getRate(rates, fromCurrency, first.code);
                return (
                  <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">
                    1 {first.code} = {(1 / r).toFixed(4)} {fromCurrency}
                  </p>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Target Currency Rows */}
        {targets.map((target, index) => {
          const targetInfo = currencies.find((c) => c.code === target.code);
          const rate = getRate(rates, fromCurrency, target.code);
          const converted = amount * rate;
          const isDragging = dragId === target.id;
          const isDragOver = dragOverId === target.id && dragId !== target.id;
          const isFirst = index === 0;

          return (
            <div
              key={target.id}
              draggable
              onDragStart={() => handleDragStart(target.id)}
              onDragOver={(e) => handleDragOver(e, target.id)}
              onDrop={() => handleDrop(target.id)}
              onDragEnd={handleDragEnd}
              className={`transition-opacity ${isDragging ? "opacity-30" : ""}`}
            >
              {/* Blue separator */}
              <div className={`mx-5 md:mx-6 transition-all ${isDragOver ? "h-[3px] bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_rgba(26,115,232,0.4)]" : `h-[2px] rounded-full ${isFirst ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary)]/40"}`}`} />

              <div className="px-5 md:px-6 py-3.5 bg-[var(--color-surface-dim)] transition-all">
                <div className="flex items-center gap-3">
                  {/* Drag handle — visible dots */}
                  <div
                    className="cursor-grab active:cursor-grabbing shrink-0 touch-none"
                    title={t("dragToReorder")}
                  >
                    <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="currentColor" viewBox="0 0 16 16">
                      <circle cx="5" cy="3" r="1.2" />
                      <circle cx="11" cy="3" r="1.2" />
                      <circle cx="5" cy="8" r="1.2" />
                      <circle cx="11" cy="8" r="1.2" />
                      <circle cx="5" cy="13" r="1.2" />
                      <circle cx="11" cy="13" r="1.2" />
                    </svg>
                  </div>

                  <CurrencyPicker
                    value={target.code}
                    onChange={(code) => updateTargetCode(target.id, code)}
                    excludeCodes={[fromCurrency, ...targets.filter((t) => t.id !== target.id).map((t) => t.code)]}
                  />

                  <div className="flex-1 text-right">
                    <span className={`font-medium text-[var(--color-on-surface)] ${isFirst ? "text-2xl md:text-h3" : "text-h4 md:text-h4-plus"}`}>
                      {targetInfo?.symbol}{converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Swap to top — swaps with base currency */}
                  <button
                    onClick={() => pinToTop(target.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors shrink-0"
                    aria-label={t("makeBaseCurrency")}
                    title="Swap to top"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 13V5" />
                      <path d="M4 7l4-5 4 5" />
                    </svg>
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={() => removeTarget(target.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-surface)] transition-colors shrink-0"
                    aria-label={`${t("remove")} ${target.code}`}
                    title={t("remove")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Compare providers CTA — always visible */}
                <div className="mt-2.5 flex items-center gap-2">
                  <a
                    href={`/send-money?from=${fromCurrency}&to=${target.code}&amount=${amount}`}
                    onClick={() => trackConverterCTAClicked(`${fromCurrency}-${target.code}`, amount)}
                    className="flex-1 flex items-center justify-between bg-[var(--color-primary)] text-white rounded-xl px-4 py-2.5 hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <span className="text-2sm font-semibold">
                        Compare providers · {fromCurrency} → {target.code}
                      </span>
                    </div>
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* Actions Row */}
        <div className="border-t border-[var(--color-outline)] px-5 md:px-6 py-3 flex items-center justify-between gap-3">
          <AddCurrencyPicker
            excludeCodes={usedCodes}
            onAdd={addTarget}
            disabled={targets.length >= MAX_TARGETS}
          />

          <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-[var(--color-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                {t("liveMidMarketRates")}
              </span>
            ) : (
              <span>{t("midMarketRate")} · {t("connecting")}</span>
            )}
            {lastUpdated && (
              <span className="text-[var(--color-on-surface-variant)]">
                · {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live provider quotes — reacts to selected pair */}
      {targets.length > 0 && (
        <ConverterProviderQuotes
          from={fromCurrency}
          to={targets[0].code}
          amount={amount}
        />
      )}

      {/* Popular Pairs */}
      <SectionHeader title={t("popularCurrencyPairs")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {popularPairs.map((pair) => {
          const pairRate = getRate(rates, pair.from, pair.to);
          return (
            <button
              key={`${pair.from}-${pair.to}`}
              onClick={() => {
                setFromCurrency(pair.from);
                setTargets([{ id: genId(), code: pair.to }]);
              }}
              className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] p-4 hover:shadow-[0_1px_6px_rgba(32,33,36,0.18)] transition-shadow text-left"
            >
              <p className="text-sm font-medium text-[var(--color-on-surface)] flex items-center gap-1">
                <CircleFlag code={pair.from} size={16} /> {pair.from} → <CircleFlag code={pair.to} size={16} /> {pair.to}
              </p>
              <p className="text-lg font-medium text-[var(--color-primary)] mt-1">
                {pairRate.toFixed(4)}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)]">{t("midMarketRate")}</p>
            </button>
          );
        })}
      </div>

      {/* Rate Table — top 10 most-used currencies */}
      <SectionHeader title={t("exchangeRatesTable")} />
      <ComparisonTable headers={["Currency", "Rate (vs USD)", "1 USD ="]}>
        {topCurrencyCodes
          .map((code) => currencies.find((c) => c.code === code))
          .filter((c): c is (typeof currencies)[number] => c !== undefined)
          .map((c) => renderRateRow(c))}
      </ComparisonTable>

      {/* Remaining currencies, grouped by region in collapsible sections */}
      <h3 className="text-md font-medium text-[var(--color-on-surface)] mt-8 mb-3">
        More currencies by region
      </h3>
      <div className="space-y-3">
        {regionOrder.map((region) => {
          const regionCurrencies = currencies.filter(
            (c) =>
              c.code !== "USD" &&
              !topCurrencyCodes.includes(c.code) &&
              (currencyRegionMap[c.code] ?? "Other") === region
          );
          if (regionCurrencies.length === 0) return null;
          return (
            <details
              key={region}
              className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden hover:bg-[var(--color-surface-dim)] transition-colors">
                <span className="text-sm font-medium text-[var(--color-on-surface)]">{region}</span>
                <span className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                  {regionCurrencies.length} currencies
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-[var(--color-outline)] overflow-x-auto -webkit-overflow-scrolling-touch">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
                    <tr>
                      {["Currency", "Rate (vs USD)", "1 USD ="].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-[var(--color-on-surface-variant)] whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline)]">
                    {regionCurrencies.map((c) => renderRateRow(c))}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </div>
    </Container>
  );
}
