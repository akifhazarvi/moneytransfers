"use client";

import { useState } from "react";
import Link from "next/link";
import { providers, getProviderName, type TransferQuote } from "@/data/providers";
import RatingBadge from "./RatingBadge";

interface Props {
  quote: TransferQuote;
  sendCurrencySymbol: string;
  receiveCurrencySymbol: string;
  rank: number;
}

export default function ProviderCard({ quote, sendCurrencySymbol, receiveCurrencySymbol }: Props) {
  const [expanded, setExpanded] = useState(false);
  const provider = providers.find((p) => p.slug === quote.providerSlug);
  const providerName = provider?.name || getProviderName(quote.providerSlug);
  const providerLogo = provider?.logo || `/logos/${quote.providerSlug}.png`;
  const providerWebsite = provider?.website || `https://${quote.providerSlug.replace(/-/g, "")}.com`;

  const feeLabel = quote.fee === 0 ? "Free" : `${sendCurrencySymbol}${quote.fee.toFixed(2)}`;
  const isFast = quote.transferSpeed.includes("Minute") || quote.transferSpeed.includes("Instant");

  return (
    <div className="bg-white border-b border-[var(--color-outline)] last:border-b-0 hover:bg-[var(--color-surface-dim)] transition-colors">
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-6 py-4 flex items-center cursor-pointer"
      >
        {/* Provider logo */}
        <div className="w-10 h-10 rounded-full overflow-hidden mr-6 shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[14px] font-medium text-[var(--color-on-surface-variant)]">
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

        {/* Provider name + speed */}
        <div className="w-[160px] shrink-0 mr-4">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{providerName}</p>
            {isFast && (
              <span className="text-[11px] text-[var(--color-success)] border border-[var(--color-success)] rounded px-1.5 py-0 leading-[18px]">
                Fast
              </span>
            )}
          </div>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">{providerName}</p>
        </div>

        {/* Transfer speed */}
        <div className="w-[120px] shrink-0 mr-4 hidden md:block">
          <p className="text-[14px] text-[var(--color-on-surface)]">{quote.transferSpeed}</p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">
            {quote.sendCurrency}–{quote.receiveCurrency}
          </p>
        </div>

        {/* Fee */}
        <div className="w-[80px] shrink-0 mr-4 hidden sm:block">
          <p className="text-[14px] text-[var(--color-on-surface)]">
            {quote.fee === 0 ? "No fee" : feeLabel}
          </p>
        </div>

        {/* Rating */}
        <div className="w-[120px] shrink-0 mr-4 hidden lg:block">
          <p className="text-[14px] text-[var(--color-on-surface)]">Rate: {quote.exchangeRate}</p>
          <RatingBadge rating={quote.rating} label={quote.ratingLabel} />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Amount */}
        <div className="text-right shrink-0 mr-3">
          <p className="text-[16px] text-[var(--color-primary)] font-medium">
            {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">Recipient gets</p>
        </div>

        {/* Expand chevron */}
        <svg
          className={`w-6 h-6 text-[var(--color-on-surface-variant)] transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="mx-6 mb-4 border border-[var(--color-outline)] rounded-xl bg-white overflow-hidden">
          {/* Provider header in expanded */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--color-outline)] bg-[var(--color-surface-dim)]">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface-container)] flex items-center justify-center text-[16px] font-medium text-[var(--color-on-surface-variant)]">
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
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{providerName}</p>
              <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                Transfer · {quote.transferSpeed}
              </p>
            </div>
            <div className="text-right">
              <RatingBadge rating={quote.rating} label={quote.ratingLabel} size="md" />
            </div>
            <a
              href={providerWebsite}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium px-4 h-9 flex items-center rounded-full hover:bg-[var(--color-primary-surface)] transition-colors"
            >
              Select provider
            </a>
            <p className="text-[16px] text-[var(--color-on-surface)] font-medium">
              {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Transfer details */}
          <div className="px-6 py-5 flex gap-12">
            {/* Left: Transfer timeline */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full border-2 border-[var(--color-on-surface-variant)]" />
                <div className="w-0.5 flex-1 bg-[var(--color-on-surface-variant)] my-1" />
                <div className="w-3 h-3 rounded-full border-2 border-[var(--color-on-surface-variant)]" />
              </div>
              <div>
                <p className="text-[14px] text-[var(--color-on-surface)]">
                  Send {sendCurrencySymbol}{quote.sendAmount.toLocaleString()} {quote.sendCurrency}
                </p>
                <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-0.5 mb-3">
                  Transfer time: {quote.transferSpeed}
                </p>
                <p className="text-[14px] text-[var(--color-on-surface)]">
                  Receive {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quote.receiveCurrency}
                </p>
              </div>
            </div>

            {/* Right: Details */}
            <div className="hidden md:flex flex-col gap-2 text-[13px] text-[var(--color-on-surface-variant)] ml-auto">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Exchange rate: {quote.exchangeRate}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" /></svg>
                Fee: {feeLabel}
              </div>
              {provider?.paymentMethods.slice(0, 3).map((method) => (
                <div key={method} className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  {method}
                </div>
              ))}
              {provider ? (
                <Link
                  href={`/companies/${provider.slug}`}
                  className="text-[var(--color-primary)] hover:underline mt-1"
                >
                  Read full review
                </Link>
              ) : (
                <a
                  href={providerWebsite}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[var(--color-primary)] hover:underline mt-1"
                >
                  Visit {providerName}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
