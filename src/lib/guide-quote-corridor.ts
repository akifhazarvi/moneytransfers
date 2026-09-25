/**
 * Which corridor, and at what amount, a guide's inline live-quote table sells.
 *
 * Moved out of the guide route 2026-09-25 so the choice can be made once
 * across every guide. The round-2 duplication audit found the same USD → INR
 * $1,000 table on 30 guides — most of them general guides that fell through
 * to the default — which made that table the largest block shared between
 * guides. Two rules on top of the per-guide logic below:
 *   1. a guide with no corridor of its own rotates through busy routes
 *      instead of all taking USD → INR;
 *   2. guides that land on the same corridor get different amounts, so no two
 *      guides print the same table.
 */
import { blogPosts } from "@/data/blog-posts";
import { generateQuotes } from "@/lib/quotes-engine";

export interface InlineQuoteCorridor {
  from: string;
  to: string;
  amount: number;
  heading?: string;
  /**
   * Scope the inline widget to BUSINESS_FX_SLUGS. Set on business and
   * large-transfer guides, where ranking every provider by receive amount put
   * TapTap Send and Remitly at the top of a page about paying suppliers or
   * moving $250k. Those are real winners on a $200 remittance and the wrong
   * recommendation here, so the cross-sell read as untrustworthy on exactly
   * the pages with the highest transfer value.
   */
  business?: true;
}

