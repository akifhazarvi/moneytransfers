"use client";

import Image from "next/image";
import Link from "next/link";
import { generateQuotes, getProviderName, providers } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import { trackConverterProviderClicked, trackConverterCTAClicked } from "@/lib/analytics";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";

function symbolFor(code: string): string {
  return (
    sendCurrencies.find((c) => c.code === code)?.symbol ||
    currencies.find((c) => c.code === code)?.symbol ||
    code
  );
}

interface Props {
  from: string;
  to: string;
  amount: number;
}

export default function ConverterProviderQuotes({ from, to, amount }: Props) {
  const quotes = generateQuotes(amount, from, to).slice(0, 5);
  if (quotes.length === 0) return null;

  const recvSymbol = symbolFor(to);
  const sendSymbol = symbolFor(from);
  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savings = best.receiveAmount - worst.receiveAmount;
  const corridor = `${from}-${to}`;
  const seeAllHref = `/send-money?from=${from}&to=${to}&amount=${amount}`;

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-[var(--color-outline)] bg-[var(--color-surface)]">
      {/* Header — savings hook */}
      <div className="px-5 sm:px-6 py-4 bg-[var(--color-primary)] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-0.5">
            Live rates · {from} → {to}
          </p>
          {savings > 0 ? (
            <p className="text-white font-semibold text-md leading-snug">
              Save up to{" "}
              <span className="text-[#a8e6cf] font-bold tabular-nums">
                {recvSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>{" "}
              {to} on this route today
            </p>
          ) : (
            <p className="text-white font-semibold text-md">
              Compare providers for {sendSymbol}{amount.toLocaleString()} {from} → {to}
            </p>
          )}
        </div>
        <a
          href={seeAllHref}
          onClick={() => trackConverterCTAClicked(corridor, amount)}
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 bg-white/15 hover:bg-white/25 text-white text-2sm font-semibold rounded-full transition-colors border border-white/20"
        >
          All 50+ apps
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* Provider rows */}
      <div className="divide-y divide-[var(--color-outline)]">
        {quotes.map((q, i) => {
          const name = getProviderName(q.providerSlug);
          const provider = providers.find((p) => p.slug === q.providerSlug);
          const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
          const isBest = i === 0;
          const href = getGoUrl(q.providerSlug, {
            sourceCurrency: q.sendCurrency,
            targetCurrency: q.receiveCurrency,
            sourceAmount: q.sendAmount,
            clickref: "converter",
          });
          const feeLabel = q.fee === 0 ? "No fee" : `${sendSymbol}${q.fee.toFixed(2)} fee`;

          return (
            <div
              key={q.providerSlug}
              className={`px-4 sm:px-6 py-3.5 flex items-center gap-3 sm:gap-4 ${
                isBest ? "bg-[var(--color-success-surface)]/30" : ""
              }`}
            >
              {/* Rank */}
              <span className={`text-xs font-bold tabular-nums w-4 text-center shrink-0 ${
                isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-muted)]"
              }`}>
                {i + 1}
              </span>

              {/* Logo */}
              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/40 flex items-center justify-center">
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  width={36}
                  height={36}
                  className="w-full h-full object-contain p-1"
                  unoptimized={logo.endsWith(".svg")}
                />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{name}</p>
                  {isBest && (
                    <span className="shrink-0 text-2xs text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                      Best
                    </span>
                  )}
                </div>
                <p className={`text-2xs mt-0.5 ${
                  q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface-variant)]"
                }`}>
                  {feeLabel} · {q.transferSpeed}
                </p>
              </div>

              {/* Receive amount */}
              <div className="text-right shrink-0 hidden sm:block">
                <p className={`text-sm font-bold tabular-nums ${
                  isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"
                }`}>
                  {recvSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-2xs text-[var(--color-on-surface-variant)]">recipient gets</p>
              </div>

              {/* CTA */}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConverterProviderClicked(q.providerSlug, corridor, i + 1)}
                className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-4 text-2sm font-semibold rounded-full transition-all shadow-sm hover:shadow ${
                  isBest
                    ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)]"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                }`}
              >
                <span className="hidden sm:inline">Send</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 sm:px-6 py-3 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)] flex items-center justify-between gap-3 flex-wrap">
        <p className="text-2xs text-[var(--color-on-surface-variant)]">
          Rates updated every 6 hours · Rankings by recipient amount received
        </p>
        <Link
          href={seeAllHref}
          onClick={() => trackConverterCTAClicked(corridor, amount)}
          className="text-2xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          Compare all providers →
        </Link>
      </div>
    </div>
  );
}
