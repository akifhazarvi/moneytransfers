import Image from "next/image";
import { generateQuotes, getProviderName, providers } from "@/data/providers";
import { getTranslations } from "next-intl/server";

interface BestTransferTodayProps {
  amount?: number;
  from?: string;
  to?: string;
  symbol?: string;
  // When set, the widget shows the top-4 quotes plus the highlighted provider's
  // row (in its actual ranked position) — so a page about Provider X always
  // shows Provider X's quote rather than just the global top 5. Without this,
  // a "Live X rates today" widget on /companies/x is misleading because X may
  // not appear in the global top-5 at all.
  highlightSlug?: string;
}

export default async function BestTransferToday({
  amount = 1000,
  from = "USD",
  to = "PKR",
  symbol = "Rs",
  highlightSlug,
}: BestTransferTodayProps) {
  const t = await getTranslations("bestTransferToday");
  const all = generateQuotes(amount, from, to);

  // If a highlight slug is given, always include that provider's quote in the
  // displayed set even if it's outside the top 5. Otherwise show the top 5.
  let quotes = all.slice(0, 5);
  if (highlightSlug && !quotes.some((q) => q.providerSlug === highlightSlug)) {
    const highlight = all.find((q) => q.providerSlug === highlightSlug);
    if (highlight) {
      quotes = [...all.slice(0, 4), highlight];
    }
  }

  if (quotes.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--color-on-surface-variant)]">
        {t("noQuotesAvailable")}
      </p>
    );
  }

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const highlighted = highlightSlug
    ? all.find((q) => q.providerSlug === highlightSlug) ?? null
    : null;
  const highlightedRank = highlighted
    ? all.findIndex((q) => q.providerSlug === highlightSlug) + 1
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)]">
        {/* Table header — on mobile, hide Rate column (lowest value on small screens); show all 4 on sm+ */}
        <div className="grid grid-cols-[minmax(0,1fr)_60px_100px] sm:grid-cols-[minmax(0,1fr)_110px_100px_130px] gap-2 px-3 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs sm:text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
          <span>{t("provider")}</span>
          <span className="hidden sm:inline text-right">{t("rate")}</span>
          <span className="text-right">{t("fee")}</span>
          <span className="text-right">{t("youGet")}</span>
        </div>

        {/* Rows */}
        {quotes.map((q, i) => {
          const name = getProviderName(q.providerSlug);
          const provider = providers.find((p) => p.slug === q.providerSlug);
          const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
          const isBest = i === 0;
          const isHighlight = highlightSlug && q.providerSlug === highlightSlug;

          return (
            <div
              key={q.providerSlug}
              className={`grid grid-cols-[minmax(0,1fr)_60px_100px] sm:grid-cols-[minmax(0,1fr)_110px_100px_130px] gap-2 items-center px-3 sm:px-6 py-3 border-t border-[var(--color-outline)] ${isHighlight ? "bg-[var(--color-primary-surface)]/60 ring-1 ring-[var(--color-primary)]/30" : isBest ? "bg-[var(--color-success-surface)]/40" : ""}`}
            >
              {/* Provider */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-xs font-medium text-[var(--color-on-surface-variant)] relative border border-[var(--color-outline)]/50">
                  <Image
                    src={logo}
                    alt={`${name} logo`}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-2sm sm:text-sm font-medium text-[var(--color-on-surface)] truncate">
                    {name}
                    {isBest && (
                      <span className="ml-1.5 text-2xs sm:text-2xs text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-semibold align-middle tracking-wide uppercase">
                        {t("best")}
                      </span>
                    )}
                    {isHighlight && !isBest && (
                      <span className="ml-1.5 text-2xs text-white bg-[var(--color-primary)] px-1.5 py-0.5 rounded font-semibold align-middle tracking-wide uppercase">
                        Featured
                      </span>
                    )}
                  </p>
                  <p className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed}</p>
                </div>
              </div>

              {/* Rate — hidden on mobile. Indicative quotes flag the rate as
                  estimated (we have mid-market, not the broker's actual spread). */}
              <p className={`hidden sm:block text-2sm sm:text-sm text-right tabular-nums ${q.isIndicative ? "text-[var(--color-on-surface-variant)]" : "text-[var(--color-on-surface)]"}`}>
                {q.exchangeRate.toFixed(2)}{q.isIndicative ? <span className="ml-1 text-2xs italic text-[var(--color-on-surface-variant)]">est.</span> : null}
              </p>

              {/* Fee — for account-managed FX brokers the fee is genuinely £0
                  (all cost is in the rate spread), so show "Free" honestly. */}
              <p className={`text-2sm sm:text-sm text-right tabular-nums ${q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                {q.fee === 0 ? t("free") : `$${q.fee.toFixed(2)}`}
              </p>

              {/* Recipient gets */}
              <p className={`text-2sm sm:text-sm font-semibold text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                {symbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Callout — when a provider is highlighted, frame the result from their
          perspective (rank + their indicative status) rather than headlining a
          competitor's win. Otherwise show the standard cheapest-vs-worst delta. */}
      {highlighted && highlightedRank ? (
        <div className="mt-4 bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/15 rounded-xl px-4 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-2sm text-[var(--color-on-surface)]">
            {highlighted.isIndicative ? (
              <>
                <strong>{getProviderName(highlightSlug!)}</strong> doesn&apos;t publish a public rate feed — the figure above is the mid-market rate, click through for an actual quote.
              </>
            ) : (
              <>
                <strong>{getProviderName(highlightSlug!)}</strong> ranks{" "}
                <strong>#{highlightedRank}</strong> of {all.length} providers we tracked for this corridor today.
              </>
            )}
          </p>
        </div>
      ) : quotes.length >= 2 ? (
        <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/15 rounded-xl px-4 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-2sm text-[var(--color-success-dark)]">
            <strong>{getProviderName(best.providerSlug)}</strong> saves you{" "}
            <strong>
              {symbol}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>{" "}
            vs {getProviderName(worst.providerSlug)}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
