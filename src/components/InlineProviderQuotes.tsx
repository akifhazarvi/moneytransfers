import Image from "next/image";
import { getProviderName, providers, type TransferQuote } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";
import InlineQuoteCTA from "./InlineQuoteCTA";
import SeeAllProvidersLink from "./SeeAllProvidersLink";
import { providerLogo } from "@/lib/provider-logo";
import ProviderCrossSell from "@/components/ProviderCrossSell";
import PartnerFeatureBlock from "@/components/PartnerFeatureBlock";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { partnerQuoteFrom } from "@/lib/partner-quote";
import { crossSellComparisonHref } from "@/lib/provider-cross-sell";
import { quoteFreshness } from "@/lib/quote-freshness";

interface Props {
  from?: string;
  to?: string;
  amount?: number;
  source: string;
  heading?: string;
  subheading?: string;
  /**
   * Restrict the table to a provider set. Business and large-transfer guides
   * pass BUSINESS_FX_SLUGS: ranking purely by receive amount put consumer
   * remittance apps (TapTap Send, Remitly, LemFI) at the top of a page about
   * paying suppliers, which is the same mismatch {{BUSINESS_QUOTE_TABLE}} was
   * built to fix on the business pages. Omit for consumer corridors.
   */
  only?: readonly string[];
  /**
   * Whether to render a partner unit above the table. Default true — it is
   * the only one on tools, IBAN, SWIFT, bank, travel and news pages. Guides
   * pass false: they already carry PartnerFeatureBlock's ad further down, so
   * this was a second, numberless copy of it on all 123 of them.
   */
  crossSell?: boolean;
  /** Rows to show (default 5). News shows 3: a short live check under a story. */
  limit?: number;
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
  only,
  crossSell = true,
  limit = 5,
}: Props) {
  const all = generateQuotes(amount, from, to);
  const scoped = only ? all.filter((q) => only.includes(q.providerSlug)) : all;
  const quotes: TransferQuote[] = scoped.slice(0, limit);
  if (quotes.length === 0) return null;

  const sendSymbol = symbolFor(from);
  const recvSymbol = symbolFor(to);
  const seeAllHref = crossSellComparisonHref(only ? "business" : "personal", { from, to, amount });
  const corridor = `${from}-${to}`;
  // source is "guide:<slug>" or a plain surface name — extract slug if present
  const pageSlug = source.startsWith("guide:") ? source.slice(6) : source;
  const best = quotes[0];
  const measured = quotes.filter((quote) => !quote.isIndicative);
  const payouts = measured.map((quote) => quote.receiveAmount);
  const savings = payouts.length > 1 ? Math.max(...payouts) - Math.min(...payouts) : 0;
  const freshness = quoteFreshness(quotes);
  const formatAmount = (value: number) => value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
    {/* Partner unit above the table. Consumer corridors get the live-rate ad;
        business pages keep the cross-sell card, because the ad's partner is a
        consumer remittance app and `only` exists precisely to keep those off a
        page about paying suppliers.

        When the partner already ranks #1 in the table directly below, the ad
        is replaced by the bare disclosure rather than dropped. It cannot just
        be omitted: 7 of the 11 pages embedding this component — /iban,
        /swift-codes, /news, the three /tools and /exchange-rates — carry no
        <AffiliateDisclosure /> of their own, so this block's footnote is the
        only commercial disclosure on them, and removing it would strip the
        disclosure from a ranked table of affiliate links. Swapping keeps the
        page honest while still showing the partner once instead of twice. */}
    {crossSell && (only
      ? (
        <ProviderCrossSell
          source={source} placement="inline" context={{ from, to, amount }}
          eligible={scoped.map((quote) => quote.providerSlug)}
          intent="business"
        />
      )
      : best.providerSlug === "taptap-send"
      ? (
        <div className="my-10"><AffiliateDisclosure /></div>
      )
      : (
        <PartnerFeatureBlock
          source={`partner_inline:${source}`}
          variant="card"
          quote={partnerQuoteFrom(all, from, to)}
          linkContext={{ from, to, amount }}
        />
      )
    )}
    <aside className="inline-quotes" aria-label="Provider rate comparison">
      <header className="inline-quotes-header">
        <div>
          <p className="conversion-eyebrow">Provider comparison · {from} → {to}</p>
          <h3>{heading || `Compare providers for ${sendSymbol}${amount.toLocaleString("en-US")} ${from}`}</h3>
          {subheading && <p className="inline-quotes-subheading">{subheading}</p>}
        </div>
        <SeeAllProvidersLink href={seeAllHref} corridor={corridor} source="header" slug={pageSlug} className="conversion-text-link">
          Compare all <span aria-hidden="true">→</span>
        </SeeAllProvidersLink>
      </header>

      <ol className="inline-quotes-list">
        {quotes.map((q, i) => {
          const name = getProviderName(q.providerSlug);
          const provider = providers.find((p) => p.slug === q.providerSlug);
          const logo = providerLogo(q.providerSlug, provider?.logo);
          const isBest = i === 0 && !q.isIndicative;
          return (
            <li key={q.providerSlug} className="inline-quotes-row">
              <div className="inline-quotes-brand">
                <Image src={logo} alt="" width={40} height={40} className="conversion-logo" unoptimized={logo.endsWith(".svg")} />
                <div>
                  <div className="inline-quotes-name"><strong>{name}</strong>{isBest && <span className="conversion-tag">Best value</span>}</div>
                  <p>{q.isIndicative ? "Fee confirmed by provider" : `Fee: ${sendSymbol}${formatAmount(q.fee)} ${from}`} · {q.transferSpeed}</p>
                </div>
              </div>
              <div className="inline-quotes-payout">
                <span>{q.isIndicative ? "Indicative payout" : "Recipient gets"}</span>
                <strong>{recvSymbol}{formatAmount(q.receiveAmount)}</strong>
                <small>{to}</small>
              </div>
              <InlineQuoteCTA providerSlug={q.providerSlug} providerName={name} sendCurrency={q.sendCurrency}
                receiveCurrency={q.receiveCurrency} sendAmount={q.sendAmount} rank={i + 1}
                isBest={isBest} source={source} />
            </li>
          );
        })}
      </ol>

      <footer className="inline-quotes-footer">
        {/* One line: this caption renders under every inline table, so each
            word here is repeated site-wide. The tie-break rule it used to
            spell out is on /editorial-policy. */}
        <p>
          {savings > 0 && <>Spread <strong>{recvSymbol}{formatAmount(savings)}</strong>. </>}
          Ranked by payout{freshness.oldest && !freshness.undated
            ? <>, priced <time dateTime={freshness.oldest}>{new Date(freshness.oldest).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}</time></>
            : ""}.
        </p>
      </footer>
    </aside>
    </>
  );
}
