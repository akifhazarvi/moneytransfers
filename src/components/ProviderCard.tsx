"use client";

import { useState } from "react";
import Link from "next/link";
import { providers, getProviderName, type TransferQuote } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import RatingBadge from "./RatingBadge";

interface Props {
  quote: TransferQuote;
  sendCurrencySymbol: string;
  receiveCurrencySymbol: string;
  rank: number;
}

export default function ProviderCard({ quote, sendCurrencySymbol, receiveCurrencySymbol, rank }: Props) {
  const [expanded, setExpanded] = useState(false);
  const provider = providers.find((p) => p.slug === quote.providerSlug);
  const providerName = provider?.name || getProviderName(quote.providerSlug);
  const providerLogo = provider?.logo || `/logos/${quote.providerSlug}.png`;
  const providerWebsite = getGoUrl(quote.providerSlug);

  const feeLabel = quote.fee === 0 ? "Free" : `${sendCurrencySymbol}${quote.fee.toFixed(2)}`;
  const isFast = quote.transferSpeed.toLowerCase().includes("minute") || quote.transferSpeed.toLowerCase().includes("instant");
  const isBest = rank === 1;

  return (
    <div className={`relative bg-white transition-all duration-200 ${isBest ? "ring-2 ring-[#137333]/20 rounded-xl" : "border-b border-[var(--color-outline)] last:border-b-0"} ${expanded ? "" : "hover:bg-[#f8fafb]"}`}>
      {/* Best Deal Badge */}
      {isBest && (
        <div className="absolute -top-px left-6 z-10">
          <div className="bg-[#137333] text-white text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-b-lg shadow-sm">
            Best deal
          </div>
        </div>
      )}

      {/* Main clickable row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left px-5 sm:px-6 flex items-center gap-4 sm:gap-5 cursor-pointer ${isBest ? "py-5 pt-8" : "py-4"}`}
      >
        {/* Rank number */}
        <span className={`text-[13px] font-semibold tabular-nums w-5 text-center shrink-0 ${isBest ? "text-[#137333]" : "text-[var(--color-on-surface-variant)]"}`}>
          {rank}
        </span>

        {/* Provider logo */}
        <div className={`${isBest ? "w-11 h-11" : "w-10 h-10"} rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[14px] font-medium text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50`}>
          <img
            src={providerLogo}
            alt={providerName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              target.parentElement!.textContent = providerName.charAt(0).toUpperCase();
            }}
          />
        </div>

        {/* Provider info */}
        <div className="min-w-[120px] sm:min-w-[140px] shrink-0">
          <div className="flex items-center gap-2">
            <p className={`text-[14px] font-medium text-[var(--color-on-surface)] ${isBest ? "text-[15px]" : ""}`}>{providerName}</p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <RatingBadge rating={quote.rating} label={quote.ratingLabel} size="sm" />
            {isFast && (
              <span className="text-[10px] font-semibold tracking-wide uppercase text-[var(--color-success)] bg-[#e6f4ea] px-1.5 py-px rounded">
                Fast
              </span>
            )}
          </div>
        </div>

        {/* Transfer details — desktop */}
        <div className="hidden md:flex items-center gap-6 flex-1 min-w-0">
          {/* Speed */}
          <div className="w-[110px] shrink-0">
            <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Speed</p>
            <p className="text-[13px] text-[var(--color-on-surface)] mt-0.5">{quote.transferSpeed}</p>
          </div>

          {/* Fee */}
          <div className="w-[80px] shrink-0">
            <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Fee</p>
            <p className={`text-[13px] mt-0.5 ${quote.fee === 0 ? "text-[#137333] font-medium" : "text-[var(--color-on-surface)]"}`}>
              {feeLabel}
            </p>
          </div>

          {/* Rate */}
          <div className="w-[90px] shrink-0">
            <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Rate</p>
            <p className="text-[13px] text-[var(--color-on-surface)] mt-0.5 tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Hero receive amount */}
        <div className="text-right shrink-0 mr-1">
          <p className={`tabular-nums font-semibold tracking-tight ${isBest ? "text-[22px] sm:text-[24px] text-[#137333]" : "text-[18px] sm:text-[20px] text-[var(--color-on-surface)]"}`}>
            {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">Recipient gets</p>
        </div>

        {/* Expand chevron */}
        <svg
          className={`w-5 h-5 text-[var(--color-on-surface-variant)] transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details panel */}
      {expanded && (
        <div className={`mx-5 sm:mx-6 mb-5 border border-[var(--color-outline)] rounded-xl overflow-hidden ${isBest ? "border-[#137333]/20" : ""}`}>
          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--color-outline)] bg-[var(--color-surface-dim)]">
            <div className="px-4 py-3">
              <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Exchange rate</p>
              <p className="text-[15px] font-medium text-[var(--color-on-surface)] mt-1 tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Transfer fee</p>
              <p className={`text-[15px] font-medium mt-1 ${quote.fee === 0 ? "text-[#137333]" : "text-[var(--color-on-surface)]"}`}>{feeLabel}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Delivery</p>
              <p className="text-[15px] font-medium text-[var(--color-on-surface)] mt-1">{quote.transferSpeed}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Recipient gets</p>
              <p className={`text-[15px] font-semibold mt-1 tabular-nums ${isBest ? "text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Transfer flow + CTA */}
          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            {/* Transfer summary */}
            <div className="flex items-center gap-3 text-[13px] text-[var(--color-on-surface-variant)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                <span>Send {sendCurrencySymbol}{quote.sendAmount.toLocaleString()} {quote.sendCurrency}</span>
              </div>
              <svg className="w-4 h-4 text-[var(--color-outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isBest ? "bg-[#137333]" : "bg-[var(--color-on-surface-variant)]"}`} />
                <span className={isBest ? "text-[#137333] font-medium" : ""}>
                  Receive {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quote.receiveCurrency}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {provider && (
                <Link
                  href={`/companies/${provider.slug}`}
                  className="text-[13px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  Full review
                </Link>
              )}
              <a
                href={providerWebsite}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`inline-flex items-center gap-2 h-10 px-6 text-[13px] font-semibold rounded-full transition-all duration-150 ${
                  isBest
                    ? "bg-[#137333] text-white hover:bg-[#0d5c28] shadow-sm hover:shadow"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow"
                }`}
              >
                Send with {providerName}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Payment methods */}
          {provider && provider.paymentMethods.length > 0 && (
            <div className="px-5 py-3 border-t border-[var(--color-outline)] bg-[var(--color-surface-dim)]/50 flex items-center gap-4 text-[12px] text-[var(--color-on-surface-variant)]">
              <span className="font-medium">Pays with:</span>
              <div className="flex flex-wrap gap-2">
                {provider.paymentMethods.slice(0, 4).map((method) => (
                  <span key={method} className="bg-white border border-[var(--color-outline)] rounded-full px-2.5 py-0.5">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
