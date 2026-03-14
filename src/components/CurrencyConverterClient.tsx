"use client";

import { useState, useCallback } from "react";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ComparisonTable from "@/components/ComparisonTable";
import SectionHeader from "@/components/SectionHeader";
import CurrencyPicker from "@/components/CurrencyPicker";
import { AddCurrencyPicker } from "@/components/CurrencyPicker";
import { currencies } from "@/data/providers";
import CircleFlag from "@/components/CircleFlag";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { getRate } from "@/lib/rates-util";

interface TargetCurrency {
  id: string;
  code: string;
}

let nextId = 1;
function genId() {
  return `tc-${nextId++}`;
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

/* ─── Main Component ─── */
export default function CurrencyConverterClient() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [targets, setTargets] = useState<TargetCurrency[]>([
    { id: genId(), code: "EUR" },
  ]);
  const { rates, isLive, lastUpdated, secondsUntilRefresh } = useExchangeRates();

  // Drag state
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  // Expanded row (shows Send CTA)
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    setExpandedId((prev) => (prev === id ? null : prev));
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
              label="Base currency"
            />
            {/* Timer — right aligned, next to amount area */}
            {isLive && secondsUntilRefresh !== null && (
              <span className="text-[11px] text-[var(--color-on-surface-variant)] flex items-center gap-1">
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
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                className="text-[28px] md:text-[32px] font-medium text-[var(--color-on-surface)] text-right bg-transparent border-none focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              {targets.length > 0 && (() => {
                const first = targets[0];
                const r = getRate(rates, fromCurrency, first.code);
                return (
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">
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
          const isExpanded = expandedId === target.id;
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

              <div
                className={`px-5 md:px-6 py-3.5 cursor-pointer transition-all ${isExpanded ? "bg-[var(--color-primary-surface)]" : "bg-[var(--color-surface-dim)] hover:bg-[var(--color-primary-surface)]/50"}`}
                onClick={(e) => {
                  const tag = (e.target as HTMLElement).closest("button, a, select, input, [role='listbox']");
                  if (tag) return;
                  setExpandedId(isExpanded ? null : target.id);
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Drag handle — visible dots */}
                  <div
                    className="cursor-grab active:cursor-grabbing shrink-0 touch-none"
                    title="Drag to reorder"
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
                    <span className={`font-medium text-[var(--color-on-surface)] ${isFirst ? "text-[24px] md:text-[28px]" : "text-[22px] md:text-[26px]"}`}>
                      {targetInfo?.symbol}{converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Swap to top — swaps with base currency */}
                  <button
                    onClick={() => pinToTop(target.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors shrink-0"
                    aria-label="Make this the base currency"
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
                    aria-label={`Remove ${target.code}`}
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Send money CTA — only visible when expanded (click on row) */}
                {isExpanded && (
                  <a
                    href={`/send-money?from=${fromCurrency}&to=${target.code}&amount=${amount}`}
                    className="mt-3 flex items-center justify-between bg-[var(--color-primary)] text-white rounded-xl px-4 py-2.5 hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-[13px] font-medium">
                        Send {fromCurrency} to {target.code}
                      </span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
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

          <div className="flex items-center gap-2 text-[12px] text-[var(--color-on-surface-variant)]">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-[var(--color-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                Live mid-market rates
              </span>
            ) : (
              <span>Mid-market rates · Connecting...</span>
            )}
            {lastUpdated && (
              <span className="text-[var(--color-on-surface-variant)]">
                · {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Popular Pairs */}
      <SectionHeader title="Popular Currency Pairs" />
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
              <p className="text-[14px] font-medium text-[var(--color-on-surface)] flex items-center gap-1">
                <CircleFlag code={pair.from} size={16} /> {pair.from} → <CircleFlag code={pair.to} size={16} /> {pair.to}
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
              <CircleFlag code={c.code} size={16} className="mr-1" />
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
