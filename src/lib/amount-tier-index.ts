/**
 * Transfer cost by amount — does the amount you send change who is cheapest?
 *
 * WHY THIS EXISTS
 * Every ranking on this site is priced at $1,000, and remittance-cost-index.ts
 * says why: averaging across amounts "punished flat-fee providers for $100
 * sends the page never claimed to be about — Wise read as $27/1,000 that way
 * and $7 this way." That note identifies a real effect and then scopes it out.
 * This module measures it instead, because the effect is large and the people
 * it hits hardest — remittance senders moving $100–200 — are exactly the
 * audience a $1,000 ranking serves worst.
 *
 * WHY ONLY TWO TIERS
 * The obvious framing is "$100 vs $1,000 vs $10,000". The archive will not
 * support the third: $10,000 carries quotes from ELEVEN providers across ~942
 * corridors, about 1.1 quotes per corridor, so there is no field to compare.
 * $100 has 61 providers and $1,000 has 92. Publishing a $10,000 column would
 * be a column of near-singletons dressed as a comparison, so the tier is
 * reported as insufficient rather than shown. See `UNSUPPORTED_TIERS`.
 *
 * Cost uses `trueCostPct` from remittance-cost-index.ts — imported, not
 * reimplemented, so this page and the cost index cannot disagree about what a
 * transfer costs.
 */
import { quotesByCorridorAmount, providerNames } from "@/lib/unified-quotes";
import { trueCostPct } from "@/lib/remittance-cost-index";
import { providers } from "@/data/providers";

export const SMALL_AMOUNT = 100;
export const HEADLINE_AMOUNT = 1000;

/**
 * A provider needs this many usable quotes at BOTH tiers before its tiers are
 * compared. Below it the delta is two samples arguing with each other.
 */
export const MIN_QUOTES_PER_TIER = 20;

/** Tiers present in the archive but too thin to publish, with the reason. */
export const UNSUPPORTED_TIERS: { amount: number; providers: number; note: string }[] = [
  {
    amount: 10_000,
    providers: 11,
    note: "11 providers quote at this amount, roughly one per corridor — there is no field to compare, so no $10,000 column is published.",
  },
];

export interface AmountTierRow {
  slug: string;
  name: string;
  quotesSmall: number;
  quotesHeadline: number;
  /** Mean true total cost at $100, %. */
  costSmallPct: number;
  /** Mean true total cost at $1,000, %. */
  costHeadlinePct: number;
  /**
   * costSmallPct − costHeadlinePct, in percentage points. Positive means the
   * provider is proportionally dearer on small transfers.
   */
  deltaPp: number;
  /** What the delta costs on a $100 send, in send-currency units. */
  penaltyPer100: number;
  logo: string | null;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

interface Acc {
  small: number[];
  headline: number[];
}

const acc = new Map<string, Acc>();

for (const [key, quotes] of Object.entries(quotesByCorridorAmount)) {
  // Keys are `${send}_${receive}_${amount}`.
  const parts = key.split("_");
  if (parts.length !== 3) continue;
  const amount = Number(parts[2]);
  if (amount !== SMALL_AMOUNT && amount !== HEADLINE_AMOUNT) continue;

  for (const q of quotes) {
    const cost = trueCostPct(q);
    if (cost === null) continue;
    const a = acc.get(q.providerSlug) ?? { small: [], headline: [] };
    (amount === SMALL_AMOUNT ? a.small : a.headline).push(cost);
    acc.set(q.providerSlug, a);
  }
}

const curated = new Map(providers.map((p) => [p.slug, p]));
const logoOf = (slug: string) => curated.get(slug)?.logo ?? null;
/**
 * Prefer the curated display name over the scraped one. `providerNames` is
 * built from whatever the feeds call a provider, which yields "Instarem" where
 * the brand is "InstaReM" — wrong casing of a company's own name on a page
 * whose whole value is being checkable.
 */
const displayName = (slug: string) => curated.get(slug)?.name ?? providerNames[slug] ?? slug;

const rows: AmountTierRow[] = [...acc.entries()]
  .filter(([, a]) => a.small.length >= MIN_QUOTES_PER_TIER && a.headline.length >= MIN_QUOTES_PER_TIER)
  .map(([slug, a]) => {
    const costSmallPct = mean(a.small);
    const costHeadlinePct = mean(a.headline);
    const deltaPp = costSmallPct - costHeadlinePct;
    return {
      slug,
      name: displayName(slug),
      quotesSmall: a.small.length,
      quotesHeadline: a.headline.length,
      costSmallPct: round2(costSmallPct),
      costHeadlinePct: round2(costHeadlinePct),
      deltaPp: round2(deltaPp),
      penaltyPer100: round2((deltaPp / 100) * SMALL_AMOUNT),
      logo: logoOf(slug),
    };
  })
  // Dearest-on-small first: that is the finding, and it is what a reader
  // sending $100 needs at the top.
  .sort((a, b) => b.deltaPp - a.deltaPp);

/** Providers that are proportionally CHEAPER on a small transfer. */
const inverted = rows.filter((r) => r.deltaPp < 0);

export const AMOUNT_TIER_INDEX = {
  smallAmount: SMALL_AMOUNT,
  headlineAmount: HEADLINE_AMOUNT,
  minQuotesPerTier: MIN_QUOTES_PER_TIER,
  /** Providers comparable at both tiers. */
  providersCompared: rows.length,
  rows,
  /** Mean cost across compared providers at $100, %. */
  meanSmallPct: round2(mean(rows.map((r) => r.costSmallPct))),
  /** Mean cost across compared providers at $1,000, %. */
  meanHeadlinePct: round2(mean(rows.map((r) => r.costHeadlinePct))),
  /** The headline gap, in percentage points. */
  meanDeltaPp: round2(mean(rows.map((r) => r.costSmallPct)) - mean(rows.map((r) => r.costHeadlinePct))),
  /** Worst small-transfer penalty. */
  worst: rows[0] ?? null,
  /** Cheapest at $100 among compared providers. */
  cheapestSmall: [...rows].sort((a, b) => a.costSmallPct - b.costSmallPct)[0] ?? null,
  /** Cheapest at $1,000 among compared providers. */
  cheapestHeadline: [...rows].sort((a, b) => a.costHeadlinePct - b.costHeadlinePct)[0] ?? null,
  inverted,
  unsupportedTiers: UNSUPPORTED_TIERS,
} as const;