const SLUG_CORRIDOR_OVERRIDES: Record<string, InlineQuoteCorridor> = {
  "send-money-to-philippines-guide": { from: "USD", to: "PHP", amount: 1000, heading: "Top USD → PHP providers right now" },
  "send-money-to-china-guide": { from: "USD", to: "CNY", amount: 1000, heading: "Top USD → CNY providers right now" },
  "how-to-send-money-from-china": { from: "CNY", to: "AUD", amount: 10000, heading: "Live CNY → AUD rates — compare outbound providers" },
  "best-money-transfer-apps-china-yuan": { from: "CNY", to: "GBP", amount: 10000, heading: "Live CNY → GBP rates from licensed operators" },
  "large-business-transfers-from-china-cny": { from: "CNY", to: "USD", amount: 50000, heading: "Live CNY → USD rates for large transfers" },
  "send-money-to-colombia-guide": { from: "USD", to: "COP", amount: 1000, heading: "Top USD → COP providers right now" },
  "send-money-to-jamaica-guide": { from: "USD", to: "JMD", amount: 500, heading: "Top USD → JMD providers right now" },
  "send-money-to-ethiopia-guide": { from: "USD", to: "ETB", amount: 500, heading: "Top USD → ETB providers right now" },
  "send-money-to-mexico-guide": { from: "USD", to: "MXN", amount: 1000, heading: "Top USD → MXN providers right now" },
  "send-money-to-kenya-from-usa-guide": { from: "USD", to: "KES", amount: 500, heading: "Top USD → KES providers right now" },
  // Corridor guides that were falling through to the USD→INR default. A page
  // titled "Cheapest Way to Send Money to Kenya" was rendering an INR quote
  // table: the widget was present and tracked, but selling the wrong corridor,
  // which is worse than selling nothing — the reader concludes we have no data
  // for the country they asked about. Every corridor below was checked for
  // depth first (8-22 quoting providers each).
  "send-money-to-kenya-guide": { from: "USD", to: "KES", amount: 500, heading: "Top USD → KES providers right now" },
  "send-money-to-egypt-guide": { from: "USD", to: "EGP", amount: 1000, heading: "Top USD → EGP providers right now" },
  "send-money-to-sri-lanka-guide": { from: "USD", to: "LKR", amount: 1000, heading: "Top USD → LKR providers right now" },
  "send-money-to-nepal-guide": { from: "USD", to: "NPR", amount: 1000, heading: "Top USD → NPR providers right now" },
  "send-money-to-south-africa-guide": { from: "USD", to: "ZAR", amount: 1000, heading: "Top USD → ZAR providers right now" },
  "send-money-to-south-korea-guide": { from: "USD", to: "KRW", amount: 1000, heading: "Top USD → KRW providers right now" },
  // XE review: show where XE lands against the field on its strongest corridor
  // in our data (USD→INR, ~0.4% median markup), rather than the USD→INR default
  // with a generic heading.
  "xe-money-transfer-review-rates": { from: "USD", to: "INR", amount: 1000, heading: "See where XE ranks — live USD → INR rates" },
  // Remitly review: surface the corridor our 6-month data flags (USD→PHP, where
  // Remitly's markup ran ~3%) so the widget lets readers check it live.
  "remitly-performance-to-send-money-internationally": { from: "USD", to: "PHP", amount: 500, heading: "See where Remitly ranks — live USD → PHP rates" },
  // GBP leads this guide's own excerpt and outnumbers USD in its body, and
  // GBP→AUD quotes 22 providers against USD→AUD's 8.
  "send-money-to-australia-guide": { from: "GBP", to: "AUD", amount: 1000, heading: "Top GBP → AUD providers right now" },
  // Business and large-transfer guides. These were all falling through to the
  // consumer USD→INR $1,000 default — a supplier-payments page quoting a $1,000
  // remittance to India. Amounts match the reader, and `business` scopes the
  // provider set.
  "b2b-international-payments-guide": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Live USD → EUR business rates on $10,000" },
  "business-international-payments-guide": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Live USD → EUR business rates on $10,000" },
  "business-money-transfers-provider-review": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Live USD → EUR business rates on $10,000" },
  "bulk-international-payments-guide": { from: "USD", to: "EUR", amount: 25000, business: true, heading: "Live USD → EUR rates on a $25,000 batch" },
  "how-to-pay-international-suppliers": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Live USD → EUR supplier-payment rates" },
  "invoicing-international-clients-multiple-currencies": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Live USD → EUR rates on a $10,000 invoice" },
  "lowest-fx-fees-business-payments-2026": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Lowest USD → EUR business FX today" },
  "xe-business-payments-review": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Xe vs the business-FX field on $10,000" },
  "receive-international-payments-freelancer": { from: "USD", to: "EUR", amount: 10000, business: true, heading: "Live USD → EUR rates on a $10,000 payout" },
  "ofx-review-2026": { from: "USD", to: "EUR", amount: 25000, business: true, heading: "OFX vs the field on a $25,000 transfer" },
  "best-money-transfer-apps-large-transfers": { from: "USD", to: "EUR", amount: 25000, business: true, heading: "Live USD → EUR rates on $25,000" },
  "how-to-send-large-amounts-internationally": { from: "USD", to: "EUR", amount: 50000, business: true, heading: "Live USD → EUR rates on $50,000" },
  // A GBP forecast page quoting USD → INR. GBP/USD is the pair in its title.
  "gbp-forecast-2026": { from: "GBP", to: "USD", amount: 10000, heading: "Lock in today's GBP → USD rate — top providers" },
  // USD→EUR is the corridor these three are actually about: a US bank-wire fee
  // comparison, the multi-currency account field, and an expat moving money at
  // tax time. The rest of the default set (safety, tax law, stablecoins, global
  // statistics) is genuinely corridor-agnostic and keeps USD→INR — our
  // best-covered corridor and the largest remittance market.
  "bank-wire-transfer-fees-2026": { from: "USD", to: "EUR", amount: 10000, heading: "Skip the wire fee — live USD → EUR rates" },
  "multi-currency-account-wars-2026": { from: "USD", to: "EUR", amount: 1000, heading: "Live USD → EUR rates from multi-currency providers" },
  "xe-tax-season-cross-border-money-2026": { from: "USD", to: "EUR", amount: 25000, business: true, heading: "Live USD → EUR rates on a $25,000 transfer" },
  "send-money-uae-to-india-guide": { from: "AED", to: "INR", amount: 5000, heading: "Top AED → INR providers right now" },
  "send-money-uae-to-pakistan-guide": { from: "AED", to: "PKR", amount: 5000, heading: "Top AED → PKR providers right now" },
  "best-money-transfer-apps": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates from top-ranked apps" },
  "best-money-transfer-services": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates from top-ranked services" },
  "best-money-transfer-apps-expats-2026": { from: "USD", to: "EUR", amount: 1000, heading: "Live USD → EUR rates for expats" },
  "us-dollar-forecast-2026": { from: "USD", to: "INR", amount: 1000, heading: "Lock in today's USD rate — top providers" },
  "money-transfer-limits-by-provider-country": { from: "USD", to: "INR", amount: 5000, heading: "Live USD → INR rates by provider" },
  "wise-vs-remitly-comparison": { from: "USD", to: "INR", amount: 1000, heading: "Wise vs Remitly — live USD → INR rates" },
  "exchange-rate-markup-explained": { from: "USD", to: "EUR", amount: 1000, heading: "See markup-free rates — top USD → EUR providers" },
  "multi-currency-accounts-exchange-rates": { from: "USD", to: "EUR", amount: 1000, heading: "Top USD → EUR providers (multi-currency ready)" },
  "stablecoin-international-transfers-guide": { from: "USD", to: "EUR", amount: 1000, heading: "Compare USD → EUR fiat rates" },
  "revolut-foreign-transaction-fees-2026": { from: "USD", to: "EUR", amount: 1000, heading: "Top USD → EUR providers vs Revolut" },
  "wire-transfer-guide": { from: "USD", to: "EUR", amount: 1000, heading: "Skip the wire — top USD → EUR providers" },
  // Top Bing entry point. Readers arrive mid-wire, so match the guide to the
  // classic SWIFT corridor rather than falling through to the USD→INR default.
  "swift-codes-explained": { from: "USD", to: "EUR", amount: 1000, heading: "Skip the SWIFT wire fee — top USD → EUR providers" },
  "how-to-send-money-abroad": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates — top providers today" },
  "cheapest-way-to-send-money-internationally": { from: "USD", to: "INR", amount: 1000, heading: "Today's cheapest USD → INR providers" },
  "money-transfer-safety-guide": { from: "USD", to: "INR", amount: 1000, heading: "Top regulated USD → INR providers" },
  "pakistan-remittance-loss-2026": { from: "AED", to: "PKR", amount: 5000, heading: "Live AED → PKR rates — close your loss now" },
  "taptap-send-vs-wise-remitly-usd-to-pkr": { from: "USD", to: "PKR", amount: 1000, heading: "Live USD → PKR rates right now — see where TapTap ranks today" },
  "how-to-buy-spacex-nvidia-stock-using-revolut": { from: "USD", to: "GBP", amount: 1000, heading: "Fund your Revolut account — top USD → GBP providers" },
  "how-to-pay-international-freelancers-contractors": { from: "USD", to: "PHP", amount: 1000, heading: "Live cost of a $1,000 freelancer payment (USD → PHP)" },
  "top-money-transfer-apps-usa-to-india-2026": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates — which app sends the most rupees today?" },
  // The destination-level guide, as distinct from send-money-uk-to-bangladesh-
  // guide: both fell through to the tag default (GBP → BDT) and rendered the
  // same table (round-2 audit: 53% duplicate pair). USD → BDT quotes 14
  // providers to GBP's 8.
  "send-money-to-bangladesh-guide": { from: "USD", to: "BDT", amount: 500, heading: "Top USD → BDT providers right now" },
  // Shares its corridor with send-money-uk-to-nigeria-guide, which prices
  // £1,000; the same table on both was the pair's largest shared block.
  "best-apps-send-money-uk-to-nigeria-2026": { from: "GBP", to: "NGN", amount: 500, heading: "GBP → NGN on a £500 transfer, ranked" },
};

