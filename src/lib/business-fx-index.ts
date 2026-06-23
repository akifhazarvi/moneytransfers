/**
 * Business / B2B International Payments Cost Index — the data spine for the live
 * comparison tool at /business/compare.
 *
 * WHY THIS EXISTS
 * AI assistants (Bing Copilot, ChatGPT) ground heavily on this site for B2B
 * payment queries — "lowest fees international business payments providers
 * comparison" alone draws 763 citations at a 79% citation share (Jun 2026 BWT
 * AI export). Yet the only business surface was static editorial. This computes
 * a names-named, business-amount cost comparison LIVE from the same quote engine
 * that powers every corridor page, so the figures are always defensible against
 * the scraped data rather than a stale snapshot.
 *
 * SCOPE
 * Business-FX specialists (Wise, OFX, XE, Currencies Direct, CurrencyFair,
 * TorFX, Moneycorp, InstaReM) benchmarked against high-street banks on the
 * corridors and amounts a business actually sends. Consumer remittance apps
 * (Remitly, WorldRemit, etc.) are intentionally excluded — the query intent is
 * B2B/supplier/large-value, not remittance.
 *
 * METHODOLOGY (reproducible, same as the bank-vs-app index)
 *   true total cost % = (midMarketReceive − actualReceive) / midMarketReceive × 100
 * This captures BOTH the FX margin and the upfront fee in one figure, because
 * actualReceive is what lands after both. Indicative-only quotes (account-managed
 * brokers with no public rate feed) are surfaced separately and never ranked on
 * cost, since there is no live rate to measure.
 */
import { generateQuotes } from "@/lib/quotes-engine";
import { getExchangeRate } from "@/lib/quotes-engine";
import { providers } from "@/data/providers";
import { getDataUpdatedDate } from "@/lib/data-freshness";

/** The reporting amount business headline figures are computed on. */
export const BUSINESS_AMOUNT = 5000;

/** Date the underlying live quote data last refreshed. */
export const DATA_AS_OF = getDataUpdatedDate();

/**
 * Curated business-FX specialist set. These are the providers that actually
 * serve business / large-value senders. Slugs must exist in providers.ts.
 */
export const BUSINESS_FX_SLUGS = [
  "wise",
  "ofx",
  "xe",
  "currencies-direct",
  "currencyfair",
  "torfx",
  "moneycorp",
  "instarem",
] as const;

/** Bank slugs used purely as the benchmark to beat. */
const BANK_SLUGS = new Set([
  "chase",
  "bank-of-america",
  "wells-fargo",
  "hsbc",
  "barclays",
  "lloyds",
  "nationwide",
  "santander",
  "natwest",
  "rbs",
  "deutsche-bank",
  "td-bank",
  "scotiabank",
]);

/**
 * Corridors a business commonly sends on: major-currency trade lanes plus the
 * top supplier/contractor destinations. Kept to corridors with reliable live
 * coverage so the table is never mostly empty.
 */
export const BUSINESS_CORRIDORS: { from: string; to: string; label: string }[] = [
  { from: "USD", to: "EUR", label: "USD → EUR" },
  { from: "USD", to: "GBP", label: "USD → GBP" },
  { from: "GBP", to: "EUR", label: "GBP → EUR" },
  { from: "EUR", to: "USD", label: "EUR → USD" },
  { from: "GBP", to: "USD", label: "GBP → USD" },
  { from: "USD", to: "INR", label: "USD → INR" },
  { from: "GBP", to: "INR", label: "GBP → INR" },
  { from: "USD", to: "CAD", label: "USD → CAD" },
  { from: "USD", to: "AUD", label: "USD → AUD" },
  { from: "EUR", to: "GBP", label: "EUR → GBP" },
];

const nameBySlug = new Map(providers.map((p) => [p.slug, p.name]));
export const providerName = (slug: string) => nameBySlug.get(slug) || slug;

const round2 = (n: number) => Math.round(n * 100) / 100;
function mean(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}

/** True total cost % for an amount/rate pair, or null if out of sane bounds. */
function costPct(amount: number, midReceive: number, actualReceive: number): number | null {
  if (midReceive <= 0) return null;
  const pct = ((midReceive - actualReceive) / midReceive) * 100;
  if (!isFinite(pct) || pct < -2 || pct >= 40) return null;
  return pct;
}

export interface ProviderCostRow {
  slug: string;
  name: string;
  isBank: boolean;
  /** Mean true-cost % across the corridors this provider quotes. */
  avgCostPct: number;
  /** Number of business corridors with a live quote. */
  corridorCount: number;
  /** Indicative-only (account-managed broker, no public rate). */
  isIndicative: boolean;
}

