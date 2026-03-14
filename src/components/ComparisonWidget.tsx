"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import CurrencyPicker from "@/components/CurrencyPicker";

interface Props {
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: number;
  compact?: boolean;
}

export default function ComparisonWidget({
  defaultFrom = "USD",
  defaultTo = "INR",
  defaultAmount = 1000,
  compact = false,
}: Props) {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [amount, setAmount] = useState(defaultAmount);
  const id = useId();

  function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
  }

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  if (compact) {
    const inputClass =
      "w-full h-12 border border-[var(--color-outline)] rounded-lg px-4 text-[14px] bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors";
    return (
      <form onSubmit={handleCompare}>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor={`${id}-amount`} className="block text-[12px] font-medium text-[var(--color-on-surface-variant)] mb-1.5">You send</label>
            <input id={`${id}-amount`} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1} className={inputClass} placeholder="1,000" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-on-surface-variant)] mb-1.5">From</label>
            <div className="h-12 border border-[var(--color-outline)] rounded-lg px-4 flex items-center bg-[var(--color-surface)]">
              <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} size="compact" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-on-surface-variant)] mb-1.5">To</label>
            <div className="h-12 border border-[var(--color-outline)] rounded-lg px-4 flex items-center bg-[var(--color-surface)]">
              <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="compact" />
            </div>
          </div>
          <button type="submit" className="w-full h-12 bg-[var(--color-primary)] text-white rounded-full font-medium text-[14px] hover:bg-[var(--color-primary-dark)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.2)] active:shadow-none transition-all">
            Compare
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleCompare}>
      {/* Google Flights-style connected search bar */}
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Amount */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-[var(--color-outline)] px-4 py-2.5">
            <label htmlFor={`${id}-send`} className="text-[11px] text-[var(--color-on-surface-variant)] font-medium">You send</label>
            <input
              id={`${id}-send`}
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              className="w-full bg-transparent text-[16px] text-[var(--color-on-surface)] focus:outline-none mt-0.5"
              placeholder="1,000"
            />
          </div>

          {/* From */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-[var(--color-outline)] px-4 py-2.5">
            <p className="text-[11px] text-[var(--color-on-surface-variant)] font-medium">From</p>
            <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} size="inline" />
          </div>

          {/* Swap button */}
          <div className="hidden md:flex items-center justify-center px-3">
            <button
              type="button"
              onClick={swap}
              className="w-10 h-10 rounded-full border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-container)] hover:border-[var(--color-on-surface-variant)] active:scale-95 transition-all"
              aria-label="Swap currencies"
            >
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div className="flex-1 border-b md:border-b-0 md:border-l border-[var(--color-outline)] px-4 py-2.5">
            <p className="text-[11px] text-[var(--color-on-surface-variant)] font-medium">To</p>
            <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="inline" />
          </div>
        </div>
      </div>

      {/* Search button below */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="h-12 bg-[var(--color-primary)] text-white rounded-full font-medium text-[15px] px-10 hover:bg-[var(--color-primary-dark)] hover:shadow-[0_2px_8px_rgba(26,115,232,0.3)] active:shadow-none transition-all flex items-center gap-2.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Compare providers
        </button>
      </div>
    </form>
  );
}
