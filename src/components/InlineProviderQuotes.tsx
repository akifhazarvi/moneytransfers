import Image from "next/image";
import Link from "next/link";
import { generateQuotes, getProviderName, providers, type TransferQuote } from "@/data/providers";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";
import InlineQuoteCTA from "./InlineQuoteCTA";
import SeeAllProvidersLink from "./SeeAllProvidersLink";

interface Props {
  from?: string;
  to?: string;
  amount?: number;
  source: string;
  heading?: string;
  subheading?: string;
}

function symbolFor(code: string): string {
  return (
    sendCurrencies.find((c) => c.code === code)?.symbol ||
    currencies.find((c) => c.code === code)?.symbol ||
    code
  );
}

export default function InlineProviderQuotes({
  from = "USD",
  to = "INR",
  amount = 1000,
  source,
  heading,
  subheading,
}: Props) {
  const quotes: TransferQuote[] = generateQuotes(amount, from, to).slice(0, 5);
  if (quotes.length === 0) return null;

  const sendSymbol = symbolFor(from);
  const recvSymbol = symbolFor(to);
  const seeAllHref = `/send-money?from=${from}&to=${to}&amount=${amount}`;
  const corridor = `${from}-${to}`;
  // source is "guide:<slug>" or a plain surface name — extract slug if present
  const pageSlug = source.startsWith("guide:") ? source.slice(6) : source;
  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savings = best.receiveAmount - worst.receiveAmount;

  return (
    <aside
      className="my-10 rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[var(--color-success-dark)]/20"
      aria-label="Live provider rate comparison"
    >
      <header className="px-5 sm:px-6 py-5 bg-gradient-to-r from-[var(--color-success-dark)] to-[#047857] border-b border-white/10">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Live · {from} → {to} · Updated 6h</p>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {heading || `Best providers for ${sendSymbol}${amount.toLocaleString()} ${from} → ${to}`}
            </h3>
            {subheading && (
              <p className="text-sm text-white/75 mt-1">{subheading}</p>
            )}
          </div>
          <SeeAllProvidersLink
            href={seeAllHref}
            corridor={corridor}
            source="header"
            slug={pageSlug}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 text-xs font-bold bg-white text-[var(--color-success-dark)] rounded-full hover:bg-white/90 transition-colors whitespace-nowrap shadow-sm"
          >
            See all 35+ →
          </SeeAllProvidersLink>
        </div>
        {savings > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
            <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-xs font-semibold text-white">
              Best vs worst: {recvSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} difference on {sendSymbol}{amount.toLocaleString()} {from}
            </p>
          </div>
        )}
      </header>

      <div className="divide-y divide-[var(--color-outline)]">
        {quotes.map((q, i) => {
          const name = getProviderName(q.providerSlug);
          const provider = providers.find((p) => p.slug === q.providerSlug);
          const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
          const isBest = i === 0;
          const feeLabel = q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`;

          return (
            <div
              key={q.providerSlug}
              className={`px-4 sm:px-6 py-3.5 ${isBest ? "bg-[var(--color-success-surface)]/30" : ""}`}
            >
              {/* Desktop: single row */}
              <div className="hidden sm:grid sm:grid-cols-[auto_minmax(0,1fr)_90px_120px_auto] sm:gap-4 sm:items-center">
                <span className={`text-xs font-bold tabular-nums w-4 text-center ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-muted)]"}`}>
                  {i + 1}
                </span>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/40 flex items-center justify-center">
                    <Image src={logo} alt={`${name} logo`} width={36} height={36} className="w-full h-full object-contain p-1" unoptimized={logo.endsWith(".svg")} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                      {name}
                      {isBest && (
                        <span className="ml-1.5 text-2xs text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-semibold align-middle tracking-wide uppercase">
                          Best
                        </span>
                      )}
                    </p>
                    <p className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed}</p>
                  </div>
                </div>

                <p className={`text-2sm text-right tabular-nums ${q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface-variant)]"}`}>
                  {feeLabel}
                </p>

                <div className="text-right">
                  <p className={`text-sm font-semibold tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                    {recvSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-2xs text-[var(--color-on-surface-variant)]">recipient gets</p>
                </div>

                <InlineQuoteCTA
                  providerSlug={q.providerSlug}
                  providerName={name}
                  sendCurrency={q.sendCurrency}
                  receiveCurrency={q.receiveCurrency}
                  sendAmount={q.sendAmount}
                  rank={i + 1}
                  isBest={isBest}
                  source={source}
                />
              </div>

              {/* Mobile: stacked rows */}
              <div className="sm:hidden">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold tabular-nums w-4 text-center shrink-0 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-muted)]"}`}>
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/40 flex items-center justify-center">
                    <Image src={logo} alt={`${name} logo`} width={36} height={36} className="w-full h-full object-contain p-1" unoptimized={logo.endsWith(".svg")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2sm font-semibold text-[var(--color-on-surface)] truncate">
                      {name}
                      {isBest && (
                        <span className="ml-1.5 text-2xs text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-semibold align-middle tracking-wide uppercase">
                          Best
                        </span>
                      )}
                    </p>
                    <p className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed} · {feeLabel}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                      {recvSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-2xs text-[var(--color-on-surface-variant)]">they get</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <InlineQuoteCTA
                    providerSlug={q.providerSlug}
                    providerName={name}
                    sendCurrency={q.sendCurrency}
                    receiveCurrency={q.receiveCurrency}
                    sendAmount={q.sendAmount}
                    rank={i + 1}
                    isBest={isBest}
                    source={source}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {savings > 0 && (
        <div className="px-5 sm:px-6 py-3 bg-[var(--color-success-surface)]/40 border-t border-[var(--color-outline)]">
          <p className="text-2sm text-[var(--color-on-surface)]">
            <strong>{getProviderName(best.providerSlug)}</strong> delivers{" "}
            <strong className="text-[var(--color-success-dark)] tabular-nums">
              {recvSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>{" "}
            more than {getProviderName(worst.providerSlug)} on this corridor today.
          </p>
        </div>
      )}

      <footer className="px-5 sm:px-6 py-3 text-2xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        Rates updated every 6 hours from provider APIs. We may earn a commission when you visit a provider — this never affects rankings.
        {" "}
        <SeeAllProvidersLink
          href={seeAllHref}
          corridor={corridor}
          source="footer"
          slug={pageSlug}
          className="text-[var(--color-primary)] font-medium hover:underline"
        >
          Compare all providers →
        </SeeAllProvidersLink>
      </footer>
    </aside>
  );
}
