"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ratesData from "@/data/scraped/xe-midmarket-rates.json";

const forexPairs = [
  { from: "EUR", to: "USD", flag: "\u{1F1EA}\u{1F1FA}" },
  { from: "GBP", to: "USD", flag: "\u{1F1EC}\u{1F1E7}" },
  { from: "USD", to: "JPY", flag: "\u{1F1EF}\u{1F1F5}" },
  { from: "USD", to: "INR", flag: "\u{1F1EE}\u{1F1F3}" },
  { from: "USD", to: "CAD", flag: "\u{1F1E8}\u{1F1E6}" },
  { from: "AUD", to: "USD", flag: "\u{1F1E6}\u{1F1FA}" },
  { from: "USD", to: "CHF", flag: "\u{1F1E8}\u{1F1ED}" },
  { from: "USD", to: "PKR", flag: "\u{1F1F5}\u{1F1F0}" },
  { from: "USD", to: "PHP", flag: "\u{1F1F5}\u{1F1ED}" },
  { from: "USD", to: "NGN", flag: "\u{1F1F3}\u{1F1EC}" },
  { from: "USD", to: "MXN", flag: "\u{1F1F2}\u{1F1FD}" },
  { from: "USD", to: "BRL", flag: "\u{1F1E7}\u{1F1F7}" },
];

function formatRate(rate: number): string {
  if (rate >= 100) return rate.toFixed(2);
  if (rate >= 10) return rate.toFixed(3);
  return rate.toFixed(4);
}

function calcRate(from: string, to: string, rates: Record<string, number>): string {
  if (from === "USD") {
    const r = rates[to];
    if (!r) return "\u2014";
    return formatRate(r);
  }
  const fromRate = rates[from];
  if (!fromRate) return "\u2014";
  return formatRate(1 / fromRate);
}

// Static rates as initial/fallback (from scraped data)
const staticRates = ratesData.rates as Record<string, number>;

export default function ForexTicker() {
  const [liveRates, setLiveRates] = useState<Record<string, number>>(staticRates);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLiveRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (data.rates) setLiveRates(data.rates as Record<string, number>);
      } catch {
        // Keep current rates on failure or abort
      }
    }

    fetchLiveRates();
    const interval = setInterval(fetchLiveRates, 60_000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const items = forexPairs.map((pair) => ({
    ...pair,
    rate: calcRate(pair.from, pair.to, liveRates),
  }));

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-ticker-bg)] border-t border-[var(--color-ticker-border)] overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap py-2 gap-8 w-max">
        {doubled.map((pair, i) => (
          <Link
            key={`${pair.from}${pair.to}-${i}`}
            href="/exchange-rates"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <span className="text-[13px]">{pair.flag}</span>
            <span className="text-[12px] font-medium text-white/90">
              {pair.from}/{pair.to}
            </span>
            <span className="text-[12px] text-sky-300 font-mono">
              {pair.rate}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
