"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import { providers, getProviderName, type TransferQuote } from "@/data/providers";
import { trackProviderExpanded } from "@/lib/analytics";
import { getGoUrl } from "@/lib/affiliate";
import type { ProviderInsight, ProviderBadge, SparklinePoint } from "@/lib/rate-history-types";
import { ProviderRateInsightLine } from "./RateInsight";
import { providerLogo } from "@/lib/provider-logo";
import { companyPageRenders } from "@/lib/company-route";
import ProviderLink from "@/components/ProviderLink";
import TiedNote from "@/components/TiedNote";

interface Props {
  quote: TransferQuote;
  sendCurrencySymbol: string;
  receiveCurrencySymbol: string;
  rank: number;
  compareSelected?: boolean;
  onCompareToggle?: (slug: string) => void;
  compareDisabled?: boolean;
  midMarketRate?: number;
  extraReceiveVsWorst?: number;
  providerInsight?: ProviderInsight | null;
  sparklineData?: SparklinePoint[];
  badge?: ProviderBadge;
  tiedAhead?: boolean;
  isBestValue?: boolean;
}

export default function ProviderCard({ quote, sendCurrencySymbol, receiveCurrencySymbol, rank, compareSelected, onCompareToggle, compareDisabled, midMarketRate, providerInsight, sparklineData, tiedAhead, isBestValue = rank === 1 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const provider = providers.find(p => p.slug === quote.providerSlug);
  const name = provider?.name || getProviderName(quote.providerSlug);
  const fee = quote.fee === 0 ? "No transfer fee" : `${sendCurrencySymbol}${quote.fee.toFixed(2)}`;
  const href = getGoUrl(quote.providerSlug, {
    sourceCurrency: quote.sendCurrency, targetCurrency: quote.receiveCurrency,
    sourceAmount: quote.sendAmount, clickref: "results",
  });
  return (
    <article className={`conversion-result${isBestValue ? " conversion-result--best" : ""}`} data-provider={quote.providerSlug}>
      <div className="conversion-result-brand">
        <Image src={providerLogo(quote.providerSlug, provider?.logo)} alt="" width={48} height={48} className="conversion-logo" />
        <div>
          <div className="conversion-result-name"><h3>{name}</h3>{isBestValue && <span className="conversion-tag">Best value</span>}</div>
          <p className="conversion-result-rating">{quote.rating > 0 && <><Star size={12} aria-hidden="true" />{quote.rating.toFixed(1)} <span>on Trustpilot</span></>}{quote.isIndicative && <span>Indicative quote</span>}</p>
        </div>
      </div>
      <div className="conversion-result-payout">
        <span>{quote.isIndicative ? "Indicative recipient amount" : "Recipient gets"}</span>
        <strong>{receiveCurrencySymbol}{quote.receiveAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        <small>{quote.receiveCurrency} · after transfer fees</small>
      </div>
      <dl className="conversion-result-facts">
        <div><dt>Transfer fee</dt><dd>{fee}</dd></div>
        <div><dt>Exchange rate</dt><dd>{quote.exchangeRate.toFixed(4)}</dd></div>
        <div><dt>Delivery estimate</dt><dd>{quote.transferSpeed}</dd></div>
      </dl>
      <div className="conversion-result-action">
        <ProviderLink href={href} provider={quote.providerSlug} source="comparison_result" corridor={`${quote.sendCurrency}-${quote.receiveCurrency}`} rank={rank} className={`conversion-button${isBestValue ? " conversion-button--accent" : ""}`}>
          {quote.isIndicative ? "Request a quote" : `Continue with ${name}`}<ArrowRight size={16} aria-hidden="true" />
        </ProviderLink>
        <span>Complete your transfer with {name}</span>
      </div>
      <div className="conversion-result-footer">
        <button type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => { setExpanded(!expanded); if (!expanded) trackProviderExpanded(quote.providerSlug, rank, `${quote.sendCurrency}-${quote.receiveCurrency}`); }}>
          {expanded ? "Less detail" : "Transfer details"}<ChevronDown size={14} aria-hidden="true" style={{ transform: expanded ? "rotate(180deg)" : undefined }} />
        </button>
        {onCompareToggle && <label><input type="checkbox" checked={!!compareSelected} disabled={compareDisabled && !compareSelected} onChange={() => onCompareToggle(quote.providerSlug)} />Compare side by side</label>}
      </div>
      {expanded && <div className="conversion-result-details" id={detailsId}>
        {tiedAhead && <TiedNote rating={quote.rating} />}
        {midMarketRate && <p>Mid-market reference: {midMarketRate.toFixed(4)} {quote.receiveCurrency} per {quote.sendCurrency}. The final rate and delivery time are confirmed by {name}.</p>}
        {provider?.paymentMethods.length ? <p><strong>Pay with:</strong> {provider.paymentMethods.join(" · ")}</p> : null}
        {quote.promoNote && <p>{quote.promoNote}</p>}
        {providerInsight && sparklineData && <ProviderRateInsightLine insight={providerInsight} sparklineData={sparklineData} toCurrency={quote.receiveCurrency} />}
        {companyPageRenders(quote.providerSlug) && <Link href={`/companies/${quote.providerSlug}`} className="conversion-text-link">Read our {name} review <ArrowRight size={14} aria-hidden="true" /></Link>}
      </div>}
    </article>
  );
}
