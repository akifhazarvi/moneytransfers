"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import CurrencyPicker from "@/components/CurrencyPicker";
import CircleFlag from "@/components/CircleFlag";
import { currencies } from "@/data/transfer-currencies";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { getRate } from "@/lib/rates-util";

export default function HomepageConverter() {
  const t = useTranslations("homepageConverter");
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [converted, setConverted] = useState<number | null>(null);
  const { rates, isLive } = useExchangeRates();

  const rate = getRate(rates, from, to);
  const toInfo = currencies.find((c) => c.code === to);
  const fromInfo = currencies.find((c) => c.code === from);

  const handleConvert = useCallback(() => {
    setConverted(amount * rate);
  }, [amount, rate]);

  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
    setConverted(null);
  }, [from, to]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[0_1px_6px_rgba(32,33,36,0.12)] overflow-hidden">

        {/* Amount Row */}
        <div className="px-5 sm:px-6 pt-5 pb-4">
          <label htmlFor="hp-amount" className="text-[12px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">
            {t("amount")}
          </label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[28px] sm:text-[32px] font-medium text-[var(--color-on-surface)]">
              {fromInfo?.symbol || "$"}
            </span>
            <input
              id="hp-amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setConverted(null);
              }}
              min={0}
              className="text-[28px] sm:text-[32px] font-medium text-[var(--color-on-surface)] bg-transparent border-none focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="h-px bg-[var(--color-outline)]" />

        {/* From / Swap / To Row */}
        <div className="px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            {/* From */}
            <div className="flex-1">
              <span className="text-[12px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("from")}</span>
              <div className="mt-1">
                <CurrencyPicker
                  value={from}
                  onChange={(code) => { setFrom(code); setConverted(null); }}
                  label={t("fromCurrency")}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] hover:border-[var(--color-primary)] transition-colors shrink-0 mt-5"
              aria-label={t("swapCurrencies")}
            >
              <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            {/* To */}
            <div className="flex-1">
              <span className="text-[12px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("to")}</span>
              <div className="mt-1">
                <CurrencyPicker
                  value={to}
                  onChange={(code) => { setTo(code); setConverted(null); }}
                  label={t("toCurrency")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rate info */}
        <div className="px-5 sm:px-6 pb-3">
          <div className="flex items-center gap-2 text-[13px] text-[var(--color-on-surface-variant)]">
            <CircleFlag code={from} size={16} />
            <span>1 {from} = {rate.toFixed(4)} {to}</span>
            <CircleFlag code={to} size={16} />
            {isLive && (
              <span className="inline-flex items-center gap-1 ml-auto text-[11px] text-[var(--color-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                {t("live")}
              </span>
            )}
          </div>
        </div>

        {/* Result */}
        {converted !== null && (
          <>
            <div className="h-px bg-[var(--color-outline)]" />
            <div className="px-5 sm:px-6 py-4 bg-[var(--color-surface-dim)]">
              <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-1">
                {fromInfo?.symbol || ""}{amount.toLocaleString()} {from} =
              </p>
              <p className="text-[28px] sm:text-[32px] font-semibold text-[var(--color-on-surface)]">
                {toInfo?.symbol || ""}{converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
              </p>
              <div className="flex gap-3 mt-3">
                <Link
                  href={`/send-money?from=${from}&to=${to}&amount=${amount}`}
                  className="text-[13px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  {t("compareTransferProviders")} &rarr;
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Convert Button */}
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/currency-converter"
            className="text-[13px] text-[var(--color-primary)] hover:underline"
          >
            {t("advancedConverter")}
          </Link>
          <button
            onClick={handleConvert}
            className="px-8 py-3 bg-[var(--color-primary)] text-white text-[15px] font-medium rounded-full hover:bg-[var(--color-primary-dark,#1557b0)] transition-colors shadow-[0_1px_3px_rgba(26,115,232,0.3)]"
          >
            {t("convert")}
          </button>
        </div>
      </div>
    </div>
  );
}
