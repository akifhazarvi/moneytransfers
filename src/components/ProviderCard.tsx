"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { providers, getProviderName, type TransferQuote } from "@/data/providers";
import { trackProviderExpanded, trackProviderClicked, trackReviewClicked } from "@/lib/analytics";
import { getGoUrl } from "@/lib/affiliate";
import { promos, type PromoInfo } from "@/data/promos";
import { getProviderInsight, getRateInsight } from "@/lib/rate-history";
import { Sparkline, ProviderBadgeTag, ProviderRateInsightLine } from "./RateInsight";
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
  /** Recipient-currency amount this provider delivers above the worst-ranked provider (only passed for rank 1). */
  extraReceiveVsWorst?: number;
}

function formatSavings(amount: number): string {
  if (amount >= 1000) return Math.round(amount / 100) * 100 + "+";
  if (amount >= 100) return String(Math.round(amount / 10) * 10);
  return amount.toFixed(2).replace(/\.?0+$/, "");
}

export default function ProviderCard({ quote, sendCurrencySymbol, receiveCurrencySymbol, rank, compareSelected, onCompareToggle, compareDisabled, midMarketRate, extraReceiveVsWorst }: Props) {
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

  // Account-managed FX brokers charge zero fee — all cost is in the rate
  // spread — so the fee label is genuinely "Free" even on indicative quotes.
  // The "estimated" caveat attaches to the rate column instead.
  const feeLabel = quote.fee === 0 ? t("free") : `${sendCurrencySymbol}${quote.fee.toFixed(2)}`;
  const isFast = quote.transferSpeed.toLowerCase().includes("minute") || quote.transferSpeed.toLowerCase().includes("instant");
  const isBest = rank === 1;
  const promo = promos.find((p) => p.providerSlug === quote.providerSlug);

  // Abbreviate speed for mobile (prevent wrapping)
  const mobileSpeed = (() => {
    const s = quote.transferSpeed.toLowerCase();
    if (s.includes("instant")) return "Instant";
    if (s.includes("minute")) return "Minutes";
    if (s.includes("same day") || s.includes("same-day")) return "Same day";
    if (s.match(/\d+\s*-?\s*\d*\s*hour/)) return quote.transferSpeed.replace(/\s+/g, " ");
    if (s.match(/0\s*-?\s*1\s*day/)) return "0-1 days";
    if (s.match(/1\s*-?\s*2\s*day/)) return "1-2 days";
    if (s.match(/1\s*-?\s*3\s*(business\s+)?day/)) return "1-3 days";
    if (s.match(/2\s*-?\s*5\s*(business\s+)?day/)) return "2-5 days";
    if (s.match(/minutes?\s*to\s*\d+\s*(business\s+)?day/)) return "Min–1 day";
    if (s.includes("day")) {
      const match = s.match(/(\d+\s*-?\s*\d*)\s*(business\s+)?day/);
      return match ? `${match[1]} days` : quote.transferSpeed;
    }
    return quote.transferSpeed;
  })();

  // % above/below mid-market rate
  const markupPct = midMarketRate && midMarketRate > 0
    ? ((quote.exchangeRate - midMarketRate) / midMarketRate) * 100
    : null;

  // Historical rate insight for this provider on this corridor
  const providerInsight = getProviderInsight(quote.sendCurrency, quote.receiveCurrency, quote.providerSlug);
  const corridorInsight = getRateInsight(quote.sendCurrency, quote.receiveCurrency);
  const sparklineData = corridorInsight?.sparklines[quote.providerSlug];
  const badge = corridorInsight?.providerBadges.find((b) => b.providerSlug === quote.providerSlug);

  return (
    <div className={`relative transition-all duration-200 ${isBest ? "bg-[var(--color-success-surface-dim)] border-2 border-[var(--color-success-dark)]/20 rounded-2xl -mx-px -mt-px z-[1]" : "bg-[var(--color-surface)] border-b border-[var(--color-outline)] last:border-b-0"} ${expanded ? "" : "hover:bg-[var(--color-surface-dim)]"}`}>
      {isBest && (
        <div className="absolute -top-px left-4 sm:left-6 z-10">
          <div className="bg-[var(--color-success-dark)] text-white text-2xs font-semibold tracking-wide uppercase px-3 py-1 rounded-b-lg shadow-sm flex items-center gap-1.5">
            <span>{t("bestDeal")}</span>
            {extraReceiveVsWorst && extraReceiveVsWorst > 0 && (
              <>
                <span className="text-white/50">•</span>
                <span className="normal-case tabular-nums">+{receiveCurrencySymbol}{formatSavings(extraReceiveVsWorst)} more</span>
              </>
            )}
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
        className={`group/row w-full text-left px-4 sm:px-6 cursor-pointer ${isBest ? "py-5 sm:py-5 pt-9 sm:pt-8" : "py-5 sm:py-4"}`}
      >
        {/* Mobile layout */}
        <div className="flex sm:hidden items-start gap-3">
          {/* Rank */}
          <span className={`text-xs font-bold tabular-nums w-4 text-center shrink-0 mt-2 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-muted)]"}`}>
            {rank}
          </span>
          {/* Logo */}
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center border border-[var(--color-outline)]/30 mt-0.5">
            <Image src={providerLogo} alt={`${providerName} logo`} width={44} height={44} className="w-full h-full object-cover" unoptimized={providerLogo.endsWith(".svg")} />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Name */}
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-[15px] font-semibold text-[var(--color-on-surface)] truncate leading-tight">{providerName}</p>
              {isFast && (
                <span className="text-[10px] font-bold uppercase text-[var(--color-success)] shrink-0 tracking-wide">
                  {t("fast")}
                </span>
              )}
            </div>
            {/* Row 2: Fee · Speed */}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--color-on-surface-variant)]">
              <span className={`${quote.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : ""}`}>{feeLabel}</span>
              <span className="text-[var(--color-outline)]">&middot;</span>
              <span>{mobileSpeed}</span>
            </div>
          </div>
          {/* Amount — right aligned with label */}
          <div className="shrink-0 text-right">
            <p className={`tabular-nums font-bold tracking-tight ${isBest ? "text-[17px] text-[var(--color-success-dark)]" : "text-[16px] text-[var(--color-on-surface)]"}`}>
              {quote.isIndicative ? "~" : ""}{receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">{quote.isIndicative ? "Estimated" : t("recipientGets")}</p>
            <svg className={`w-4 h-4 text-[var(--color-on-surface-muted)] transition-transform duration-200 ml-auto mt-1 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
            <div className="w-[130px] shrink-0">
              <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{t("rate")}</p>
              <p className="text-2sm text-[var(--color-on-surface)] mt-0.5 tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
              {quote.isIndicative ? (
                <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-px">
                  Estimated &middot; <span className="text-[var(--color-on-surface-variant)]">click to quote</span>
                </p>
              ) : markupPct !== null && midMarketRate && (
                <p className="text-[10px] text-[var(--color-on-surface-variant)] tabular-nums mt-px">
                  Mid {midMarketRate.toFixed(4)}{" "}
                  <span className={`font-semibold ${markupPct >= 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-error)]"}`}>
                    {markupPct >= 0 ? `▲${markupPct.toFixed(2)}%` : `▼${Math.abs(markupPct).toFixed(2)}%`}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0" />

          <div className="text-right shrink-0 mr-1">
            <p className={`tabular-nums font-semibold tracking-tight ${isBest ? "text-h4 sm:text-2xl text-[var(--color-success-dark)]" : "text-lg sm:text-xl text-[var(--color-on-surface)]"}`}>
              {quote.isIndicative ? "~" : ""}{receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">{quote.isIndicative ? "Estimated" : t("recipientGets")}</p>
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
                <p className="text-md font-medium text-[var(--color-on-surface)] mt-1 tabular-nums">{quote.exchangeRate.toFixed(4)}</p>
                {markupPct !== null && midMarketRate && (
                  <p className="text-2xs text-[var(--color-on-surface-variant)] tabular-nums mt-0.5">
                    Mid-market: {midMarketRate.toFixed(4)}{" "}
                    <span className={`font-semibold ${markupPct >= 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-error)]"}`}>
                      ({markupPct >= 0 ? `${markupPct.toFixed(2)}% above` : `${Math.abs(markupPct).toFixed(2)}% below`})
                    </span>
                  </p>
                )}
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
                <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">{quote.isIndicative ? "Estimated receive" : t("recipientGets")}</p>
                <p className={`text-md font-semibold mt-1 tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                  {quote.isIndicative ? "~" : ""}{receiveCurrencySymbol}{quote.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  {isBest && extraReceiveVsWorst && extraReceiveVsWorst > 0 ? (
                    <>
                      <span className="hidden sm:inline">{t("sendWith", { provider: providerName })}</span>
                      <span className="sm:hidden">Send</span>
                      <span className="text-white/75 text-xs font-normal">•</span>
                      <span className="tabular-nums">+{receiveCurrencySymbol}{formatSavings(extraReceiveVsWorst)} more</span>
                    </>
                  ) : (
                    t("sendWith", { provider: providerName })
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Rate History Insight */}
            {providerInsight && sparklineData && sparklineData.length >= 2 && (
              <div className="px-5 py-4 border-t border-[var(--color-outline)] bg-[var(--color-surface-dim)]/50">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wide">Rate History</p>
                  {badge && <ProviderBadgeTag badge={badge} />}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="shrink-0">
                    <Sparkline data={sparklineData} width={120} height={32} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-1.5 text-xs flex-1">
                    <div>
                      <span className="text-[var(--color-on-surface-muted)]">Trend</span>
                      <p className="font-medium" style={{ color: providerInsight.trendDirection === "up" ? "var(--color-success)" : providerInsight.trendDirection === "down" ? "var(--color-danger)" : "var(--color-on-surface-variant)" }}>
                        {providerInsight.trendDirection === "up" ? "↑" : providerInsight.trendDirection === "down" ? "↓" : "→"} {Math.abs(providerInsight.trendPct).toFixed(1)}% over {providerInsight.daysTracked}d
                      </p>
                    </div>
                    <div>
                      <span className="text-[var(--color-on-surface-muted)]">Avg rate</span>
                      <p className="font-medium text-[var(--color-on-surface)] tabular-nums">{providerInsight.avgRate.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-[var(--color-on-surface-muted)]">Range</span>
                      <p className="font-medium text-[var(--color-on-surface)] tabular-nums">{providerInsight.minRate.toFixed(2)} – {providerInsight.maxRate.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-[var(--color-on-surface-muted)]">vs Average</span>
                      <p className="font-medium" style={{ color: providerInsight.currentVsAvg > 0.05 ? "var(--color-success)" : providerInsight.currentVsAvg < -0.05 ? "var(--color-danger)" : "var(--color-on-surface-variant)" }}>
                        {providerInsight.currentVsAvg > 0 ? "+" : ""}{providerInsight.currentVsAvg.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