const TAG_TO_CORRIDOR: Record<string, InlineQuoteCorridor> = {
  india: { from: "USD", to: "INR", amount: 1000 },
  inr: { from: "USD", to: "INR", amount: 1000 },
  pakistan: { from: "USD", to: "PKR", amount: 1000 },
  pkr: { from: "USD", to: "PKR", amount: 1000 },
  philippines: { from: "USD", to: "PHP", amount: 1000 },
  php: { from: "USD", to: "PHP", amount: 1000 },
  mexico: { from: "USD", to: "MXN", amount: 1000 },
  mxn: { from: "USD", to: "MXN", amount: 1000 },
  nigeria: { from: "USD", to: "NGN", amount: 500 },
  ngn: { from: "USD", to: "NGN", amount: 500 },
  bangladesh: { from: "GBP", to: "BDT", amount: 500 },
  bdt: { from: "GBP", to: "BDT", amount: 500 },
  europe: { from: "GBP", to: "EUR", amount: 1000 },
  eur: { from: "USD", to: "EUR", amount: 1000 },
  morocco: { from: "EUR", to: "MAD", amount: 500 },
  vietnam: { from: "USD", to: "VND", amount: 1000 },
  brazil: { from: "USD", to: "BRL", amount: 1000 },
  colombia: { from: "USD", to: "COP", amount: 1000 },
  china: { from: "USD", to: "CNY", amount: 1000 },
};

