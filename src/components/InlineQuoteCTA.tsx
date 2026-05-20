"use client";

import { trackProviderClicked } from "@/lib/analytics";
import { getGoUrl } from "@/lib/affiliate";

interface Props {
  providerSlug: string;
  providerName: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  rank: number;
  isBest: boolean;
  source: string;
  fullWidth?: boolean;
}

export default function InlineQuoteCTA({
  providerSlug,
  providerName,
  sendCurrency,
  receiveCurrency,
  sendAmount,
  rank,
  isBest,
  source,
  fullWidth = false,
}: Props) {
  const href = getGoUrl(providerSlug, {
    sourceCurrency: sendCurrency,
    targetCurrency: receiveCurrency,
    sourceAmount: sendAmount,
    clickref: source,
  });
  const corridor = `${sendCurrency}-${receiveCurrency}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      onClick={() => trackProviderClicked(providerSlug, corridor, rank, source)}
      className={`inline-flex items-center justify-center gap-1.5 ${fullWidth ? "w-full h-10" : "h-9 px-4"} text-2sm font-semibold rounded-full transition-colors ${
        isBest
          ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)]"
          : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
      }`}
      aria-label={`Send with ${providerName}`}
    >
      {fullWidth ? (
        `Send with ${providerName}`
      ) : (
        <>
          <span className="hidden sm:inline">Send with {providerName}</span>
          <span className="sm:hidden">Send</span>
        </>
      )}
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}
