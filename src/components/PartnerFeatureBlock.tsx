import Link from "@/components/EligibleLink";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Container from "@/components/Container";
import ProviderLink from "@/components/ProviderLink";
import ConversionImpression from "@/components/ConversionImpression";
import { getGoUrl } from "@/lib/affiliate";
import { providerLogo } from "@/lib/provider-logo";
import appRatings from "@/data/scraped/app-store-ratings.json";
import trustpilotRatings from "@/data/scraped/trustpilot-ratings.json";
import tapTapSendCurrencies from "@/data/scraped/taptap-send-currencies.json";

/** Currencies TapTap sends from, written by scripts/scrape-taptapsend.ts. */
const TAPTAP_SENDS_FROM: ReadonlySet<string> = new Set(tapTapSendCurrencies as string[]);

/**
 * Whether the TapTap ad may run for a sender currency. Fewer than 5 codes means
 * the list failed to load — show the ad rather than hide TapTap everywhere.
 */
export function tapTapSendsFrom(currency: string): boolean {
  return TAPTAP_SENDS_FROM.size < 5 || TAPTAP_SENDS_FROM.has(currency);
}

// Measured social proof, never typed: TapTap's Trustpilot score from the
// reviews scrape, then its App Store and Google Play scores. Each part is
// dropped when its scrape has no row, and the line when none do.
const APP_PROOF = (() => {
  const k = (n: number) => `${Math.round(n / 1000).toLocaleString("en-US")}K`;
  const tp = (trustpilotRatings as { slug: string; score: number | null; totalReviews: number | null }[]).find((x) => x.slug === "taptap-send");
  const r = (appRatings as { slug: string; apple?: { score: number; ratingCount: number } | null; googlePlay?: { score: number; ratingCount: number } | null }[]).find((x) => x.slug === "taptap-send");
  const parts = [
    tp?.score != null && `${tp.score.toFixed(1)} Trustpilot${tp.totalReviews ? ` (${k(tp.totalReviews)} reviews)` : ""}`,
    r?.apple && `${r.apple.score.toFixed(1)} App Store`,
    r?.googlePlay && `${r.googlePlay.score.toFixed(1)} Google Play`,
  ].filter(Boolean);
  return parts.join(" · ");
})();

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
  // Only where TapTap sends from this currency. On Saudi pages the card said
  // "Send 3,000 SAR with TapTap", a dead end: TapTap sends from ~15 currencies
  // and SAR is not one. Fewer than 5 means the list failed to load — show the
  // card rather than hide TapTap everywhere.
  if (context && !tapTapSendsFrom(context.from)) return null;
  const href = getGoUrl("taptap-send", context ? { sourceCurrency: context.from, targetCurrency: context.to, sourceAmount: context.amount, clickref: source } : undefined);
  const corridor = context ? `${context.from}-${context.to}` : "";
  const money = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const feeText = quote ? (quote.fee === 0 ? "No transfer fee" : `${money(quote.fee)} ${quote.fromCurrency} fee`) : "";
  const cta = context ? `Send ${money(context.amount)} ${context.from} with TapTap` : "Get TapTap Send";
  const card = <aside className="conversion-spotlight" aria-label="Sponsored: TapTap Send">
    <ConversionImpression source={source} corridor={corridor} />
    <div className="conversion-spotlight-heading">
      <Image src={providerLogo("taptap-send")} alt="" width={48} height={48} className="conversion-logo" />
      {/* Not a heading: this block renders on 100+ pages, and a shared <h2> near
          the top read to the round-2 SEO audit as templated structure. */}
      <div>
        <div className="conversion-spotlight-namerow"><p className="conversion-spotlight-title">TapTap Send</p><span className="conversion-sponsored">Sponsored</span></div>
        {APP_PROOF && <p className="conversion-spotlight-proof"><Star size={12} aria-hidden="true" />{APP_PROOF}</p>}
      </div>
    </div>
    {/* The live quote, where there is one — the same row the comparison ranks,
        so the ad can never quote a better number than the table does. */}
    {quote && <div className="conversion-spotlight-payout">
      <span>Recipient gets</span>
      <strong>{quote.receiveAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quote.toCurrency}</strong>
      <small>for {money(quote.sendAmount)} {quote.fromCurrency} · {feeText} · rate {quote.exchangeRate.toFixed(4)}</small>
    </div>}
    <div className="conversion-spotlight-actions">
      <ProviderLink href={href} provider="taptap-send" source={source} corridor={corridor} className="conversion-button conversion-button--accent">{cta} <ArrowRight size={16} aria-hidden="true" /></ProviderLink>
      <Link href="/companies/taptap-send" unlinked="hide" className="conversion-text-link">Read our TapTap Send review</Link>
    </div>
    <p className="conversion-disclosure">Sponsored: TapTap Send pays us when you sign up. Payment never moves a provider up our comparison.</p>
  </aside>;
  return variant === "section" ? <section className="py-8"><Container>{card}</Container></section> : card;
}
