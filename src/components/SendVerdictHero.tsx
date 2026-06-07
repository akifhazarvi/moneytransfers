"use client";

/**
 * SendVerdictHero — the one thing this page does.
 *
 * Answers "is now a good time to send, how much do I get, and who's best?"
 * using our longitudinal rate history (levelPct = today beats X% of tracked
 * days) — the insight competitors can't show. Server-renders the default
 * corridor for AI/Bing, then hydrates: changing corridor or amount re-fetches
 * /api/rate-insight (the client door to the 8 MB dataset) and recomputes.
 *
 * Apple-minimal: one verdict, one number, one button. Everything else lives
 * below the fold under progressive disclosure.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import CircleFlag from "./CircleFlag";
import { getProviderName } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import { trackProviderClicked } from "@/lib/analytics";
import { rateLevelConfig, type RateLevel } from "@/lib/rate-history-types";

export interface VerdictData {
  from: string;
  to: string;
  amount: number;
  level: RateLevel;
  levelPct: number;
  daysTracked: number;
  bestProviderSlug: string;
  bestRate: number;
  receiveNow: number;
  receiveBest: number;
  receiveWorst: number;
  rangePos: number;
}

interface Props {
  initial: VerdictData;
  /** Popular send→receive corridors offered as quick picks. */
  corridors: { from: string; to: string; label: string }[];
}

const SYMBOLS: Record<string, string> = {
  USD: "$", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$", AED: "د.إ", SAR: "﷼",
  SGD: "S$", CHF: "CHF", NZD: "NZ$", INR: "₹", JPY: "¥",
};
const sym = (c: string) => SYMBOLS[c] ?? "";

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

function fmtInt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

// Plain-language verdict headline per level.
const VERDICT_COPY: Record<RateLevel, { head: string }> = {
  great: { head: "Great time to send" },
  good: { head: "Good time to send" },
  typical: { head: "An average day to send" },
  low: { head: "Rates are weak right now" },
};

