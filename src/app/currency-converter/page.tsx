"use client";

import { useState, useMemo } from "react";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ComparisonTable from "@/components/ComparisonTable";
import SectionHeader from "@/components/SectionHeader";
import { currencies } from "@/data/providers";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { getRate } from "@/lib/rates-util";

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const { rates, isLive, lastUpdated } = useExchangeRates();

  const rate = useMemo(() => getRate(rates, fromCurrency, toCurrency), [rates, fromCurrency, toCurrency]);
  const converted = useMemo(() => amount * rate, [amount, rate]);

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  const fromInfo = currencies.find((c) => c.code === fromCurrency);
  const toInfo = currencies.find((c) => c.code === toCurrency);

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

  const inputClass =
    "border border-[var(--color-outline)] rounded-lg px-3 py-3 text-[14px] bg-white text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors";

  return (
    <Container className="py-8">
      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">Currency Converter</h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        Convert between 150+ currencies with live exchange rates, updated every 60 seconds.
      </p>

      {/* Converter */}
      <Card className="!p-6 md:!p-8 mb-8">
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-on-surface-variant)] mb-1">Amount</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                className={`${inputClass} flex-1`}
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={inputClass}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={swap}
            className="w-10 h-10 mx-auto bg-[var(--color-surface-container)] rounded-full flex items-center justify-center hover:bg-[var(--color-primary-surface)] transition-colors self-end mb-1"
            aria-label="Swap currencies"
          >
            <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <div>
            <label className="block text-[12px] font-medium text-[var(--color-on-surface-variant)] mb-1">Converted To</label>
            <div className="flex gap-2">
              <div className="flex-1 border border-[var(--color-outline)] bg-[var(--color-surface-dim)] rounded-lg px-3 py-3 text-[14px] font-medium text-[var(--color-on-surface)]">
                {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className={inputClass}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--color-outline)] text-center">
          <p className="text-[14px] text-[var(--color-on-surface-variant)]">
            <span className="font-medium">{fromInfo?.flag} 1 {fromCurrency}</span>
            {" = "}
            <span className="font-medium text-[var(--color-primary)]">
              {toInfo?.flag} {rate.toFixed(4)} {toCurrency}
            </span>
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-1">
            {isLive ? (
              <>
                <span className="inline-flex items-center gap-1 text-[var(--color-success)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                  Live rate
                </span>
                {lastUpdated && <> · Updated {lastUpdated.toLocaleTimeString()}</>}
              </>
            ) : (
              "Mid-market rate · Connecting..."
            )}
          </p>
        </div>
      </Card>

      {/* Popular Pairs */}
      <SectionHeader title="Popular Currency Pairs" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {popularPairs.map((pair) => {
          const pairRate = getRate(rates, pair.from, pair.to);
          const fromFlag = currencies.find((c) => c.code === pair.from)?.flag;
          const toFlag = currencies.find((c) => c.code === pair.to)?.flag;
          return (
            <button
              key={`${pair.from}-${pair.to}`}
              onClick={() => {
                setFromCurrency(pair.from);
                setToCurrency(pair.to);
              }}
              className="bg-white rounded-xl border border-[var(--color-outline)] p-4 hover:shadow-[0_1px_6px_rgba(32,33,36,0.18)] transition-shadow text-left"
            >
              <p className="text-[14px] font-medium text-[var(--color-on-surface)]">
                {fromFlag} {pair.from} → {toFlag} {pair.to}
              </p>
              <p className="text-[18px] font-medium text-[var(--color-primary)] mt-1">
                {pairRate.toFixed(4)}
              </p>
              <p className="text-[12px] text-[var(--color-on-surface-variant)]">Mid-market rate</p>
            </button>
          );
        })}
      </div>

      {/* Rate Table */}
      <SectionHeader title="Exchange Rates Table" />
      <ComparisonTable headers={["Currency", "Rate (vs USD)", "1 USD ="]}>
        {currencies.filter((c) => c.code !== "USD").map((c) => (
          <tr key={c.code} className="hover:bg-[var(--color-surface-dim)]">
            <td className="px-4 py-3 text-[14px]">
              <span className="mr-2">{c.flag}</span>
              <span className="font-medium text-[var(--color-on-surface)]">{c.code}</span>
              <span className="text-[var(--color-on-surface-variant)] ml-2">{c.name}</span>
            </td>
            <td className="px-4 py-3 text-[14px] text-right font-mono text-[var(--color-on-surface)]">{(rates[c.code] ?? 0).toFixed(4)}</td>
            <td className="px-4 py-3 text-[14px] text-right font-mono font-medium text-[var(--color-on-surface)]">
              {c.symbol}{(rates[c.code] ?? 0).toFixed(2)}
            </td>
          </tr>
        ))}
      </ComparisonTable>
    </Container>
  );
}
