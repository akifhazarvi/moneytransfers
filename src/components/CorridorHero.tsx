"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import CircleFlag from "@/components/CircleFlag";
import LiveTimestamp from "@/components/LiveTimestamp";
import { getGoUrl } from "@/lib/affiliate";
import { getProviderName, providers, type TransferQuote } from "@/data/providers";
import { trackProviderClicked } from "@/lib/analytics";

interface Props {
  headingFrom: string;
  headingTo: string;
  fromCurrency: string;
  toCurrency: string;
  fromCurrencyCode: string;
  toCurrencyCode: string;
  sampleAmount: number;
  sendSymbol: string;
  receiveSymbol: string;
  midRate: number;
  best: TransferQuote | undefined;
  worst: TransferQuote | undefined;
  quotes: TransferQuote[];
  dataUpdatedISO: string;
  isCountryPage?: boolean;
  headingPrefix: string;
  headingSuffix?: string | null;
  corridorSlug: string;
}

function formatReceive(n: number, symbol: string): string {
  return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatSavings(n: number, symbol: string): string {
  // Display rounding: 100+ to nearest 10, 1000+ to nearest 100.
  const rounded = n >= 1000 ? Math.round(n / 100) * 100 : n >= 100 ? Math.round(n / 10) * 10 : Math.round(n);
  return `${symbol}${rounded.toLocaleString()}`;
}

/**
 * Premium corridor hero. Replaces the old "big title + wall of editorial" opening
 * with a single typographic moment: best provider, savings, primary CTA.
 *
 * Design brief: Wise × Apple Card — one primary action, restrained chrome, numbers
 * treated like editorial objects (not table cells). Everything that isn't the
 * answer is demoted to secondary type.
 */
export default function CorridorHero({
  headingFrom,
  headingTo,
  fromCurrency,
  toCurrency,
  fromCurrencyCode,
  toCurrencyCode,
  sampleAmount,
  sendSymbol,
  receiveSymbol,
  midRate,
  best,
  worst,
  quotes,
  dataUpdatedISO,
  isCountryPage,
  headingPrefix,
  headingSuffix,
  corridorSlug,
}: Props) {
  const bestName = best ? getProviderName(best.providerSlug) : null;
  const bestProvider = best ? providers.find((p) => p.slug === best.providerSlug) : null;
  const bestLogo = bestProvider?.logo || (best ? `/logos/${best.providerSlug}.png` : null);
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;
  const showSavings = savings >= 5;
  const markup = best && midRate > 0 ? ((midRate - best.exchangeRate) / midRate) * 100 : 0;
  const markupPct = Math.max(0, markup);

  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-outline)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-10 sm:pb-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-on-surface-muted)] mb-5">
          <Link href="/" className="hover:text-[var(--color-on-surface)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/send-money" className="hover:text-[var(--color-on-surface)] transition-colors">Send Money</Link>
          <span>/</span>
          <span className="text-[var(--color-on-surface-variant)]">
            {isCountryPage ? `to ${headingTo}` : `${headingFrom} to ${headingTo}`}
          </span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-5xl lg:text-[56px] font-semibold text-[var(--color-on-surface)] leading-[1.05] tracking-[-0.025em]">
              {isCountryPage ? `${headingPrefix} ${headingTo}` : `${headingPrefix} ${headingFrom} to ${headingTo}`}
              {headingSuffix && (
                <span className="block text-[var(--color-on-surface-muted)] text-2xl sm:text-3xl lg:text-4xl font-normal mt-1.5 tracking-[-0.015em]">
                  {headingSuffix}
                </span>
              )}
            </h1>

            {/* Meta line — single row, muted, monospace numerics */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-5 text-sm text-[var(--color-on-surface-variant)]">
              <span className="inline-flex items-center gap-1.5">
                <CircleFlag code={fromCurrencyCode} size={20} priority={true} />
                <span className="font-medium tabular-nums">{fromCurrency}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-on-surface-muted)]" strokeWidth={2} />
              <span className="inline-flex items-center gap-1.5">
                <CircleFlag code={toCurrencyCode} size={20} priority={true} />
                <span className="font-medium tabular-nums">{toCurrency}</span>
              </span>
              <span className="text-[var(--color-outline)]">|</span>
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-success)]" />
                </span>
                <LiveTimestamp iso={dataUpdatedISO} prefix="Updated" className="tabular-nums" />
              </span>
              {midRate > 0 && (
                <>
                  <span className="text-[var(--color-outline)] hidden sm:inline">|</span>
                  <span className="hidden sm:inline">
                    Mid-market <span className="font-medium text-[var(--color-on-surface)] tabular-nums">{midRate.toFixed(4)}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Best-provider card — the hero element */}
          {best && bestName && (
            <div className="lg:min-w-[380px] lg:max-w-[420px] w-full">
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-sm)] relative overflow-hidden">
                {/* Accent hairline — premium touch */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--color-success)]" />

                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-success-dark)] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" strokeWidth={2.25} />
                    Cheapest today
                  </span>
                  {quotes.length > 1 && (
                    <span className="text-[11px] text-[var(--color-on-surface-muted)] tabular-nums">
                      of {quotes.length} providers
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  {bestLogo && (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/60 flex items-center justify-center shrink-0 relative">
                      <Image src={bestLogo} alt={`${bestName} logo`} width={48} height={48} className="w-full h-full object-contain p-1" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-[var(--color-on-surface)] truncate tracking-[-0.01em]">
                      {bestName}
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-muted)] tabular-nums">
                      Rate {best.exchangeRate.toFixed(4)} · Fee {best.fee === 0 ? "free" : `${sendSymbol}${best.fee.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-[11px] font-medium text-[var(--color-on-surface-muted)] uppercase tracking-wider">You send</p>
                    <p className="text-xl font-semibold text-[var(--color-on-surface)] tabular-nums mt-1">
                      {sendSymbol}{sampleAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[var(--color-on-surface-muted)] uppercase tracking-wider">Recipient gets</p>
                    <p className="text-xl font-semibold text-[var(--color-success-dark)] tabular-nums mt-1">
                      {formatReceive(best.receiveAmount, receiveSymbol)}
                    </p>
                  </div>
                </div>

                {showSavings && (
                  <div className="bg-[var(--color-success-surface)] border border-[var(--color-success-surface-dim)] rounded-xl px-3.5 py-2.5 mb-4">
                    <p className="text-xs text-[var(--color-success-dark)]">
                      <span className="font-semibold tabular-nums">{formatSavings(savings, receiveSymbol)} more</span>
                      <span className="text-[var(--color-on-surface-variant)]"> than the most expensive provider</span>
                      {markupPct > 0.05 && (
                        <span className="text-[var(--color-on-surface-variant)]"> · {markupPct.toFixed(2)}% markup vs mid-market</span>
                      )}
                    </p>
                  </div>
                )}

                <a
                  href={getGoUrl(best.providerSlug, { sourceCurrency: fromCurrency, targetCurrency: toCurrency, sourceAmount: sampleAmount })}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => trackProviderClicked(best.providerSlug, `${fromCurrency}-${toCurrency}`, 1, "corridor_hero")}
                  className="flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold text-sm py-3 rounded-full transition-colors shadow-[var(--shadow-sm)]"
                >
                  Send with {bestName}
                  <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                </a>
                <p className="text-[11px] text-center text-[var(--color-on-surface-muted)] mt-2.5">
                  Affiliate link · No extra cost to you
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
