import Image from "next/image";
import { generateQuotes, getProviderName, providers } from "@/data/providers";
import { getTranslations } from "next-intl/server";

interface BestTransferTodayProps {
  amount?: number;
  from?: string;
  to?: string;
  symbol?: string;
}

export default async function BestTransferToday({
  amount = 1000,
  from = "USD",
  to = "PKR",
  symbol = "Rs",
}: BestTransferTodayProps) {
  const t = await getTranslations("bestTransferToday");
  const quotes = generateQuotes(amount, from, to).slice(0, 5);

  if (quotes.length === 0) {
    return (
      <p className="text-center text-[14px] text-[var(--color-on-surface-variant)]">
        {t("noQuotesAvailable")}
      </p>
    );
  }

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)]">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_90px_80px_110px] sm:grid-cols-[1fr_110px_100px_130px] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-[11px] sm:text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
          <span>{t("provider")}</span>
          <span className="text-right">{t("rate")}</span>
          <span className="text-right">{t("fee")}</span>
          <span className="text-right">{t("youGet")}</span>
        </div>

        {/* Rows */}
        {quotes.map((q, i) => {
          const name = getProviderName(q.providerSlug);
          const provider = providers.find((p) => p.slug === q.providerSlug);
          const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
          const isBest = i === 0;

          return (
            <div
              key={q.providerSlug}
              className={`grid grid-cols-[1fr_90px_80px_110px] sm:grid-cols-[1fr_110px_100px_130px] gap-2 items-center px-4 sm:px-6 py-3 border-t border-[var(--color-outline)] ${isBest ? "bg-[var(--color-success-surface)]/40" : ""}`}
            >
              {/* Provider */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[12px] font-medium text-[var(--color-on-surface-variant)] relative border border-[var(--color-outline)]/50">
                  <Image
                    src={logo}
                    alt={`${name} logo`}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-[14px] font-medium text-[var(--color-on-surface)] truncate">
                    {name}
                    {isBest && (
                      <span className="ml-1.5 text-[10px] sm:text-[11px] text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-semibold align-middle tracking-wide uppercase">
                        {t("best")}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)]">{q.transferSpeed}</p>
                </div>
              </div>

              {/* Rate */}
              <p className="text-[13px] sm:text-[14px] text-[var(--color-on-surface)] text-right tabular-nums">
                {q.exchangeRate.toFixed(2)}
              </p>

              {/* Fee */}
              <p className={`text-[13px] sm:text-[14px] text-right tabular-nums ${q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                {q.fee === 0 ? t("free") : `$${q.fee.toFixed(2)}`}
              </p>

              {/* Recipient gets */}
              <p className={`text-[13px] sm:text-[14px] font-semibold text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                {symbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Savings callout */}
      {quotes.length >= 2 && (
        <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/15 rounded-xl px-4 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-[13px] text-[var(--color-success-dark)]">
            <strong>{getProviderName(best.providerSlug)}</strong> saves you{" "}
            <strong>
              {symbol}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>{" "}
            vs {getProviderName(worst.providerSlug)}.
          </p>
        </div>
      )}
    </div>
  );
}
