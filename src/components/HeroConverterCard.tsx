"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CurrencyPicker from "@/components/CurrencyPicker";
import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import { type TransferQuote } from "@/data/providers";
import { fetchQuotes } from "@/lib/fetch-quotes";
import { useHomeSelection } from "@/components/HomeSelectionContext";
import { useGeoSelection } from "@/lib/useGeoSelection";
import { trackCompareSearch } from "@/lib/analytics";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1_000_000;

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹", PKR: "Rs", MXN: "MX$", PHP: "₱", EUR: "€", GBP: "£",
  NGN: "₦", BDT: "৳", IDR: "Rp", VND: "₫", EGP: "E£", MAD: "MAD",
  TRY: "₺", KES: "KSh", ZMW: "ZK", USD: "$", CAD: "C$", AUD: "A$",
  NZD: "NZ$", SGD: "S$", AED: "د.إ", SAR: "﷼", CHF: "CHF",
  HKD: "HK$", JPY: "¥", KRW: "₩", MYR: "RM", ZAR: "R", NPR: "Rs",
  BRL: "R$", THB: "฿", PLN: "zł", RON: "lei", NOK: "kr", SEK: "kr",
  DKK: "kr", CZK: "Kč", HUF: "Ft", ILS: "₪", KWD: "KD", QAR: "QR",
  BHD: "BD", OMR: "RO",
};

const sym = (code: string) => CURRENCY_SYMBOL[code] || code + " ";

function fmt(n: number, dp = 2) {
  return n.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/**
 * Wise/Revolut-style hero converter. Unlike ComparisonWidget (an input form that
 * routes on submit), this computes and shows the live result inline: recipient
 * amount, rate, fee, delivery speed and savings vs the worst provider — the
 * answer is on screen before the user clicks. Reuses /api/quotes (same data the
 * live table below renders) and broadcasts selection to HomeSelectionContext so
 * the section stays in sync.
 */
export default function HeroConverterCard({
  defaultFrom = "USD",
  defaultTo = "INR",
  defaultAmount = 1000,
}: {
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: number;
}) {
  const router = useRouter();

  const validFrom = useCallback((c: string) => sendCurrencies.some((x) => x.code === c), []);
  const validTo = useCallback((c: string) => currencies.some((x) => x.code === c), []);
  const {
    from: fromCurrency,
    to: toCurrency,
    amount: geoAmount,
    loaded: geoLoaded,
    setFrom: setFromCurrency,
    setTo: setToCurrency,
    setAmount: persistAmount,
    setCorridor,
  } = useGeoSelection({
    defaults: { from: defaultFrom, to: defaultTo, amount: defaultAmount },
    isValidFrom: validFrom,
    isValidTo: validTo,
  });

  const [amountStr, setAmountStr] = useState(String(defaultAmount));
  const amount = Number(amountStr) || 0;

  useEffect(() => {
    if (geoLoaded) setAmountStr(String(geoAmount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoLoaded]);

  // Keep the home section in sync (no-op off the home page).
  const homeSelection = useHomeSelection();
  useEffect(() => {
    if (amount > 0) homeSelection.setSelection(fromCurrency, toCurrency, amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency, amount]);

  // Live quotes for the current corridor (debounced on amount typing).
  const [quotes, setQuotes] = useState<TransferQuote[] | null>(null);
  useEffect(() => {
    if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) return;
    const controller = new AbortController();
    const tid = setTimeout(() => {
      fetchQuotes(amount, fromCurrency, toCurrency, controller.signal).then((qs) => {
        if (!controller.signal.aborted) setQuotes(qs);
      });
    }, 220);
    return () => { controller.abort(); clearTimeout(tid); };
  }, [fromCurrency, toCurrency, amount]);

  const best = quotes?.[0];

  const rateLine = useMemo(() => {
    if (!best) return null;
    return `${sym(fromCurrency)}1 = ${sym(toCurrency)}${fmt(best.exchangeRate, best.exchangeRate < 10 ? 4 : 2)}`;
  }, [best, fromCurrency, toCurrency]);

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) return;
    trackCompareSearch(fromCurrency, toCurrency, amount);
    router.push(`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
  }

  function swap() {
    if (validFrom(toCurrency) && validTo(fromCurrency)) setCorridor(toCurrency, fromCurrency);
  }

  const loading = quotes === null;
  const toName = currencies.find((c) => c.code === toCurrency)?.name || toCurrency;

  return (
    <form
      onSubmit={go}
      className="w-full rounded-[24px] bg-[var(--color-surface)] dark:bg-[var(--color-surface-container)] shadow-[var(--shadow-xl)] p-3 sm:p-4 text-left"
    >
      {/* ── One panel: You send / divider / They receive (no swap control) ──
           Light: white card on cream, hairline ring. Dark: a step DOWN to the
           page-black so the field group reads as inset within the lighter card. */}
      <div className="rounded-[18px] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)] dark:ring-0 divide-y divide-[var(--color-outline)]">
        {/* You send */}
        <div className="px-5 pt-4 pb-4">
          <label className="block text-2sm font-medium text-[var(--color-on-surface-variant)] mb-2.5">You send</label>
          <div className="flex items-center justify-between gap-3">
            <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="compact" />
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*\.?\d*$/.test(v)) {
                  setAmountStr(v);
                  const n = Number(v);
                  if (Number.isFinite(n) && n >= MIN_AMOUNT && n <= MAX_AMOUNT) persistAmount(n);
                }
              }}
              onBlur={() => { if (!amountStr || Number(amountStr) <= 0) setAmountStr("1"); }}
              aria-label="Amount to send"
              className="min-w-0 flex-1 bg-transparent text-right text-2xl sm:text-3xl font-bold tabular-nums text-[var(--color-on-surface)] outline-none tracking-tight caret-[var(--color-primary)]"
            />
          </div>
          {/* Live rate — quiet line under the amount */}
          <div className="flex justify-end mt-1.5 h-4">
            <span className="inline-flex items-center gap-1 text-2xs font-medium text-[var(--color-on-surface-muted)] tabular-nums">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${loading ? "bg-[var(--color-on-surface-muted)]" : "bg-[var(--color-success)]"}`} />
              {loading ? "Updating rate…" : rateLine || ""}
            </span>
          </div>
        </div>
        {/* They receive */}
        <div className="px-5 pt-4 pb-4">
          <label className="block text-2sm font-medium text-[var(--color-on-surface-variant)] mb-2.5">They receive</label>
          <div className="flex items-center justify-between gap-3">
            <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="compact" />
            <span className="text-2sm text-[var(--color-on-surface-muted)] truncate">{toName}</span>
          </div>
        </div>
      </div>

      {/* ── Teaser: how many compared, no number given away ── */}
      <div className="flex items-center gap-2.5 px-2 mt-3.5 mb-3">
        <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-2sm text-[var(--color-on-surface-variant)]">
          <span className="font-semibold text-[var(--color-on-surface)]">{loading ? "50+" : `${quotes?.length || 50}`} providers</span> compared live for {fromCurrency} → {toCurrency}
        </p>
      </div>

      {/* ── CTA — sends the user to the full provider list ── */}
      <button
        type="submit"
        className="w-full h-12 rounded-[14px] bg-[var(--color-cta)] text-[var(--color-cta-text)] font-semibold text-sm hover:bg-[var(--color-cta-hover)] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        Compare money transfer apps
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
    </form>
  );
}