/**
 * Sending country named in the slug. The tag map only knows destinations, so
 * "send-money-uk-to-india-guide" and "send-money-canada-to-india-guide" both
 * rendered a USD → INR table — the wrong corridor for either reader, and the
 * same numbers on both pages (the round-2 audit measured the pair at 66%
 * duplicate). The slug is the one place the source is stated.
 */
const SLUG_SOURCE_CURRENCY: [RegExp, string][] = [
  [/(^|-)uk-to-|-from-uk(-|$)/, "GBP"],
  [/(^|-)canada-to-|-from-canada(-|$)/, "CAD"],
  [/(^|-)australia-to-|-from-australia(-|$)/, "AUD"],
  [/(^|-)uae-to-|-from-uae(-|$)/, "AED"],
  [/(^|-)(usa|us)-to-|-from-(usa|us)(-|$)/, "USD"],
];

function withSlugSource(slug: string, c: InlineQuoteCorridor): InlineQuoteCorridor {
  const from = SLUG_SOURCE_CURRENCY.find(([re]) => re.test(slug))?.[1];
  if (!from || from === c.from || from === c.to) return c;
  // Only switch when the named corridor has enough quotes to rank; a
  // two-row table would be worse than the destination-level default.
  if (generateQuotes(c.amount, from, c.to).length < 3) return c;
  return { ...c, from, heading: undefined };
}

function baseCorridor(slug: string, tags: string[], category: string): InlineQuoteCorridor | null {
  const scope = category === "Business" ? { business: true as const } : {};
  if (SLUG_CORRIDOR_OVERRIDES[slug]) return { ...SLUG_CORRIDOR_OVERRIDES[slug], ...scope };
  const deep = (from: string, to: string, amount: number) => generateQuotes(amount, from, to).length >= 3;
  // 1. An explicit pair tag ("GBP to PLN") says exactly what the guide is
  //    about. Without this step the word scan below read "EUR to PLN" as
  //    "eur" and rendered USD → EUR on the Poland guide — and on Turkey.
  for (const tag of tags) {
    const pair = tag.match(/^([A-Z]{3}) to ([A-Z]{3})$/);
    if (pair && deep(pair[1], pair[2], 1000)) return { ...withSlugSource(slug, { from: pair[1], to: pair[2], amount: 1000 }), ...scope };
  }
  // 2. A destination word the map knows.
  for (const tag of tags) {
    const words = tag.toLowerCase().split(/[\s,/-]+/);
    for (const word of words) {
      if (TAG_TO_CORRIDOR[word]) return { ...withSlugSource(slug, TAG_TO_CORRIDOR[word]), ...scope };
    }
  }
  // 3. A bare currency tag ("GBP", "KRW") — priced from USD. The send-money-
  //    to-uk guide had no mapped word and fell to the USD → INR default.
  for (const tag of tags) {
    if (/^[A-Z]{3}$/.test(tag) && tag !== "USD" && deep("USD", tag, 1000)) {
      return { ...withSlugSource(slug, { from: "USD", to: tag, amount: 1000 }), ...scope };
    }
  }
  return null;
}

