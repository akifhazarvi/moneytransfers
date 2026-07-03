"use client";

import { useMemo, useState } from "react";
import { trackToolUsed, trackToolCTA } from "@/lib/analytics";

/**
 * Remittance Fee Impact Calculator (dark / not yet indexed).
 *
 * Emotional, diaspora-focused: shows the yearly cost of overpaying on transfer
 * fees + FX markup, reframed as what that money could have bought in the
 * recipient's country. Angle vs a generic calc: the "you could save" figure is
 * anchored to a realistic markup gap and routes to a live provider comparison.
 */

const FREQ = [
  { id: "weekly", label: "Weekly", perYear: 52 },
  { id: "monthly", label: "Monthly", perYear: 12 },
  { id: "quarterly", label: "Every few months", perYear: 4 },
];

// Illustrative "what it could buy" anchors by receive currency (local monthly
// essentials, rounded). Purely for framing — labelled as illustrative on-page.
const BUYS: Record<string, { label: string; unit: number }> = {
  INR: { label: "months of groceries for a family in India", unit: 8000 },
  PHP: { label: "months of groceries in the Philippines", unit: 9000 },
  NGN: { label: "months of essentials in Nigeria", unit: 90000 },
  MXN: { label: "months of essentials in Mexico", unit: 3500 },
  PKR: { label: "months of essentials in Pakistan", unit: 40000 },
};

const CURRENCIES = Object.keys(BUYS);

export default function FeeImpactCalculator({ source }: { source: string }) {
  const [amount, setAmount] = useState(500);
  const [freq, setFreq] = useState("monthly");
  const [to, setTo] = useState("INR");
  // Typical gap between a high-cost provider (bank/legacy) and a best-value one.
  const [currentCostPct, setCurrentCostPct] = useState(4);
  const BEST_COST_PCT = 0.6;

  const perYear = FREQ.find((f) => f.id === freq)!.perYear;

  const result = useMemo(() => {
    const annualSent = amount * perYear;
    const currentCost = annualSent * (currentCostPct / 100);
    const bestCost = annualSent * (BEST_COST_PCT / 100);
    const saved = Math.max(0, currentCost - bestCost);
    return {
      annualSent: Math.round(annualSent),
      currentCost: Math.round(currentCost),
      saved: Math.round(saved),
    };
  }, [amount, perYear, currentCostPct]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)]/70 shadow-[var(--shadow-md)] overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-5 sm:p-6 space-y-4 border-b md:border-b-0 md:border-r border-[var(--color-outline)]/60">
          <div>
            <label htmlFor="fi-amt" className="block text-sm font-semibold mb-1.5">You send each time (USD)</label>
            <input id="fi-amt" type="number" min={0} inputMode="decimal" value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              onBlur={() => trackToolUsed("fee-impact", { amount, freq, to, currentCostPct, source })}
              className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label htmlFor="fi-freq" className="block text-sm font-semibold mb-1.5">How often?</label>
            <select id="fi-freq" value={freq} onChange={(e) => setFreq(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {FREQ.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fi-to" className="block text-sm font-semibold mb-1.5">Sending to</label>
            <select id="fi-to" value={to} onChange={(e) => setTo(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fi-cost" className="block text-sm font-semibold mb-1.5">
              Your current all-in cost: {currentCostPct}%
            </label>
            <input id="fi-cost" type="range" min={0.5} max={7} step={0.5} value={currentCostPct}
              onChange={(e) => setCurrentCostPct(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]" />
            <p className="text-xs text-[var(--color-on-surface-muted)] mt-1">Banks are typically 3–5%; best-value fintechs ~0.5–1%.</p>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col justify-center bg-[var(--color-success-surface)]/40">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-muted)]">You could save per year</p>
          <p className="mt-1 text-4xl sm:text-5xl font-extrabold tabular-nums text-[var(--color-success-dark)]">{fmt(result.saved)}</p>
          <p className="mt-2 text-sm text-[var(--color-on-surface)]">
            Sending {fmt(amount)} {freq}, you&apos;d move <strong>{fmt(result.annualSent)}</strong> a year and pay about{" "}
            <strong>{fmt(result.currentCost)}</strong> in fees + markup at {currentCostPct}%. Switching to a best-value
            provider could keep <strong>{fmt(result.saved)}</strong> of that in your family&apos;s pocket.
          </p>
          {BUYS[to] && result.saved > 0 && (
            <p className="mt-2 text-xs text-[var(--color-on-surface-muted)]">
              That&apos;s roughly {Math.max(1, Math.round(result.saved / (BUYS[to].unit / getRate(to))))}{" "}
              {BUYS[to].label} (illustrative).
            </p>
          )}
          <a
            href={`/send-money?from=USD&to=${to}&amount=${amount}`}
            onClick={() => trackToolCTA("fee-impact", { amount, freq, to, saved: result.saved, source })}
            className="mt-5 inline-flex items-center justify-center h-11 px-5 rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] font-semibold text-sm hover:bg-[var(--color-cta-hover)] shadow-[var(--shadow-primary)] transition-colors">
            See providers that cost ~0.6% →
          </a>
        </div>
      </div>
    </div>
  );
}

// Rough USD→local rate anchors so the "what it buys" figure lands in the right
// order of magnitude. Illustrative only.
function getRate(to: string): number {
  const r: Record<string, number> = { INR: 83, PHP: 56, NGN: 1500, MXN: 17, PKR: 280 };
  return r[to] || 1;
}
