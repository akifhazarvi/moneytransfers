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

export function selectCrossSellPartners({ intent = "personal", eligible, exclude, limit = 3 }: {
  intent?: TransferIntent; eligible?: readonly string[]; exclude?: string; limit?: number;
} = {}): CrossSellPartner[] {
  // An empty eligible set means no matching partner. Never fall back to a
  // different corridor or a consumer service on a business page.
  return (intent === "business" ? BUSINESS : PERSONAL)
    .filter((partner) => partner.slug !== exclude && (!eligible || eligible.includes(partner.slug)))
    .slice(0, limit);
}

export function crossSellComparisonHref(intent: TransferIntent, context?: TransferContext): string {
  const path = intent === "business" ? "/business/compare" : "/send-money";
  // The business comparison is a feature matrix, not a corridor search.
  if (!context || intent === "business") return path;
  return `${path}?${new URLSearchParams({ from: context.from, to: context.to, amount: String(context.amount) })}`;
}

/** Closing prompts on discovery/editorial pages. Results and guide templates
 * already have contextual placements; utility/legal routes aren't sales pages.
 */
export function siteCrossSellConfig(pathname: string) {
  const path = pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/$/, "") || "/";
  const [, section, slug] = path.split("/");
  const surfaces = ["research", "provider-consistency", "remittance-cost-index", "sendscore", "transfer-cost-by-amount", "news", "tools", "companies", "banks", "iban", "swift-codes", "travel", "exchange-rates", "currency-converter", "compare-money-transfer", "business"];
  if (path !== "/" && !surfaces.includes(section)) return null;
  if (path === "/business/compare") return null;
  const business = section === "business" || (section === "companies" && ["torfx", "currencies-direct", "ofx", "moneycorp", "regencyfx"].includes(slug));
  return {
    source: path === "/" ? "home" : path.slice(1),
    intent: business ? "business" as const : "personal" as const,
    exclude: section === "companies" ? slug : undefined,
    title: section === "companies" && slug ? "Explore other transfer providers." : business ? "Put your next business payment in motion." : "Your next transfer starts here.",
  };
}
