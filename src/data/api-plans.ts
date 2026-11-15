/**
 * Planned Data API plans, shown on /developers while the paid API is on a
 * waitlist. Prices are an owner decision, not data: change them here and the
 * page and the waitlist form follow. Nothing is sold yet. The page labels every
 * paid price "planned", and the waitlist promises early access, not a price.
 *
 * Before taking money, check redistribution rights for every source a paid
 * plan would resell (provider calculators, the Wise Comparison API, Monito,
 * the mid-market feeds). The free tier republishes what the site already
 * publishes under CC BY 4.0.
 */

export type ApiPlanId = "free" | "developer" | "business" | "enterprise";

export interface ApiPlan {
  id: ApiPlanId;
  name: string;
  /** Monthly price in USD; null = custom quote. */
  monthlyUsd: number | null;
  /** One line under the price. */
  tagline: string;
  features: string[];
  /** Free is live today; the rest are on the waitlist. */
  available: boolean;
}

export const API_PLANS: readonly ApiPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyUsd: 0,
    tagline: "Available now, no key",
    features: [
      "Quotes for any route and amount the comparison prices",
      "Daily mid-market history per currency pair",
      "Research datasets as CSV",
      "CC BY 4.0: credit SendMoneyCompare with a link",
      "Cached responses, fair use",
    ],
    available: true,
  },
  {
    id: "developer",
    name: "Developer",
    monthlyUsd: 29,
    tagline: "For apps, widgets and side projects",
    features: [
      "API key and 10,000 requests a month",
      "Quote history for every route, 90 days",
      "Provider metadata: coverage, limits, payout methods",
      "Email support",
    ],
    available: false,
  },
  {
    id: "business",
    name: "Business",
    monthlyUsd: 199,
    tagline: "For fintech teams, publishers and research",
    features: [
      "100,000 requests a month",
      "Full quote history since collection began",
      "Bulk CSV and Parquet exports",
      "Webhooks when a route's top payout changes",
      "Priority support",
    ],
    available: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyUsd: null,
    tagline: "Custom routes, amounts and delivery",
    features: [
      "Custom routes and amount tiers",
      "Dedicated data feed or warehouse delivery",
      "Redistribution terms",
      "Service-level agreement",
    ],
    available: false,
  },
];

/** What a waitlist signup says it wants to build. */
export const API_USE_CASES = [
  { id: "app", label: "An app or website feature" },
  { id: "fintech", label: "Fintech product or pricing team" },
  { id: "research", label: "Research, journalism or teaching" },
  { id: "ai-agent", label: "An AI assistant or agent" },
  { id: "other", label: "Something else" },
] as const;

export type ApiUseCaseId = (typeof API_USE_CASES)[number]["id"];

export const WAITLIST_PLAN_IDS: readonly ApiPlanId[] = API_PLANS.map((p) => p.id);
export const WAITLIST_USE_CASE_IDS: readonly string[] = API_USE_CASES.map((u) => u.id);