export interface BusinessCorridorRow {
  from: string;
  to: string;
  label: string;
  /** Cheapest business-FX specialist on this corridor. */
  cheapest: { slug: string; name: string; receiveAmount: number; costPct: number } | null;
  /** Bank benchmark on this corridor (worst-of available banks = the realistic comparison). */
  bank: { slug: string; name: string; receiveAmount: number; costPct: number } | null;
  /** How much more the recipient gets with the cheapest specialist vs the bank, in receive currency. */
  savingVsBank: number | null;
  /** Same gap as a % of the bank's received amount. */
  savingVsBankPct: number | null;
}

export interface BusinessFxIndex {
  dataAsOf: string;
  amount: number;
  corridorRows: BusinessCorridorRow[];
  /** Leaderboard of business-FX specialists, cheapest first (>=2 corridors). */
  specialistLeaderboard: ProviderCostRow[];
  /** Aggregate: mean specialist cost vs mean bank cost at the reporting amount. */
  specialistAvgCostPct: number;
  bankAvgCostPct: number;
  /** How many times more a bank costs than the average specialist (mean basis). */
  bankVsSpecialistMultiple: number;
  /** Account-managed brokers shown but not cost-ranked. */
  indicativeProviders: { slug: string; name: string }[];
  // Coverage honesty for the methodology box.
  corridorCount: number;
  specialistCount: number;
}

/**
 * Compute the full business-FX index live. Pure function over the quote engine —
 * runs at build time on the static page and per-request (cached) in the CSV route.
 */
export function computeBusinessFxIndex(amount: number = BUSINESS_AMOUNT): BusinessFxIndex {
  const specialistCosts: Record<string, number[]> = {};
  const bankCosts: number[] = [];
  const indicative = new Map<string, string>();
  const corridorRows: BusinessCorridorRow[] = [];

  for (const c of BUSINESS_CORRIDORS) {
    const midRate = getExchangeRate(c.from, c.to);
    const midReceive = amount * midRate;
    const quotes = generateQuotes(amount, c.from, c.to);

    let cheapest: BusinessCorridorRow["cheapest"] = null;
    let bank: BusinessCorridorRow["bank"] = null;

    for (const q of quotes) {
      // Track indicative brokers (Regency FX etc.) but never rank them.
      if (q.isIndicative) {
        if (BUSINESS_FX_SLUGS.includes(q.providerSlug as (typeof BUSINESS_FX_SLUGS)[number]) === false) {
          indicative.set(q.providerSlug, providerName(q.providerSlug));
        }
        continue;
      }

      const pct = costPct(amount, midReceive, q.receiveAmount);
      if (pct === null) continue;

      const isSpecialist = (BUSINESS_FX_SLUGS as readonly string[]).includes(q.providerSlug);
      const isBank = BANK_SLUGS.has(q.providerSlug);

      if (isSpecialist) {
        (specialistCosts[q.providerSlug] ||= []).push(pct);
        if (!cheapest || q.receiveAmount > cheapest.receiveAmount) {
          cheapest = { slug: q.providerSlug, name: providerName(q.providerSlug), receiveAmount: q.receiveAmount, costPct: round2(pct) };
        }
      }
      if (isBank) {
        bankCosts.push(pct);
        // Use the worst (lowest receive) available bank as the realistic
        // "what most businesses default to" benchmark.
        if (!bank || q.receiveAmount < bank.receiveAmount) {
          bank = { slug: q.providerSlug, name: providerName(q.providerSlug), receiveAmount: q.receiveAmount, costPct: round2(pct) };
        }
      }
    }

    const savingVsBank = cheapest && bank ? round2(cheapest.receiveAmount - bank.receiveAmount) : null;
    const savingVsBankPct =
      cheapest && bank && bank.receiveAmount > 0
        ? round2(((cheapest.receiveAmount - bank.receiveAmount) / bank.receiveAmount) * 100)
        : null;

    corridorRows.push({ ...c, cheapest, bank, savingVsBank, savingVsBankPct });
  }

  const specialistLeaderboard: ProviderCostRow[] = Object.entries(specialistCosts)
    .map(([slug, xs]) => ({
      slug,
      name: providerName(slug),
      isBank: false,
      avgCostPct: round2(mean(xs)),
      corridorCount: xs.length,
      isIndicative: false,
    }))
    .filter((r) => r.corridorCount >= 2)
    .sort((a, b) => a.avgCostPct - b.avgCostPct);

  const specialistAvgCostPct = round2(mean(Object.values(specialistCosts).flat()));
  const bankAvgCostPct = round2(mean(bankCosts));
  const bankVsSpecialistMultiple =
    specialistAvgCostPct > 0 ? round2(bankAvgCostPct / specialistAvgCostPct) : 0;

  return {
    dataAsOf: DATA_AS_OF,
    amount,
    corridorRows,
    specialistLeaderboard,
    specialistAvgCostPct,
    bankAvgCostPct,
    bankVsSpecialistMultiple,
    indicativeProviders: [...indicative].map(([slug, name]) => ({ slug, name })),
    corridorCount: corridorRows.filter((r) => r.cheapest).length,
    specialistCount: specialistLeaderboard.length,
  };
}