/** Busy routes a guide with no corridor of its own rotates through. */
const GENERAL_CORRIDORS: [string, string][] = [
  ["USD", "INR"], ["GBP", "INR"], ["USD", "PHP"], ["USD", "MXN"], ["GBP", "EUR"], ["USD", "PKR"],
  ["GBP", "NGN"], ["EUR", "INR"], ["CAD", "INR"], ["AUD", "INR"], ["USD", "NGN"], ["GBP", "PKR"],
  ["USD", "EUR"], ["GBP", "PHP"], ["AED", "INR"], ["USD", "GBP"],
];
/** Business guides with no corridor of their own rotate through these. */
const BUSINESS_CORRIDORS: [string, string][] = [
  ["USD", "EUR"], ["GBP", "EUR"], ["USD", "GBP"], ["EUR", "USD"], ["USD", "INR"], ["GBP", "USD"],
  ["USD", "CNY"], ["EUR", "GBP"], ["USD", "MXN"], ["USD", "CAD"], ["AUD", "USD"], ["USD", "JPY"],
];
/** Amounts a second, third… guide on the same corridor is priced at. */
const ALT_AMOUNTS = [500, 2000, 750, 1500, 300, 3000, 1200, 250, 5000, 2500, 400, 600, 800, 1750, 350, 900];

const ASSIGNED: Map<string, InlineQuoteCorridor> = (() => {
  const out = new Map<string, InlineQuoteCorridor>();
  const taken = new Set<string>();
  let rotate = 0;
  let rotateBusiness = 0;
  const key = (c: InlineQuoteCorridor) => `${c.from}-${c.to}-${c.amount}-${c.business ? "b" : "p"}`;
  // Oldest first, so an existing guide keeps its table when new guides land.
  for (const post of [...blogPosts].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug))) {
    const isBusiness = post.category === "Business";
    const base: InlineQuoteCorridor = baseCorridor(post.slug, post.tags, post.category) ?? (() => {
      if (isBusiness) {
        const [from, to] = BUSINESS_CORRIDORS[rotateBusiness++ % BUSINESS_CORRIDORS.length];
        return { from, to, amount: 10000, business: true as const };
      }
      const [from, to] = GENERAL_CORRIDORS[rotate++ % GENERAL_CORRIDORS.length];
      return { from, to, amount: 1000 };
    })();
    let c: InlineQuoteCorridor = base;
    for (let i = 0; taken.has(key(c)) && i < ALT_AMOUNTS.length; i++) {
      const amount = base.business ? ALT_AMOUNTS[i] * 10 : ALT_AMOUNTS[i];
      // A heading that names the amount would now be wrong, so drop it.
      if (generateQuotes(amount, base.from, base.to).length >= 3) c = { ...base, amount, heading: undefined };
    }
    taken.add(key(c));
    out.set(post.slug, c);
  }
  return out;
})();

export function guideQuoteCorridor(post: { slug: string; tags: string[]; category: string }): InlineQuoteCorridor {
  return ASSIGNED.get(post.slug) ?? baseCorridor(post.slug, post.tags, post.category) ?? { from: "USD", to: "INR", amount: 1000 };
}

