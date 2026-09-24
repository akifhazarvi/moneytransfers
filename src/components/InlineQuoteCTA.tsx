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
      data-pc="1"
      onClick={() => trackProviderClicked(providerSlug, corridor, rank, source)}
      className={`conversion-button inline-quotes-action ${isBest ? "conversion-button--accent" : "inline-quotes-action--secondary"}${fullWidth ? " inline-quotes-action--full" : ""}`}
      aria-label={`View offer from ${providerName} (opens in a new tab)`}
    >
      <span>View offer</span>
      <svg aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}
