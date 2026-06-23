"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TransferQuote } from "@/data/providers";
import { getProviderName } from "@/data/providers";
import { trackFreelancerCalcUsed, trackFreelancerCalcCTA } from "@/lib/analytics";

// Common freelancer payout currencies (USD is fixed on the send side, since the
// inputs are "average amount in USD").
const PAYOUT_CURRENCIES = [
  { code: "PHP", flag: "🇵🇭", name: "Philippine Peso" },
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "NGN", flag: "🇳🇬", name: "Nigerian Naira" },
  { code: "PKR", flag: "🇵🇰", name: "Pakistani Rupee" },
  { code: "BRL", flag: "🇧🇷", name: "Brazilian Real" },
  { code: "ARS", flag: "🇦🇷", name: "Argentine Peso" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "KES", flag: "🇰🇪", name: "Kenyan Shilling" },
  { code: "VND", flag: "🇻🇳", name: "Vietnamese Dong" },
];

// Bank baseline assumption — deliberately conservative and clearly labelled so
// the "loss" figure is honest, not inflated. A typical bank embeds a ~3% FX
// markup and charges a flat wire fee around $25.
const BANK_FX_MARKUP = 0.03;
const BANK_WIRE_FEE_USD = 25;

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

interface Props {
  /** "guide:<slug>" — used for attribution */
  source: string;
}

