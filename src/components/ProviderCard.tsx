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
  compareSelected?: boolean;
  onCompareToggle?: (slug: string) => void;
  compareDisabled?: boolean;
}

export default function ProviderCard({ quote, sendCurrencySymbol, receiveCurrencySymbol, rank, compareSelected, onCompareToggle, compareDisabled }: Props) {
  const [expanded, setExpanded] = useState(false);
  const provider = providers.find((p) => p.slug === quote.providerSlug);
  const providerName = provider?.name || getProviderName(quote.providerSlug);
  const providerLogo = provider?.logo || `/logos/${quote.providerSlug}.png`;
  const providerWebsite = getGoUrl(quote.providerSlug);

  const feeLabel = quote.fee === 0 ? "Free" : `${sendCurrencySymbol}${quote.fee.toFixed(2)}`;
  const isFast = quote.transferSpeed.toLowerCase().includes("minute") || quote.transferSpeed.toLowerCase().includes("instant");
  const isBest = rank === 1;

  return (
    <div className={`relative transition-all duration-200 ${isBest ? "bg-[var(--color-success-surface-dim)] border-2 border-[var(--color-success-dark)]/20 rounded-2xl -mx-px -mt-px z-[1]" : "bg-white border-b border-[var(--color-outline)] last:border-b-0"} ${expanded ? "" : "hover:bg-[var(--color-surface-dim)]"}`}>
      {/* Best Deal Badge */}
      {isBest && (
        <div className="absolute -top-px left-6 z-10">
          <div className="bg-[var(--color-success-dark)] text-white text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-b-lg shadow-sm">
            Best deal
          </div>
        </div>
      )}

      {/* Main clickable row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(!expanded); } }}
        aria-expanded={expanded}
        className={`group/row w-full text-left px-3 sm:px-6 cursor-pointer ${isBest ? "py-4 sm:py-5 pt-7 sm:pt-8" : "py-3 sm:py-4"}`}
      >
        {/* Mobile layout: 2-row stacked */}
        <div className="flex sm:hidden items-start gap-3">
          {/* Rank */}
          <span className={`text-[12px] font-semibold tabular-nums w-4 text-center mt-1 shrink-0 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
            {rank}
          </span>

          {/* Logo */}
          <div className={`${isBest ? "w-10 h-10" : "w-9 h-9"} rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[13px] font-medium text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50`}>
            <img
              src={providerLogo}
              alt={`${providerName} logo`}
              width={40}
              height={40}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.setAttribute("aria-label", providerName);
                  target.parentElement.textContent = providerName.charAt(0).toUpperCase();
                }
              }}
            />
          </div>

          {/* Provider info + amount */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-[14px] font-medium text-[var(--color-on-surface)] truncate ${isBest ? "text-[15px]" : ""}`}>{providerName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <RatingBadge rating={quote.rating} label={quote.ratingLabel} size="sm" />
                  {isFast && (
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-[var(--color-success)] bg-[var(--color-success-surface)] px-1.5 py-px rounded">
                      Fast
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`tabular-nums font-semibold tracking-tight ${isBest ? "text-[18px] text-[var(--color-success-dark)]" : "text-[16px] text-[var(--color-on-surface)]"}`}>
                  {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            {/* Mobile detail row */}
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
              <span>{quote.transferSpeed}</span>
              <span className="w-px h-3 bg-[var(--color-outline)]" />
              <span className={quote.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : ""}>{feeLabel} fee</span>
              <span className="w-px h-3 bg-[var(--color-outline)]" />
              <span className="tabular-nums">{quote.exchangeRate.toFixed(4)}</span>
            </div>
          </div>

          {/* Expand chevron */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className={`w-4 h-4 text-[var(--color-on-surface-variant)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Desktop layout: single row */}
        <div className="hidden sm:flex items-center gap-5">
          {/* Rank + compare checkbox */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[13px] font-semibold tabular-nums w-5 text-center ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
              {rank}
            </span>
            {onCompareToggle && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onCompareToggle(quote.providerSlug); }}
                disabled={compareDisabled && !compareSelected}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  compareSelected
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                    : compareDisabled
                      ? "border-[var(--color-outline)] opacity-30 cursor-not-allowed"
                      : "border-[var(--color-outline)] hover:border-[var(--color-primary)]"
                }`}
                aria-label={`Compare ${providerName}`}
              >
                {compareSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Provider logo */}
          <div className={`${isBest ? "w-11 h-11" : "w-10 h-10"} rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[14px] font-medium text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50`}>
            <img
              src={providerLogo}
              alt={`${providerName} logo`}
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.setAttribute("aria-label", providerName);
                  target.parentElement.textContent = providerName.charAt(0).toUpperCase();
                }
              }}
            />
          </div>

          {/* Provider info */}
          <div className="min-w-[140px] shrink-0">
            <div className="flex items-center gap-2">
              <p className={`text-[14px] font-medium text-[var(--color-on-surface)] ${isBest ? "text-[15px]" : ""}`}>{providerName}</p>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingBadge rating={quote.rating} label={quote.ratingLabel} size="sm" />
              {isFast && (
                <span className="text-[10px] font-semibold tracking-wide uppercase text-[var(--color-success)] bg-[var(--color-success-surface)] px-1.5 py-px rounded">
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
              <p className={`text-[13px] mt-0.5 ${quote.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
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
            <p className={`tabular-nums font-semibold tracking-tight ${isBest ? "text-[22px] sm:text-[24px] text-[var(--color-success-dark)]" : "text-[18px] sm:text-[20px] text-[var(--color-on-surface)]"}`}>
              {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">Recipient gets</p>
          </div>

          {/* Expand chevron */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover/row:bg-[var(--color-surface-container)] transition-colors">
            <svg
              className={`w-5 h-5 text-[var(--color-on-surface-variant)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded details panel — with smooth animation */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className={`mx-5 sm:mx-6 mb-5 border border-[var(--color-outline)] rounded-2xl overflow-hidden ${isBest ? "border-[var(--color-success-dark)]/20" : ""}`}>
            {/* Detail grid — border-r + border-b per cell for correct 2-col and 4-col rendering */}
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-[var(--color-surface-dim)]">
              <div className="px-4 py-3 border-r border-b sm:border-b-0 border-[var(--color-outline)]">
                <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Exchange rate</p>
                <p className="text-[15px] font-medium text-[var(--color-on-surface)] mt-1 tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
              </div>
              <div className="px-4 py-3 sm:border-r border-b sm:border-b-0 border-[var(--color-outline)]">
                <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Transfer fee</p>
                <p className={`text-[15px] font-medium mt-1 ${quote.fee === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>{feeLabel}</p>
              </div>
              <div className="px-4 py-3 border-r border-[var(--color-outline)]">
                <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Delivery</p>
                <p className="text-[15px] font-medium text-[var(--color-on-surface)] mt-1">{quote.transferSpeed}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Recipient gets</p>
                <p className={`text-[15px] font-semibold mt-1 tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                  {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Transfer flow + CTA */}
            <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
              {/* Transfer summary */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[13px] text-[var(--color-on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                  <span>Send {sendCurrencySymbol}{quote.sendAmount.toLocaleString()} {quote.sendCurrency}</span>
                </div>
                <svg className="w-4 h-4 text-[var(--color-outline)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isBest ? "bg-[var(--color-success-dark)]" : "bg-[var(--color-on-surface-variant)]"}`} />
                  <span className={isBest ? "text-[var(--color-success-dark)] font-medium" : ""}>
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
                      ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)] shadow-sm hover:shadow"
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
        </div>
      </div>
    </div>
  );
}
