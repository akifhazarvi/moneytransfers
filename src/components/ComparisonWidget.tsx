"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import CurrencyPicker from "@/components/CurrencyPicker";
import { sendCurrencies } from "@/data/transfer-currencies";
import { trackCompareSearch } from "@/lib/analytics";
import { useTranslations } from "next-intl";

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
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[0_1px_6px_rgba(32,33,36,0.1)] hover:shadow-[0_2px_12px_rgba(32,33,36,0.16)] transition-shadow">
        <div className="flex flex-col lg:flex-row">
          {/* You send — currency + amount */}
          <div className="flex-1 border-b lg:border-b-0 lg:border-r border-[var(--color-outline)] px-3 sm:px-5 lg:pr-8 py-2.5 sm:py-4 min-w-0">
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
                  className={`bg-transparent text-h4 font-medium text-[var(--color-on-surface)] focus:outline-none min-w-0 w-[100px] tabular-nums ${amountError ? "text-[var(--color-error)]" : ""}`}
                  placeholder="1,000"
                  aria-describedby={amountError ? `${id}-send-error` : undefined}
                />
              </div>
            </div>
            {amountError && (
              <p id={`${id}-send-error`} className="text-2xs text-[var(--color-error)] mt-1">{amountError}</p>
            )}
          </div>

          {/* Swap button — desktop */}
          <div className="hidden lg:flex items-center -mx-5 z-10">
            <button
              type="button"
              onClick={swap}
              className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] active:scale-95 transition-all shadow-sm"
              aria-label={t("swapCurrencies")}
            >
              <svg className="w-[18px] h-[18px] text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* Swap button — mobile */}
          <div className="flex lg:hidden items-center justify-center -my-3 z-10">
            <button
              type="button"
              onClick={swap}
              className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] active:scale-95 transition-all shadow-sm"
              aria-label={t("swapCurrencies")}
            >
              <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* They receive in */}
          <div className="flex-1 px-3 sm:px-5 lg:pl-8 py-2.5 sm:py-4 min-w-0">
            <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("to")}</p>
            <div className="mt-1.5">
              <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="large" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 sm:mt-6">
        <button
          type="submit"
          className="h-11 sm:h-12 bg-[var(--color-primary)] text-white rounded-full font-medium text-sm sm:text-md px-8 sm:px-10 hover:bg-[var(--color-primary-dark)] hover:shadow-[0_2px_8px_rgba(26,115,232,0.3)] active:shadow-none transition-all w-full sm:w-auto"
        >
          {t("compareTransfers")}
        </button>
      </div>
    </form>
  );
}