export default function FreelancerCostCalculator({ source }: Props) {
  const [to, setTo] = useState("PHP");
  const [teamSize, setTeamSize] = useState(5);
  const [avgUsd, setAvgUsd] = useState(1500);
  const [quotes, setQuotes] = useState<TransferQuote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const lastTracked = useRef<string>("");

  // Fetch live quotes whenever the corridor or amount changes (debounced).
  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      setLoading(true);
      fetch(`/api/quotes?from=USD&to=${to}&amount=${avgUsd}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (cancelled) return;
          const qs: TransferQuote[] = (data.quotes || []).filter((q: TransferQuote) => !q.isIndicative);
          setQuotes(qs.length ? qs : null);
        })
        .catch(() => !cancelled && setQuotes(null))
        .finally(() => !cancelled && setLoading(false));
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [to, avgUsd]);

  const result = useMemo(() => {
    if (!quotes || quotes.length === 0) return null;
    const best = quotes[0];
    const rate = best.exchangeRate; // mid-market-ish rate the best provider gives
    // What a typical bank delivers: worse rate (markup) minus a flat wire fee.
    const bankReceive = (avgUsd - BANK_WIRE_FEE_USD) * rate * (1 - BANK_FX_MARKUP);
    const bestReceive = best.receiveAmount;
    // Convert the receive-side gap back into USD so the headline number is in USD.
    const lossPerPaymentRecv = Math.max(0, bestReceive - bankReceive);
    const lossPerPaymentUsd = rate > 0 ? lossPerPaymentRecv / rate : 0;
    const monthly = lossPerPaymentUsd * teamSize;
    const annual = monthly * 12;
    return {
      bestProvider: getProviderName(best.providerSlug),
      lossPerPaymentUsd,
      monthly,
      annual,
    };
  }, [quotes, avgUsd, teamSize]);

  const corridor = `USD-${to}`;

  // Track once per settled set of inputs (avoids an event on every slider tick).
  useEffect(() => {
    if (!result) return;
    const key = `${corridor}|${teamSize}|${avgUsd}`;
    const id = setTimeout(() => {
      if (lastTracked.current === key) return;
      lastTracked.current = key;
      trackFreelancerCalcUsed(corridor, teamSize, avgUsd, result.annual);
    }, 800);
    return () => clearTimeout(id);
  }, [result, corridor, teamSize, avgUsd]);

  const handleCTA = useCallback(() => {
    trackFreelancerCalcCTA(corridor, result?.annual ?? 0);
  }, [corridor, result]);

  const compareHref = `/send-money?from=USD&to=${to}&amount=${avgUsd}`;

  return (
    <aside
      className="my-10 rounded-2xl overflow-hidden border border-[var(--color-outline)] shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
      aria-label="How much you lose paying freelancers through a bank"
    >
      {/* Header */}
      <header className="px-5 sm:px-6 py-5 bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
        <h3 className="text-md sm:text-lg font-semibold text-[var(--color-on-surface)]">
          How much are you losing to your bank?
        </h3>
        <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
          Set your team size and what you pay each freelancer. We compare a typical bank against the cheapest live provider for your route.
        </p>
      </header>

      {/* Inputs */}
      <div className="px-5 sm:px-6 py-5 space-y-5 bg-[var(--color-surface)]">
        {/* Payout currency */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Freelancers are paid in
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PAYOUT_CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setTo(c.code)}
                aria-pressed={to === c.code}
                className={`px-3 py-1.5 rounded-full text-2sm font-medium border transition-colors ${
                  to === c.code
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] border-[var(--color-outline)] hover:border-[var(--color-primary-light)]"
                }`}
              >
                <span className="mr-1">{c.flag}</span>
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Team size */}
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="fc-team" className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Team size
            </label>
            <span className="text-md font-semibold text-[var(--color-on-surface)]">
              {teamSize} {teamSize === 1 ? "freelancer" : "freelancers"}
            </span>
          </div>
          <input
            id="fc-team"
            type="range"
            min={1}
            max={50}
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full mt-2 accent-[var(--color-primary)]"
          />
        </div>

        {/* Average amount */}
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="fc-amount" className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Average paid to each, per month
            </label>
            <span className="text-md font-semibold text-[var(--color-on-surface)]">{fmtUSD(avgUsd)}</span>
          </div>
          <input
            id="fc-amount"
            type="range"
            min={100}
            max={10000}
            step={100}
            value={avgUsd}
            onChange={(e) => setAvgUsd(Number(e.target.value))}
            className="w-full mt-2 accent-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Result */}
      <div className="px-5 sm:px-6 py-6 bg-gradient-to-br from-[var(--color-danger-surface)] to-[var(--color-surface)] border-t border-[var(--color-outline)]">
        {loading && !result ? (
          <p className="text-2sm text-[var(--color-on-surface-variant)]">Fetching live rates…</p>
        ) : result && result.annual > 0 ? (
          <>
            <p className="text-2sm text-[var(--color-on-surface-variant)]">
              Paying {teamSize} {teamSize === 1 ? "person" : "people"} {fmtUSD(avgUsd)} each in {to} through a typical bank instead of the cheapest provider ({result.bestProvider}) could cost you about
            </p>
            <p className="mt-2 text-[clamp(1.75rem,6vw,2.5rem)] font-bold leading-none text-[var(--color-danger)]">
              {fmtUSD(result.annual)}<span className="text-md font-semibold text-[var(--color-on-surface-variant)]"> / year</span>
            </p>
            <p className="mt-1 text-2sm text-[var(--color-on-surface-variant)]">
              ≈ {fmtUSD(result.monthly)} per month · {fmtUSD(result.lossPerPaymentUsd)} per payment
            </p>
            <Link
              href={compareHref}
              onClick={handleCTA}
              className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] text-2sm font-semibold hover:bg-[var(--color-cta-hover)] transition-opacity"
            >
              See the cheapest provider for USD → {to} →
            </Link>
          </>
        ) : (
          <p className="text-2sm text-[var(--color-on-surface-variant)]">
            We don&apos;t have live data for this route right now.{" "}
            <Link href={compareHref} className="text-[var(--color-primary)] font-medium hover:underline">
              Compare providers directly →
            </Link>
          </p>
        )}
        <p className="mt-3 text-2xs text-[var(--color-on-surface-muted)] leading-relaxed">
          Bank estimate assumes a ~3% exchange-rate markup plus a {fmtUSD(BANK_WIRE_FEE_USD)} wire fee per payment — typical, but yours may differ. Provider figures are live, updated every 6 hours. This is an estimate, not a quote.
        </p>
      </div>
    </aside>
  );
}