export default function SendVerdictHero({ initial, corridors }: Props) {
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [amount, setAmount] = useState(initial.amount);
  const [data, setData] = useState<VerdictData>(initial);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  const fetchVerdict = useCallback(async (f: string, t: string, amt: number) => {
    const id = ++reqId.current;
    setLoading(true);
    try {
      const res = await fetch(`/api/rate-insight?from=${f}&to=${t}`);
      const json = await res.json();
      if (id !== reqId.current) return; // stale
      const ins = json.insight;
      if (!ins?.today?.bestProvider) {
        setData((d) => ({ ...d, from: f, to: t, amount: amt, bestProviderSlug: "" }));
        return;
      }
      const perUnit = ins.today.bestReceiveAmount ? ins.today.bestReceiveAmount / 1000 : ins.today.bestRate;
      const feeRatio = ins.today.bestRate > 0 ? perUnit / ins.today.bestRate : 1;
      const span = ins.stats.bestRate - ins.stats.worstRate;
      setData({
        from: f, to: t, amount: amt,
        level: ins.level, levelPct: ins.levelPct, daysTracked: ins.totalDays,
        bestProviderSlug: ins.today.bestProvider, bestRate: ins.today.bestRate,
        receiveNow: Math.round(perUnit * amt),
        receiveBest: Math.round(ins.stats.bestRate * feeRatio * amt),
        receiveWorst: Math.round(ins.stats.worstRate * feeRatio * amt),
        rangePos: span > 0 ? Math.min(1, Math.max(0, (ins.today.bestRate - ins.stats.worstRate) / span)) : 0.5,
      });
    } catch {
      /* keep last good data */
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, []);

  // Re-fetch when corridor changes; recompute amount locally (linear) for snappiness.
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    fetchVerdict(from, to, amount);
  }, [from, to, fetchVerdict]); // eslint-disable-line react-hooks/exhaustive-deps

  // Amount-only change: scale locally, no network round-trip.
  const onAmount = (val: number) => {
    setAmount(val);
    setData((d) => {
      const perUnit = d.amount > 0 ? d.receiveNow / d.amount : d.bestRate;
      const perBest = d.amount > 0 ? d.receiveBest / d.amount : 0;
      const perWorst = d.amount > 0 ? d.receiveWorst / d.amount : 0;
      return {
        ...d,
        amount: val,
        receiveNow: Math.round(perUnit * val),
        receiveBest: Math.round(perBest * val),
        receiveWorst: Math.round(perWorst * val),
      };
    });
  };

  const cfg = rateLevelConfig(data.level);
  const copy = VERDICT_COPY[data.level];
  const hasProvider = !!data.bestProviderSlug;
  const goUrl = hasProvider
    ? getGoUrl(data.bestProviderSlug, { sourceCurrency: from, targetCurrency: to, sourceAmount: amount, clickref: "verdict_hero" })
    : "/send-money";

  const moreThanWorst = data.receiveNow - data.receiveWorst;

  return (
    <div className="rounded-3xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] overflow-hidden">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 px-5 sm:px-7 pt-5 sm:pt-7">
        <CorridorPicker label="Send" value={from} onChange={setFrom} options={[...new Set(corridors.map((c) => c.from))]} />
        <CorridorPicker label="To" value={to} onChange={setTo} options={corridors.filter((c) => c.from === from).map((c) => c.to)} />
        <div className="flex-1">
          <label htmlFor="verdict-amount" className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wide mb-1 block">Amount</label>
          <div className="flex items-center rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
            <span className="text-[var(--color-on-surface-muted)] text-sm mr-1">{sym(from)}</span>
            <input
              id="verdict-amount"
              type="number"
              inputMode="numeric"
              min={1}
              value={amount}
              onChange={(e) => onAmount(Math.max(1, Number(e.target.value) || 0))}
              className="w-full bg-transparent text-sm text-[var(--color-on-surface)] focus:outline-none tabular-nums"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-1.5 px-5 sm:px-7 mt-2">
        {QUICK_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => onAmount(a)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              amount === a
                ? "border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
                : "border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"
            }`}
          >
            {sym(from)}{fmtInt(a)}
          </button>
        ))}
      </div>

      {/* Verdict */}
      <div className="px-5 sm:px-7 py-6 mt-1">
        {hasProvider ? (
          <>
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-bold shrink-0"
                style={{ color: cfg.color, backgroundColor: cfg.bg }}
                aria-hidden="true"
              >
                {cfg.icon}
              </span>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] leading-tight">{copy.head}</p>
                <p className="text-[13px] text-[var(--color-on-surface-variant)]">
                  Today beats <strong className="text-[var(--color-on-surface)]">{data.levelPct}%</strong> of the last {data.daysTracked} days
                </p>
              </div>
            </div>

            {/* The number */}
            <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
              <p className="text-[13px] text-[var(--color-on-surface-variant)]">
                Send {sym(from)}{fmtInt(amount)} {from}, your recipient gets
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-[var(--color-on-surface)] tabular-nums tracking-tight mt-1">
                {fmtInt(data.receiveNow)} <span className="text-2xl sm:text-3xl text-[var(--color-on-surface-variant)] font-semibold">{to}</span>
              </p>
              <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1.5">
                via <strong className="text-[var(--color-on-surface)]">{getProviderName(data.bestProviderSlug)}</strong>
                {moreThanWorst > 0 && (
                  <> · <span className="text-[var(--color-success)] font-medium">{fmtInt(moreThanWorst)} {to} more</span> than the worst day this quarter</>
                )}
              </p>
            </div>

            {/* Range bar: worst —●— best over the tracked window */}
            <div className="mt-5">
              <div className="relative h-2 rounded-full bg-gradient-to-r from-[var(--color-danger-surface)] via-[var(--color-warning-surface)] to-[var(--color-success-surface)]">
                <span
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-surface)] shadow"
                  style={{ left: `${data.rangePos * 100}%`, backgroundColor: cfg.color }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex justify-between text-[11px] text-[var(--color-on-surface-muted)] mt-1.5 tabular-nums">
                <span>Worst {data.daysTracked}d · {fmtInt(data.receiveWorst)}</span>
                <span>Best · {fmtInt(data.receiveBest)}</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href={goUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackProviderClicked(data.bestProviderSlug, `${from}-${to}`, 1, "verdict_hero")}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[var(--color-primary)] text-white text-base font-semibold hover:bg-[var(--color-primary-dark)] shadow-sm transition-all"
            >
              Send with {getProviderName(data.bestProviderSlug)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <p className="text-center text-xs text-[var(--color-on-surface-variant)] mt-2.5">
              <Link href={corridorSlug(from, to) ? `/send-money/${corridorSlug(from, to)}` : "/send-money"} className="text-[var(--color-primary)] hover:underline">Compare all providers</Link>
              {" · "}
              <span>Indicative — confirm the live quote before sending</span>
            </p>
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="text-base font-semibold text-[var(--color-on-surface)]">
              No rate history for {from} → {to} yet
            </p>
            <Link href="/send-money" className="mt-3 inline-flex items-center justify-center px-5 py-3 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)]">
              Compare providers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function corridorSlug(from: string, to: string) {
  // Map currency pair → the most relevant /send-money corridor slug where we have one.
  const map: Record<string, string> = {
    "USD-INR": "usa-to-india", "USD-PHP": "usa-to-philippines", "USD-MXN": "usa-to-mexico",
    "USD-PKR": "usa-to-pakistan", "USD-NGN": "usa-to-nigeria", "GBP-INR": "uk-to-india",
    "GBP-EUR": "uk-to-europe", "CAD-INR": "canada-to-india",
  };
  return map[`${from}-${to}`] ?? "";
}

function CorridorPicker({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const id = `verdict-${label.toLowerCase()}`;
  return (
    <div className="sm:w-[120px]">
      <label htmlFor={id} className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wide mb-1 block">{label}</label>
      <div className="relative flex items-center rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] pl-2.5 pr-1 py-2 focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
        <CircleFlag code={value} size={18} />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent text-sm font-medium text-[var(--color-on-surface)] focus:outline-none pl-2 pr-5 w-full cursor-pointer"
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg className="w-3.5 h-3.5 text-[var(--color-on-surface-muted)] absolute right-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
