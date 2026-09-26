/** Small presentation catalog; never imported by the quote-ranking engine.
 * Partner order is promotional, not a price or quality ranking.
 * Feature copy checked against providers' own sites in September 2026.
 */
export type TransferIntent = "personal" | "business";
export interface TransferContext { from: string; to: string; amount: number }
export interface CrossSellPartner {
  slug: string;
  name: string;
  logo: string;
  label: string;
  description: string;
}

const PERSONAL: readonly CrossSellPartner[] = [
  {
    slug: "taptap-send", name: "TapTap Send", logo: "/logos/taptap-send.png",
    label: "Send money home",
    description: "Support family from your phone. Explore bank, mobile wallet and cash delivery options for your destination.",
  },
  {
    slug: "wise", name: "Wise", logo: "/logos/wise.svg",
    label: "Everyday international transfers",
    description: "See the fee and what your recipient gets before you send. Manage transfers and currencies in one account.",
  },
  {
    slug: "remitly", name: "Remitly", logo: "/logos/remitly.png",
    label: "More ways to receive",
    description: "Explore bank deposits, cash pickup and mobile wallet delivery. Options depend on where you send.",
  },
];

const BUSINESS: readonly CrossSellPartner[] = [
  { ...PERSONAL[1], label: "International business payments", description: "Pay overseas, receive money and manage multiple currencies with Wise Business." },
  { slug: "torfx", name: "TorFX", logo: "/logos/torfx.svg", label: "Plan your currency transfers", description: "Discuss your overseas payments with a currency specialist and request a business quote." },
  { slug: "currencies-direct", name: "Currencies Direct", logo: "/logos/currencies-direct.png", label: "Explore business currency services", description: "Review the business service and request a quote for your next international payment." },
];

/**
 * The paid partner is not gated on `eligible`.
 *
 * `eligible` is built from `generateQuotes()` — it lists providers we hold a
 * live SCRAPED QUOTE for on this corridor, which is much narrower than the
 * providers that actually serve it. TapTap Send covers 819 corridors, the
 * widest footprint we measure, so gating its spotlight on our own scrape gaps
 * hid it from guides whose route it serves perfectly well, and handed the slot
 * to Wise instead. This card carries no corridor-specific claim — its copy is
 * about delivery options generally — so showing it where we happen to lack a
 * quote states nothing we can't stand behind. The measured, corridor-specific
 * numbers live in PartnerFeatureBlock, which does check the real data.
 *
 * `exclude` still wins, so /companies/taptap-send never cross-sells itself.
 */
const UNGATED_PARTNER = "taptap-send";

export function selectCrossSellPartners({ intent = "personal", eligible, exclude, limit = 3 }: {
  intent?: TransferIntent; eligible?: readonly string[]; exclude?: string; limit?: number;
} = {}): CrossSellPartner[] {
  // An empty eligible set means no matching partner. Never fall back to a
  // different corridor or a consumer service on a business page.
  return (intent === "business" ? BUSINESS : PERSONAL)
    .filter((partner) => partner.slug !== exclude
      && (partner.slug === UNGATED_PARTNER || !eligible || eligible.includes(partner.slug)))
    .slice(0, limit);
}

export function crossSellComparisonHref(intent: TransferIntent, context?: TransferContext): string {
  const path = intent === "business" ? "/business/compare" : "/send-money";
  // The business comparison is a feature matrix, not a corridor search.
  if (!context || intent === "business") return path;
  // No amount (2026-09-25): tables now price at page-specific amounts, and an
  // amount in this link minted one parameter URL per page — SiteLiner found
  // 254 of them, every one canonicalising to /send-money. One URL per pair.
  return `${path}?${new URLSearchParams({ from: context.from, to: context.to })}`;
}

/** Closing prompts on discovery/editorial pages. Results and guide templates
 * already have contextual placements; utility/legal routes aren't sales pages.
 */
export function siteCrossSellConfig(pathname: string) {
  const path = pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/$/, "") || "/";
  const [, section, slug] = path.split("/");
  const surfaces = ["research", "provider-consistency", "remittance-cost-index", "sendscore", "transfer-cost-by-amount", "news", "tools", "companies", "banks", "iban", "swift-codes", "travel", "exchange-rates", "currency-converter", "compare-money-transfer", "business"];
  // The homepage runs PartnerFeatureBlock's ad, which shows the same partner
  // with a live rate, payout and savings. The page-end card showed the partner
  // again with none of that, so the homepage opts out here (2026-09-19).
  if (path === "/") return null;
  if (!surfaces.includes(section)) return null;
  if (path === "/business/compare") return null;
  const business = section === "business" || (section === "companies" && ["torfx", "currencies-direct", "ofx", "moneycorp", "regencyfx"].includes(slug));
  // Not excluded on the sections that now carry the live-rate ad inline.
  // Tried on 2026-09-19 and reverted: the inline table is conditional on
  // those pages, so excluding the partner here dropped it from 38 pages that
  // render no ad — the page-end slot falls through to Wise, which is the
  // visibility loss [[feedback_taptap_visibility_over_dedup]] is about. The
  // ad and this module are different units (one live quote vs three partners
  // to browse), so carrying both is not the duplication that was reported.
  return {
    source: path === "/" ? "home" : path.slice(1),
    intent: business ? "business" as const : "personal" as const,
    exclude: section === "companies" ? slug : undefined,
    title: section === "companies" && slug ? "Explore other transfer providers." : business ? "Put your next business payment in motion." : "Your next transfer starts here.",
  };
}
