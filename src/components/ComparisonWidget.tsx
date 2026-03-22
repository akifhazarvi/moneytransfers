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
  const [amount, setAmount] = useState(defaultAmount);
  const [amountError, setAmountError] = useState("");
  const id = useId();
  const t = useTranslations("comparisonWidget");

  function validateAmount(value: number): string {
    if (!Number.isFinite(value) || value < MIN_AMOUNT) return `Minimum amount is ${MIN_AMOUNT}`;
    if (value > MAX_AMOUNT) return `Maximum amount is ${MAX_AMOUNT.toLocaleString()}`;
    return "";
  }

  function handleAmountChange(raw: string) {
    const value = Number(raw);
    setAmount(value);
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
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step="any"
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

  return (
    <form onSubmit={handleCompare}>
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="flex-1 border-b md:border-b-0 md:border-r border-[var(--color-outline)] px-4 py-2.5">
            <label htmlFor={`${id}-send`} className="text-2xs text-[var(--color-on-surface-variant)] font-medium">{t("youSend")}</label>
            <input
              id={`${id}-send`}
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step="any"
              className={`w-full bg-transparent text-base text-[var(--color-on-surface)] focus:outline-none mt-0.5 ${amountError ? "text-[var(--color-error)]" : ""}`}
              placeholder="1,000"
              aria-describedby={amountError ? `${id}-send-error` : undefined}
            />
            {amountError && (
              <p id={`${id}-send-error`} className="text-2xs text-[var(--color-error)] mt-0.5">{amountError}</p>
            )}
          </div>

          <div className="flex-1 border-b md:border-b-0 md:border-r border-[var(--color-outline)] px-4 py-2.5">
            <p className="text-2xs text-[var(--color-on-surface-variant)] font-medium">{t("from")}</p>
            <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="inline" />
          </div>

          {/* Swap button — visible on all screen sizes */}
          <div className="flex items-center justify-center px-3 py-2 md:py-0 border-b md:border-b-0 border-[var(--color-outline)]">
            <button
              type="button"
              onClick={swap}
              className="w-10 h-10 rounded-full border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-container)] hover:border-[var(--color-on-surface-variant)] active:scale-95 transition-all"
              aria-label={t("swapCurrencies")}
            >
              {/* Vertical arrows on mobile, horizontal on desktop */}
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div className="flex-1 border-b md:border-b-0 md:border-l border-[var(--color-outline)] px-4 py-2.5">
            <p className="text-2xs text-[var(--color-on-surface-variant)] font-medium">{t("to")}</p>
            <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="inline" />
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
