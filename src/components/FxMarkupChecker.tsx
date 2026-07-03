"use client";

import { useEffect, useMemo, useState } from "react";
import type { TransferQuote } from "@/data/providers";
import { trackToolUsed, trackToolCTA } from "@/lib/analytics";

/**
 * FX Markup Checker.
 *
 * You paste the exchange rate a provider quoted you; we compare it to the live
 * mid-market rate and show the hidden markup — in %, and in real money on your
 * amount. Our angle vs a static checker: the mid-market reference is LIVE (from
 * our quote engine) and the result hands off to the actual best-value provider
 * for that corridor, so it drives a real comparison rather than just a number.
 */

const SEND = ["USD", "GBP", "EUR", "CAD", "AUD", "AED", "SGD"];
const RECEIVE = ["INR", "PHP", "MXN", "NGN", "PKR", "BRL", "EUR", "GBP", "KES", "VND"];

export default function FxMarkupChecker({
  source,
  initialFrom = "USD",
  initialTo = "INR",
  initialMidMarket,
}: {
  source: string;
  initialFrom?: string;
  initialTo?: string;
  initialMidMarket: number;
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [amount, setAmount] = useState(1000);
  const [quotedRate, setQuotedRate] = useState<string>("");
  const [midMarket, setMidMarket] = useState(initialMidMarket);
  const [bestProvider, setBestProvider] = useState<TransferQuote | null>(null);
  const [loading, setLoading] = useState(false);

  // Refresh live mid-market + best provider whenever the corridor changes.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/quotes?from=${from}&to=${to}&amount=${amount}`);
        const data: { quotes?: TransferQuote[] } = await res.json();
        if (cancelled) return;
        const quotes = (data.quotes || []).filter((q) => !q.isIndicative);
        const best = quotes[0] ?? null;
        setBestProvider(best);
        // Best real rate available is our closest live proxy for mid-market;
        // fall back to the server-provided static mid-market otherwise.
        if (best?.exchangeRate) setMidMarket(best.exchangeRate);
      } catch {
        // network hiccup — keep the last known mid-market
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to, amount]);

  const parsedRate = parseFloat(quotedRate);
  const result = useMemo(() => {
    if (!Number.isFinite(parsedRate) || parsedRate <= 0 || midMarket <= 0) return null;
    const markupPct = ((midMarket - parsedRate) / midMarket) * 100;
    const lostReceive = (midMarket - parsedRate) * amount; // in receive currency
    const lostSend = (markupPct / 100) * amount; // approx in send currency
    return {
      markupPct: Math.round(markupPct * 100) / 100,
      lostSend: Math.round(lostSend * 100) / 100,
      lostReceive: Math.round(lostReceive * 100) / 100,
    };
  }, [parsedRate, midMarket, amount]);

  const fmtSend = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: from, maximumFractionDigits: 2 });

  const verdict =
    result == null
      ? null
      : result.markupPct <= 0.5
      ? { tone: "good", label: "Excellent — near mid-market" }
      : result.markupPct <= 1.5
      ? { tone: "ok", label: "Fair — but you can likely do better" }
      : { tone: "bad", label: "High markup — you're overpaying" };

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)]/70 shadow-[var(--shadow-md)] overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Inputs */}
        <div className="p-5 sm:p-6 space-y-4 border-b md:border-b-0 md:border-r border-[var(--color-outline)]/60">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fx-from" className="block text-sm font-semibold mb-1.5">You send</label>
              <select id="fx-from" value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                {SEND.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="fx-to" className="block text-sm font-semibold mb-1.5">They receive</label>
              <select id="fx-to" value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                {RECEIVE.filter((c) => c !== from).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="fx-amt" className="block text-sm font-semibold mb-1.5">Amount ({from})</label>
            <input id="fx-amt" type="number" min={0} inputMode="decimal" value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div>
            <label htmlFor="fx-rate" className="block text-sm font-semibold mb-1.5">
              Exchange rate you were quoted
            </label>
            <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-muted)]">
              <span className="tabular-nums">1 {from} =</span>
              <input id="fx-rate" type="number" min={0} step="any" inputMode="decimal"
                placeholder={midMarket ? midMarket.toFixed(4) : "rate"}
                value={quotedRate}
                onChange={(e) => setQuotedRate(e.target.value)}
                onBlur={() => trackToolUsed("fx-markup-checker", { from, to, amount, quoted: parsedRate || 0, source })}
                className="flex-1 h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-semibold tabular-nums text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              <span>{to}</span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-on-surface-muted)]">
              Live mid-market reference: <strong className="tabular-nums">1 {from} = {midMarket ? midMarket.toFixed(4) : "—"} {to}</strong>
              {loading && <span className="ml-1 opacity-60">updating…</span>}
            </p>
          </div>
        </div>

        {/* Result */}
        <div className={`p-5 sm:p-6 flex flex-col justify-center ${
          !verdict ? "" : verdict.tone === "good" ? "bg-[var(--color-success-surface)]/40"
          : verdict.tone === "ok" ? "bg-[var(--color-warning-surface,#fff7ed)]/60" : "bg-[var(--color-error-surface)]/40"}`}>
          {!result ? (
            <p className="text-sm text-[var(--color-on-surface-muted)]">
              Enter the rate a provider (or your bank) quoted you to see the hidden markup and what it costs on {fmtSend(amount)}.
            </p>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-muted)]">Hidden FX markup</p>
              <p className={`mt-1 text-4xl sm:text-5xl font-extrabold tabular-nums ${
                verdict!.tone === "good" ? "text-[var(--color-success-dark)]" : verdict!.tone === "ok" ? "text-[#b45309]" : "text-[var(--color-error)]"}`}>
                {result.markupPct > 0 ? result.markupPct.toFixed(2) : "0.00"}%
              </p>
              <p className={`mt-1 text-sm font-semibold ${
                verdict!.tone === "good" ? "text-[var(--color-success-dark)]" : verdict!.tone === "ok" ? "text-[#b45309]" : "text-[var(--color-error)]"}`}>
                {verdict!.label}
              </p>
              <p className="mt-2 text-sm text-[var(--color-on-surface)]">
                {result.markupPct > 0 ? (
                  <>That markup costs you about <strong>{fmtSend(result.lostSend)}</strong> on {fmtSend(amount)} — money that disappears into the rate, on top of any advertised fee.</>
                ) : (
                  <>You were quoted at or better than mid-market — that&apos;s a great rate.</>
                )}
              </p>

              <a
                href={`/send-money?from=${from}&to=${to}&amount=${amount}`}
                onClick={() => trackToolCTA("fx-markup-checker", { from, to, amount, markup: result.markupPct, source })}
                className="mt-5 inline-flex items-center justify-center h-11 px-5 rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] font-semibold text-sm hover:bg-[var(--color-cta-hover)] shadow-[var(--shadow-primary)] transition-colors">
                {bestProvider ? `Beat it — see ${from} → ${to} providers →` : `Compare ${from} → ${to} providers →`}
              </a>
              {bestProvider && (
                <p className="mt-2 text-xs text-[var(--color-on-surface-muted)]">
                  Best live rate right now: {bestProvider.providerSlug} at 1 {from} = {bestProvider.exchangeRate.toFixed(4)} {to}.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
