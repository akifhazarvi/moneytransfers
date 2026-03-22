"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { providers, getProviderName, type TransferQuote } from "@/data/providers";
import { trackProviderExpanded, trackProviderClicked, trackReviewClicked } from "@/lib/analytics";
import { getGoUrl } from "@/lib/affiliate";
import { promos, type PromoInfo } from "@/data/promos";
import RatingBadge from "./RatingBadge";
import { useTranslations } from "next-intl";

interface Props {
  quote: TransferQuote;
  sendCurrencySymbol: string;
  receiveCurrencySymbol: string;
  rank: number;
  compareSelected?: boolean;
  onCompareToggle?: (slug: string) => void;
  compareDisabled?: boolean;
  midMarketRate?: number;
}

export default function ProviderCard({ quote, sendCurrencySymbol, receiveCurrencySymbol, rank, compareSelected, onCompareToggle, compareDisabled, midMarketRate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("providerCard");
  const provider = providers.find((p) => p.slug === quote.providerSlug);
  const providerName = provider?.name || getProviderName(quote.providerSlug);
  const providerLogo = provider?.logo || `/logos/${quote.providerSlug}.png`;
  const providerWebsite = getGoUrl(quote.providerSlug, {
    sourceCurrency: quote.sendCurrency,
    targetCurrency: quote.receiveCurrency,
    sourceAmount: quote.sendAmount,
  });

  const feeLabel = quote.fee === 0 ? t("free") : `${sendCurrencySymbol}${quote.fee.toFixed(2)}`;
  const isFast = quote.transferSpeed.toLowerCase().includes("minute") || quote.transferSpeed.toLowerCase().includes("instant");
  const isBest = rank === 1;
  const promo = promos.find((p) => p.providerSlug === quote.providerSlug);

  // % above/below mid-market rate
  const markupPct = midMarketRate && midMarketRate > 0
    ? ((quote.exchangeRate - midMarketRate) / midMarketRate) * 100
    : null;

  return (
    <div className={`relative transition-all duration-200 ${isBest ? "bg-[var(--color-success-surface-dim)] border-2 border-[var(--color-success-dark)]/20 rounded-2xl -mx-px -mt-px z-[1]" : "bg-[var(--color-surface)] border-b border-[var(--color-outline)] last:border-b-0"} ${expanded ? "" : "hover:bg-[var(--color-surface-dim)]"}`}>
      {isBest && (
        <div className="absolute -top-px left-6 z-10">
          <div className="bg-[var(--color-success-dark)] text-white text-2xs font-semibold tracking-wide uppercase px-3 py-1 rounded-b-lg shadow-sm">
            {t("bestDeal")}
          </div>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          if (next) trackProviderExpanded(quote.providerSlug, rank, `${quote.sendCurrency}-${quote.receiveCurrency}`);
        }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const next = !expanded; setExpanded(next); if (next) trackProviderExpanded(quote.providerSlug, rank, `${quote.sendCurrency}-${quote.receiveCurrency}`); } }}
        aria-expanded={expanded}
        className={`group/row w-full text-left px-3 sm:px-6 cursor-pointer ${isBest ? "py-3 sm:py-5 pt-6 sm:pt-8" : "py-2.5 sm:py-4"}`}
      >
        {/* Mobile layout — clean, scannable, Apple-inspired */}
        <div className="flex sm:hidden items-center gap-2.5">
          <span className={`text-2xs font-bold tabular-nums w-4 text-center shrink-0 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-muted)]"}`}>
            {rank}
          </span>
          <div className={`${isBest ? "w-9 h-9" : "w-8 h-8"} rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center border border-[var(--color-outline)]/50`}>
            <Image src={providerLogo} alt={`${providerName} logo`} width={36} height={36} className="w-full h-full object-cover" unoptimized={providerLogo.endsWith(".svg")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-semibold text-[var(--color-on-surface)] truncate`}>{providerName}</p>
                  {isFast && (
                    <span className="text-[10px] font-bold uppercase text-[var(--color-success)] shrink-0">
                      {t("fast")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-px text-[11px] text-[var(--color-on-surface-variant)]">
                  <span className={quote.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : ""}>{feeLabel}</span>
                  <span className="text-[var(--color-outline)]">&middot;</span>
                  <span>{quote.transferSpeed}</span>
                  {markupPct !== null && (
                    <>
                      <span className="text-[var(--color-outline)]">&middot;</span>
                      <span className={`font-semibold ${markupPct >= 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-error)]"}`}>
                        {markupPct >= 0 ? "+" : ""}{markupPct.toFixed(2)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 flex items-center gap-1">
                <p className={`tabular-nums font-bold tracking-tight ${isBest ? "text-base text-[var(--color-success-dark)]" : "text-[15px] text-[var(--color-on-surface)]"}`}>
                  {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <svg className={`w-4 h-4 text-[var(--color-on-surface-muted)] transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center gap-5">
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-2sm font-semibold tabular-nums w-5 text-center ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
              {rank}
            </span>
            {onCompareToggle && (
              <div className="relative group/compare">
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
                  aria-label={t("compare", { provider: providerName })}
                >
                  {compareSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                {compareDisabled && !compareSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[var(--color-on-surface)] text-white text-2xs rounded whitespace-nowrap pointer-events-none opacity-0 group-hover/compare:opacity-100 transition-opacity z-10">
                    Max 2 providers selected
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`${isBest ? "w-11 h-11" : "w-10 h-10"} rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-sm font-medium text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50`}>
            <Image src={providerLogo} alt={`${providerName} logo`} width={44} height={44} className="w-full h-full object-cover" unoptimized={providerLogo.endsWith(".svg")} />
          </div>

          <div className="w-[200px] lg:w-[240px] shrink-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium text-[var(--color-on-surface)] truncate ${isBest ? "text-md" : ""}`}>{providerName}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <RatingBadge rating={quote.rating} label={quote.ratingLabel} size="sm" />
              {isFast && (
                <span className="text-2xs font-semibold tracking-wide uppercase text-[var(--color-success)] bg-[var(--color-success-surface)] px-1.5 py-px rounded">
                  {t("fast")}
                </span>
              )}
              {promo?.referralBadge && (
                <span className="text-2xs font-semibold tracking-wide uppercase text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-1.5 py-px rounded whitespace-nowrap">
                  {promo.referralBadge}
                </span>
              )}
              {promo?.signUpBadge && (
                <span className="text-2xs font-semibold tracking-wide uppercase text-[var(--color-on-surface)] bg-[var(--color-surface-container)] px-1.5 py-px rounded whitespace-nowrap">
                  {promo.signUpBadge}
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 flex-1 min-w-0">
            <div className="w-[110px] shrink-0">
              <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("speed")}</p>
              <p className="text-2sm text-[var(--color-on-surface)] mt-0.5">{quote.transferSpeed}</p>
            </div>
            <div className="w-[80px] shrink-0">
              <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("fee")}</p>
              <p className={`text-2sm mt-0.5 ${quote.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                {feeLabel}
              </p>
            </div>
            <div className="w-[110px] shrink-0">
              <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("rate")}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-2sm text-[var(--color-on-surface)] tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
                {markupPct !== null && (
                  <span className={`text-2xs font-semibold tabular-nums ${markupPct >= 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-error)]"}`}>
                    {markupPct >= 0 ? "+" : ""}{markupPct.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0" />

          <div className="text-right shrink-0 mr-1">
            <p className={`tabular-nums font-semibold tracking-tight ${isBest ? "text-h4 sm:text-2xl text-[var(--color-success-dark)]" : "text-lg sm:text-xl text-[var(--color-on-surface)]"}`}>
              {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">{t("recipientGets")}</p>
          </div>

          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover/row:bg-[var(--color-surface-container)] transition-colors">
            <svg className={`w-5 h-5 text-[var(--color-on-surface-variant)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded details panel */}
      <div className={`grid transition-all duration-200 ease-in-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className={`mx-5 sm:mx-6 mb-5 border border-[var(--color-outline)] rounded-2xl overflow-hidden ${isBest ? "border-[var(--color-success-dark)]/20" : ""}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-[var(--color-surface-dim)]">
              <div className="px-4 py-3 border-r border-b sm:border-b-0 border-[var(--color-outline)]">
                <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("exchangeRate")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-md font-medium text-[var(--color-on-surface)] tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
                  {markupPct !== null && (
                    <span className={`text-xs font-semibold tabular-nums ${markupPct >= 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-error)]"}`}>
                      {markupPct >= 0 ? "+" : ""}{markupPct.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 sm:border-r border-b sm:border-b-0 border-[var(--color-outline)]">
                <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("transferFee")}</p>
                <p className={`text-md font-medium mt-1 ${quote.fee === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>{feeLabel}</p>
              </div>
              <div className="px-4 py-3 border-r border-[var(--color-outline)]">
                <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("delivery")}</p>
                <p className="text-md font-medium text-[var(--color-on-surface)] mt-1">{quote.transferSpeed}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("recipientGets")}</p>
                <p className={`text-md font-semibold mt-1 tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                  {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-surface)]">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-2sm text-[var(--color-on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                  <span>{t("send")} {sendCurrencySymbol}{quote.sendAmount.toLocaleString()} {quote.sendCurrency}</span>
                </div>
                <svg className="w-4 h-4 text-[var(--color-outline)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isBest ? "bg-[var(--color-success-dark)]" : "bg-[var(--color-on-surface-variant)]"}`} />
                  <span className={isBest ? "text-[var(--color-success-dark)] font-medium" : ""}>
                    {t("receive")} {receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quote.receiveCurrency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {provider && (
                  <Link
                    href={`/companies/${provider.slug}`}
                    onClick={() => trackReviewClicked(quote.providerSlug, `${quote.sendCurrency}-${quote.receiveCurrency}`)}
                    className="text-2sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    {t("fullReview")}
                  </Link>
                )}
                <a
                  href={providerWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { track("provider_clicked", { provider: quote.providerSlug, corridor: `${quote.sendCurrency}-${quote.receiveCurrency}`, rank }); trackProviderClicked(quote.providerSlug, `${quote.sendCurrency}-${quote.receiveCurrency}`, rank); }}
                  className={`inline-flex items-center gap-2 h-10 px-6 text-2sm font-semibold rounded-full transition-all duration-150 ${
                    isBest
                      ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)] shadow-sm hover:shadow"
                      : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow"
                  }`}
                >
                  {t("sendWith", { provider: providerName })}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {provider && provider.paymentMethods.length > 0 && (
              <div className="px-5 py-3 border-t border-[var(--color-outline)] bg-[var(--color-surface-dim)]/50 flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)]">
                <span className="font-medium">{t("paysWith")}</span>
                <div className="flex flex-wrap gap-2">
                  {provider.paymentMethods.slice(0, 4).map((method) => (
                    <span key={method} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-full px-2.5 py-0.5">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {promo && (promo.signUpOffer || promo.referralProgram || promo.promoCode) && (
              <div className="px-5 py-4 border-t border-[var(--color-outline)] bg-[var(--color-surface-dim)]">
                <p className="text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wide mb-3">{t("dealsPromotions")}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {promo.signUpOffer && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-on-surface)]">{t("signUpOffer")}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">{promo.signUpOffer}</p>
                        {promo.promoCode && (
                          <p className="text-xs mt-1">
                            {t("code")} <span className="font-mono font-semibold text-[var(--color-on-surface)] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">{promo.promoCode}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {promo.referralProgram && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-primary)]">{t("referFriend")}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">
                          {t("youGet")} {promo.referralProgram.referrerReward}
                        </p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                          {t("friendGets")} {promo.referralProgram.refereeReward}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {promo.loyaltyProgram && (
                  <div className="flex gap-2.5 mt-3 pt-3 border-t border-[var(--color-outline)]/50">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-primary)]">{t("loyaltyProgram")}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">{promo.loyaltyProgram}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
