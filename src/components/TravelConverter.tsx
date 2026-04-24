"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import CurrencyPicker from "@/components/CurrencyPicker";
import CircleFlag from "@/components/CircleFlag";
import { currencies } from "@/data/transfer-currencies";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { getRate } from "@/lib/rates-util";

interface Props {
  /** ISO currency code the traveler is converting TO (the destination, e.g. "THB") */
  destinationCurrency: string;
  /** Optional link to the matching send-money corridor */
  corridorHref?: string;
  /** Display name of the country, used for the compare CTA */
  countryName: string;
}

/**
 * Country-aware currency converter for travel pages.
 *
 * Unlike HomepageConverter, this defaults the "to" currency to the destination
 * country's currency (e.g. THB on the Thailand page). The "from" currency is
 * set to USD by default but can be changed. State is local — this widget does
 * not read/write the shared converter-prefs localStorage, so changing the
 * target here doesn't overwrite the user's homepage converter target.
 */
export default function TravelConverter({ destinationCurrency, corridorHref, countryName }: Props) {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(destinationCurrency);
  const { rates, isLive } = useExchangeRates();

  // If the user lands here with a different preferred source currency, we let
  // them change "from" manually — but we never override the destination unless
  // the parent prop changes (e.g. navigating to a different country page).
  useEffect(() => {
    setTo(destinationCurrency);
  }, [destinationCurrency]);

  const rate = getRate(rates, from, to);
  const converted = amount * rate;
  const toInfo = currencies.find((c) => c.code === to);
  const fromInfo = currencies.find((c) => c.code === from);

  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[0_1px_6px_rgba(32,33,36,0.12)] overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4">
          <label htmlFor="tc-amount" className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">
            Amount
          </label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-h3 sm:text-h2 font-medium text-[var(--color-on-surface)]">
              {fromInfo?.symbol || "$"}
            </span>
            <input
              id="tc-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
              className="text-h3 sm:text-h2 font-medium text-[var(--color-on-surface)] bg-transparent border-none focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="h-px bg-[var(--color-outline)]" />

        <div className="px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">From</span>
              <div className="mt-1">
                <CurrencyPicker value={from} onChange={setFrom} label="From currency" />
              </div>
            </div>

            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] hover:border-[var(--color-primary)] transition-colors shrink-0 mt-5"
              aria-label="Swap currencies"
            >
              <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            <div className="flex-1">
              <span className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">To</span>
              <div className="mt-1">
                <CurrencyPicker value={to} onChange={setTo} label="To currency" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-3">
          <div className="flex items-center gap-2 text-2sm text-[var(--color-on-surface-variant)]">
            <CircleFlag code={from} size={16} />
            <span>1 {from} = {rate.toFixed(4)} {to}</span>
            <CircleFlag code={to} size={16} />
            {isLive && (
              <span className="inline-flex items-center gap-1 ml-auto text-2xs text-[var(--color-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-[var(--color-outline)]" />
        <div className="px-5 sm:px-6 py-4 bg-[var(--color-surface-dim)]">
          <p className="text-2sm text-[var(--color-on-surface-variant)] mb-1">
            {fromInfo?.symbol || ""}{amount.toLocaleString()} {from} =
          </p>
          <p className="text-h3 sm:text-h2 font-semibold text-[var(--color-on-surface)]">
            {toInfo?.symbol || ""}{converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
          </p>
          <div className="flex gap-3 mt-3 flex-wrap">
            <Link
              href={corridorHref ?? `/send-money?from=${from}&to=${to}&amount=${amount}`}
              className="text-2sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Compare providers for {countryName} &rarr;
            </Link>
            <Link
              href="/currency-converter"
              className="text-2sm text-[var(--color-on-surface-variant)] hover:underline"
            >
              Full converter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
