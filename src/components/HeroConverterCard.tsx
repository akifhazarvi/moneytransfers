"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CurrencyPicker from "@/components/CurrencyPicker";
import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import { type TransferQuote } from "@/data/providers";
import { fetchQuotes } from "@/lib/fetch-quotes";
import { useHomeSelection } from "@/components/HomeSelectionContext";
import { useGeoSelection } from "@/lib/useGeoSelection";
import { trackCompareSearch } from "@/lib/analytics";
import { rememberSearch } from "@/lib/last-search";

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
  } = useGeoSelection({
    defaults: { from: defaultFrom, to: defaultTo, amount: defaultAmount },
    isValidFrom: validFrom,
    isValidTo: validTo,
  });

  const [amountStr, setAmountStr] = useState(String(defaultAmount));
  const amount = Number(amountStr) || 0;
  const [amountError, setAmountError] = useState(false);

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
    // An out-of-range amount has nothing to quote. Saying so is left to blur and
    // submit: raising it here flashed the error at every keystroke through "".
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

  // A pair or amount the visitor set here, with its result on screen, is a
  // search worth offering back. Its payout is left out: this card prices at
  // the build-time rate, /send-money and the offer at the live one.
  const chosen = useRef(false);
  const choose = <T,>(set: (value: T) => void) => (value: T) => {
    chosen.current = true;
    set(value);
  };
  useEffect(() => {
    if (!chosen.current || !best) return;
    if (best.sendCurrency !== fromCurrency || best.receiveCurrency !== toCurrency || best.sendAmount !== amount) return;
    rememberSearch({ from: fromCurrency, to: toCurrency, amount, kind: "search" });
  }, [best, fromCurrency, toCurrency, amount]);

  const rateLine = useMemo(() => {
    if (!best) return null;
    return `${sym(fromCurrency)}1 = ${sym(toCurrency)}${fmt(best.exchangeRate, best.exchangeRate < 10 ? 4 : 2)}`;
  }, [best, fromCurrency, toCurrency]);

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
      setAmountError(true);
      return;
    }
    trackCompareSearch(fromCurrency, toCurrency, amount);
    router.push(`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
  }

  const loading = quotes === null;
  const toName = currencies.find((c) => c.code === toCurrency)?.name || toCurrency;

  return (
    <form
      onSubmit={go}
      aria-label="Compare your transfer"
      data-smc-corridor={`${fromCurrency}-${toCurrency}`}
      className="home-comparison-form w-full rounded-[24px] bg-[var(--color-surface)] dark:bg-[var(--color-surface-container)] shadow-[var(--shadow-xl)] p-3 sm:p-4 text-left"
    >
      {/* ── One panel: You send / divider / They receive (no swap control) ──
           Light: white card on cream, hairline ring. Dark: a step DOWN to the
           page-black so the field group reads as inset within the lighter card. */}
      <div className="rounded-[18px] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)] dark:ring-0 divide-y divide-[var(--color-outline)]">
        {/* You send */}
        <div className="px-5 pt-4 pb-4">
          <label htmlFor="home-send-amount" className="block text-2sm font-medium text-[var(--color-on-surface-variant)] mb-2.5">You send</label>
          <div className="flex items-center justify-between gap-3">
            <CurrencyPicker value={fromCurrency} onChange={choose(setFromCurrency)} currencyList={sendCurrencies} size="compact" />
            <input
              aria-invalid={amountError || undefined}
              aria-describedby={amountError ? "home-amount-error" : undefined}
              id="home-send-amount"
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*\.?\d*$/.test(v)) {
                  chosen.current = true;
                  setAmountError(false);
                  setAmountStr(v);
                  const n = Number(v);
                  if (Number.isFinite(n) && n >= MIN_AMOUNT && n <= MAX_AMOUNT) persistAmount(n);
                }
              }}
              // Say why it can't be compared; never rewrite it. This used to set
              // "0" or "" to "1" on blur — and clicking Compare blurs the field
              // first, so submit saw a valid 1 and sent a $1 comparison.
              onBlur={() => { if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) setAmountError(true); }}
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
          <label className="block text-2sm font-medium text-[var(--color-on-surface-variant)] mb-2.5">Recipient gets · estimated</label>
          <div className="home-receive-row flex items-center justify-between gap-3">
            <CurrencyPicker value={toCurrency} onChange={choose(setToCurrency)} size="compact" />
            {best ? (
              <span className="home-receive-value text-2xl sm:text-3xl font-bold tabular-nums text-[var(--color-on-surface)] tracking-tight">
                {fmt(best.receiveAmount, best.receiveAmount < 100 ? 2 : 0)}
              </span>
            ) : (
              <span className="text-2sm text-[var(--color-on-surface-muted)] truncate">{loading ? "…" : toName}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Teaser: how many compared, no number given away ── */}
      <div className="flex items-center gap-2.5 px-2 mt-3.5 mb-3">
        <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {/*
          The count is asserted only once it is known.

          This used to render "50+" while loading and fall back to `|| 50` when
          the fetch returned nothing — so the server HTML said "50+ providers
          compared live for USD → INR" on a corridor where 22 were quoting, and
          any failed fetch silently published a made-up 50. Most AI crawlers do
          not execute JS, so "50+" was the figure they ingested, and the
          homepage is the site's only indexed page.
        */}
        <p className="text-2sm text-[var(--color-on-surface-variant)]">
          {quotes?.length ? (
            <>
              <span className="font-semibold text-[var(--color-on-surface)]">
                {quotes.length} providers
              </span>{" "}
              compared live for {fromCurrency} → {toCurrency}
            </>
          ) : (
            <>
              Comparing live rates for {fromCurrency} → {toCurrency}
            </>
          )}
        </p>
      </div>

      {amountError && <p id="home-amount-error" role="alert" className="home-amount-error">Enter an amount between 1 and 1,000,000 {fromCurrency}.</p>}

      {/* ── CTA — sends the user to the full provider list ── */}
      <button
        type="submit"
        className="conversion-button conversion-button--accent w-full"
      >
        Compare transfers
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
      <p className="home-quote-note">Estimated amounts. Confirm the final quote with your provider.</p>
    </form>
  );
}
