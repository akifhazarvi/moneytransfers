import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import ProviderLink from "@/components/ProviderLink";
import ConversionImpression from "@/components/ConversionImpression";
import { getGoUrl } from "@/lib/affiliate";
import { providerLogo } from "@/lib/provider-logo";

export interface PartnerQuote {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  fee: number;
  transferSpeed?: string;
  worstReceiveAmount?: number;
  providerCount?: number;
  isBest?: boolean;
}

export default function PartnerFeatureBlock({ source, variant = "section", quote, linkContext }: {
  source: string;
  variant?: "section" | "inline" | "card";
  quote?: PartnerQuote;
  linkContext?: { from: string; to: string; amount: number };
}) {
  const context = linkContext ?? (quote ? { from: quote.fromCurrency, to: quote.toCurrency, amount: quote.sendAmount } : undefined);
  const href = getGoUrl("taptap-send", context ? { sourceCurrency: context.from, targetCurrency: context.to, sourceAmount: context.amount, clickref: source } : undefined);
  const corridor = context ? `${context.from}-${context.to}` : "";
  const money = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const card = <aside className="conversion-spotlight" aria-label="TapTap Send paid partner spotlight">
    <ConversionImpression source={source} corridor={corridor} />
    <div className="conversion-spotlight-heading">
      <Image src={providerLogo("taptap-send")} alt="" width={48} height={48} className="conversion-logo" />
      <div><span className="conversion-eyebrow">Paid partner spotlight</span><h2>Meet TapTap Send.</h2></div>
    </div>
    <p>A money transfer app for sending to family and friends. Check your destination, delivery options, and final price before you send.</p>
    {quote && <div className="conversion-spotlight-quote">
      <div><span>You send</span><strong>{money(quote.sendAmount)} {quote.fromCurrency}</strong></div>
      <span aria-hidden="true">→</span>
      <div><span>Recipient gets</span><strong>{money(quote.receiveAmount)} {quote.toCurrency}</strong></div>
      <small>Transfer fee: {money(quote.fee)} {quote.fromCurrency} · Exchange rate: {quote.exchangeRate.toFixed(4)}. Confirm the latest quote in the app.</small>
    </div>}
    <div className="conversion-spotlight-actions">
      <ProviderLink href={href} provider="taptap-send" source={source} corridor={corridor} className="conversion-button conversion-button--accent">Check TapTap Send <span aria-hidden="true">↗</span></ProviderLink>
      <Link href="/companies/taptap-send" className="conversion-text-link">Read our TapTap Send review →</Link>
    </div>
    <p className="conversion-disclosure">We earn a commission through this link. Paid placement does not determine comparison rankings. Availability and fees vary by route.</p>
  </aside>;
  return variant === "section" ? <section className="py-8"><Container>{card}</Container></section> : card;
}
