import Image from "next/image";
import Link from "next/link";
import { generateQuotes, getProviderName, providers, type TransferQuote } from "@/data/providers";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";
import InlineQuoteCTA from "./InlineQuoteCTA";

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
  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savings = best.receiveAmount - worst.receiveAmount;

  return (
    <aside
      className="my-10 border border-[var(--color-outline)] rounded-2xl overflow-hidden bg-[var(--color-surface)]"
      aria-label="Live provider rate comparison"
    >
      <header className="px-5 sm:px-6 py-4 bg-[var(--color-primary-surface)] border-b border-[var(--color-outline)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-overline text-[var(--color-primary)] mb-0.5">Live rates · {from} → {to}</p>
            <h3 className="text-md font-semibold text-[var(--color-on-surface)] leading-snug">
              {heading || `Best providers for ${sendSymbol}${amount.toLocaleString()} ${from} → ${to}`}
            </h3>
            {subheading && (
              <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">{subheading}</p>
            )}
          </div>
          <Link
            href={seeAllHref}
            className="shrink-0 text-2sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            All 35+ providers →
          </Link>
        </div>
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
        <Link href={seeAllHref} className="text-[var(--color-primary)] font-medium hover:underline">
          Compare all providers →
        </Link>
      </footer>
    </aside>
  );
}
