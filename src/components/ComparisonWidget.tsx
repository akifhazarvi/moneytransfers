"use client";

import { useState, useId, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import CurrencyPicker from "@/components/CurrencyPicker";
import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import { trackCompareSearch } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useHomeSelection } from "@/components/HomeSelectionContext";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1_000_000;

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
  const [amountStr, setAmountStr] = useState(String(defaultAmount));
  const amount = Number(amountStr) || 0;
  const [amountError, setAmountError] = useState("");

  // On mount: hydrate from geo cookies set by middleware.
  // Only runs once; user's manual changes are not overridden.
  useEffect(() => {
    function readCookie(name: string) {
      return (document.cookie.match(`(?:^|; )${name}=([^;]*)`) || [])[1];
    }
    const geoCurrency = readCookie("geo-currency");
    const geoDefaultTo = readCookie("geo-default-to");
    const geoDefaultAmount = readCookie("geo-default-amount");

    // Validate that the geo-detected currency is in our send currencies list
    const validFrom = geoCurrency && sendCurrencies.some((c) => c.code === geoCurrency);
    const validTo   = geoDefaultTo && currencies.some((c) => c.code === geoDefaultTo);

    if (validFrom) setFromCurrency(geoCurrency!);
    if (validTo)   setToCurrency(geoDefaultTo!);
    if (geoDefaultAmount) {
      const parsed = parseInt(geoDefaultAmount, 10);
      if (Number.isFinite(parsed) && parsed >= MIN_AMOUNT && parsed <= MAX_AMOUNT) {
        setAmountStr(String(parsed));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Broadcast changes to HomeSelectionContext (no-op outside home page)
  const homeSelection = useHomeSelection();
  useEffect(() => {
    if (amount > 0) homeSelection.setSelection(fromCurrency, toCurrency, amount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency, amount]);
  const id = useId();
  const t = useTranslations("comparisonWidget");

  function validateAmount(value: number): string {
    if (!Number.isFinite(value) || value < MIN_AMOUNT) return `Minimum amount is ${MIN_AMOUNT}`;
    if (value > MAX_AMOUNT) return `Maximum amount is ${MAX_AMOUNT.toLocaleString()}`;
    return "";
  }

  function handleAmountChange(raw: string) {
    setAmountStr(raw);
    const value = Number(raw);
    setAmountError(validateAmount(value));
  }

  function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    const err = validateAmount(amount);
    if (err) {
      setAmountError(err);
      return;
    }
    trackCompareSearch(fromCurrency, toCurrency, amount);
    router.push(`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
  }

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  if (compact) {
    const inputClass =
      "w-full h-12 border border-[var(--color-outline)] rounded-lg px-4 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors";
    return (
      <form onSubmit={handleCompare}>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor={`${id}-amount`} className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">{t("youSend")}</label>
            <input
              id={`${id}-amount`}
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*\.?\d*$/.test(v)) handleAmountChange(v);
              }}
              onBlur={() => {
                if (!amountStr || Number(amountStr) <= 0) setAmountStr("1");
              }}
              className={`${inputClass} ${amountError ? "border-[var(--color-error)]" : ""}`}
              placeholder="1,000"
              aria-describedby={amountError ? `${id}-amount-error` : undefined}
            />
            {amountError && (
              <p id={`${id}-amount-error`} className="text-2xs text-[var(--color-error)] mt-1">{amountError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">{t("from")}</label>
            <div className="h-12 border border-[var(--color-outline)] rounded-lg px-4 flex items-center bg-[var(--color-surface)]">
              <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="compact" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5">{t("to")}</label>
            <div className="h-12 border border-[var(--color-outline)] rounded-lg px-4 flex items-center bg-[var(--color-surface)]">
              <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="compact" />
            </div>
          </div>
          <button type="submit" className="w-full h-12 bg-[var(--color-primary)] text-white rounded-full font-medium text-sm hover:bg-[var(--color-primary-dark)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.2)] active:shadow-none transition-all">
            {t("compareTransfers")}
          </button>
        </div>
      </form>
    );
  }

  const sendCurrency = sendCurrencies.find((c) => c.code === fromCurrency);

  return (
    <form onSubmit={handleCompare}>
      {/* ── MOBILE: Google-Flights pill — From | swap | To, then amount, then full-width CTA ── */}
      <div className="lg:hidden">
        <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[0_1px_6px_rgba(32,33,36,0.08)] overflow-hidden">
          <div className="flex items-stretch">
            <div className="flex-1 min-w-0 px-4 py-3">
              <span className="block text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("from")}</span>
              <div className="mt-0.5">
                <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="compact" />
              </div>
            </div>
            <div className="flex items-center px-1">
              <button
                type="button"
                onClick={swap}
                className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center active:scale-95 transition-all shadow-sm"
                aria-label={t("swapCurrencies")}
              >
                <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-w-0 px-4 py-3 border-l border-[var(--color-outline)]">
              <span className="block text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("to")}</span>
              <div className="mt-0.5">
                <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="compact" />
              </div>
            </div>
          </div>
          <div className="border-t border-[var(--color-outline)] px-4 py-3 flex items-center gap-3">
            <label htmlFor={`${id}-send-m`} className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider shrink-0">{t("youSend")}</label>
            <div className="flex items-baseline gap-1 ml-auto">
              <span className="text-h4 font-medium text-[var(--color-on-surface)]">{sendCurrency?.symbol || "$"}</span>
              <input
                id={`${id}-send-m`}
                type="text"
                inputMode="decimal"
                value={amountStr}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d*\.?\d*$/.test(v)) handleAmountChange(v);
                }}
                onBlur={() => {
                  if (!amountStr || Number(amountStr) <= 0) setAmountStr("1");
                }}
                className={`bg-transparent text-h4 font-semibold text-[var(--color-on-surface)] focus:outline-none w-[150px] text-right tabular-nums ${amountError ? "text-[var(--color-error)]" : ""}`}
                placeholder="1,000"
                aria-describedby={amountError ? `${id}-send-m-error` : undefined}
              />
            </div>
          </div>
          {amountError && (
            <p id={`${id}-send-m-error`} className="px-4 pb-2 text-2xs text-[var(--color-error)]">{amountError}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-3 w-full h-12 bg-[var(--color-primary)] text-white rounded-full font-semibold text-sm hover:bg-[var(--color-primary-dark)] active:scale-[0.99] transition-all shadow-[0_2px_8px_rgba(26,115,232,0.25)]"
        >
          {t("compareTransfers")}
        </button>
      </div>

      {/* ── DESKTOP: existing two-half pill (unchanged) ── */}
      <div className="hidden lg:block rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[0_1px_6px_rgba(32,33,36,0.1)] hover:shadow-[0_2px_12px_rgba(32,33,36,0.16)] transition-shadow">
        <div className="flex flex-row items-stretch">
          {/* You-send pill — right padding leaves a 40px void for the absolutely
              positioned swap button to sit on the divider without overlapping
              the amount input. */}
          <div className="flex-1 border-r border-[var(--color-outline)] pl-5 pr-16 py-4 min-w-0">
            <label htmlFor={`${id}-send`} className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("youSend")}</label>
            <div className="flex items-center gap-4 mt-1.5">
              <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="large" />
              <div className="flex items-baseline gap-1 shrink-0 ml-auto border-l border-[var(--color-outline)] pl-4">
                <span className="text-h4 font-medium text-[var(--color-on-surface)]">{sendCurrency?.symbol || "$"}</span>
                <input
                  id={`${id}-send`}
                  type="text"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^\d*\.?\d*$/.test(v)) handleAmountChange(v);
                  }}
                  onBlur={() => {
                    if (!amountStr || Number(amountStr) <= 0) setAmountStr("1");
                  }}
                  className={`bg-transparent text-h4 font-medium text-[var(--color-on-surface)] focus:outline-none min-w-0 w-[120px] tabular-nums ${amountError ? "text-[var(--color-error)]" : ""}`}
                  placeholder="1,000"
                  aria-describedby={amountError ? `${id}-send-error` : undefined}
                />
              </div>
            </div>
            {amountError && (
              <p id={`${id}-send-error`} className="text-2xs text-[var(--color-error)] mt-1">{amountError}</p>
            )}
          </div>

          {/* Absolutely positioned swap button — centered on the divider.
              Was previously inline with -mx-5 which made the layout reserve
              space inconsistently and caused the amount input to render
              under the button. Absolute positioning + 40px pr-16 reservation
              guarantees no overlap regardless of input content width. */}
          <div className="relative w-0 flex items-center justify-center">
            <button
              type="button"
              onClick={swap}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] active:scale-95 transition-all shadow-sm z-10"
              aria-label={t("swapCurrencies")}
            >
              <svg className="w-[18px] h-[18px] text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div className="flex-1 pl-12 pr-5 py-4 min-w-0">
            <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("to")}</p>
            <div className="mt-1.5">
              <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="large" />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex justify-center mt-6">
        <button
          type="submit"
          className="h-12 bg-[var(--color-primary)] text-white rounded-full font-medium text-md px-10 hover:bg-[var(--color-primary-dark)] hover:shadow-[0_2px_8px_rgba(26,115,232,0.3)] active:shadow-none transition-all"
        >
          {t("compareTransfers")}
        </button>
      </div>
    </form>
  );
}
