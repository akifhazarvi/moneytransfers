/**
 * Remittance Cost Index — computed from the live quote set, not a snapshot.
 *
 * WHY THIS EXISTS
 * /remittance-cost-index used to read `provider-summary.json`, a file no
 * scraper regenerates (last written 2026-03-17). The page badge said "Updated
 * March 2026" — true — while its FAQ said the index is recalculated on every
 * rebuild from the latest quotes — false. Company pages read the same March
 * file for their "measured markup" sentence. Everything here is now derived
 * from the same `unified-quotes` dataset that feeds every comparison table, so
 * one datastore produces one calculation for every surface, and the "as of"
 * date on the page is the date of the quotes behind it.
 *
 * METHODOLOGY (mirrors bank-vs-app-index.ts so the two indices agree)
 *   true total cost % = (midReceive − actualReceive) / midReceive × 100
 *   midReceive        = sendAmount × mid-market rate (XE snapshot)
 * That single figure captures the fee AND the exchange-rate markup, because
 * actualReceive is what lands after both. It is currency-neutral, which is why
 * fee and markup are reported as percentages of the amount sent: the old file
 * averaged raw fees, so ¥3,500 sat next to $1 as if comparable.
 *
 * The headline ranking uses only quotes at the headline amount (1,000 units of
 * the send currency). Averaging across all amounts punished flat-fee providers
 * for $100 sends the page never claimed to be about — Wise read as $27/1,000
 * that way and $7 this way.
 *
 * Sane bounds (−2%..40%) drop scrape artifacts without cherry-picking.
 */
import { quotesByCorridor, quotesByCorridorAmount, quoteDataDate, providerNames, type NormalizedQuote } from "@/lib/unified-quotes";
import wiseComparison from "@/data/scraped/wise-comparison-quotes.json";
import { providers } from "@/data/providers";

/** Amount, in the send currency, the headline ranking is priced on. */
export const INDEX_AMOUNT = 1000;
/** A provider needs quotes on this many corridors to be ranked. */
export const MIN_CORRIDORS = 5;

export type ProviderKind = "bank" | "specialist";

export interface IndexRow {
  slug: string;
  name: string;
  kind: ProviderKind;
  /** Distinct corridors with a quote at INDEX_AMOUNT. */
  corridors: number;
  /** Quotes behind the averages. */
  quotes: number;
  /** Mean true total cost, % of amount sent. */
  avgCostPct: number;
  /** Mean exchange-rate markup vs mid-market, %. */
  avgMarkupPct: number;
  /** Mean upfront fee, % of amount sent. */
  avgFeePct: number;
  /** avgCostPct expressed in send-currency units per INDEX_AMOUNT sent. */
  costPerAmount: number;
  logo: string | null;
}

export interface MeasuredMarkup {
  /** Mean distance from the mid-market rate, in percent, across every amount. */
  markupPct: number;
  /**
   * Median distance from the mid-market rate. Prefer this in copy.
   *
   * The mean is pulled badly off by corridors where OUR benchmark is wrong
   * rather than the provider's rate. Measured 2026-09-07, Wise sits within
   * 0.02% of mid-market on USD→INR, USD→PHP, USD→MXN, GBP→INR, GBP→EUR,
   * USD→EUR, AED→INR, CAD→INR and USD→PKR — a genuine 0% markup — while
   * USD→NGN reads −3.16% because the naira has an official/parallel split our
   * mid-market snapshot does not track. Averaging those together produced a
   * "Wise charges 0.62% markup" figure that is true of the arithmetic and false
   * about the provider, and publishing it would have contradicted a "0% markup"
   * claim that is, on the corridors readers actually use, correct.
   */
  markupMedianPct: number;
  /** How many corridors these are taken over. */
  corridors: number;
}

// ── Provider kind ─────────────────────────────────────────────────────────
// The Wise comparison feed labels each provider bank / moneyTransferProvider;
// first-party scrapes carry no type, so a name pattern backstops it. HSBC
// Singapore's remittance product was typed "moneyTransferProvider" in the old
// summary and ranked as a specialist — a bank is a bank here.
const feedBanks = new Set(
  (wiseComparison as { providerSlug: string; providerType?: string }[])
    .filter((q) => q.providerType === "bank")
    .map((q) => q.providerSlug),
);
const BANK_PATTERN =
  /bank|banque|banca|kantonal|caixa|sabadell|hsbc|natwest|barclays|lloyds|halifax|\btsb\b|nationwide|santander|monese|chase|wells-fargo|citi|bnp|cr[ée]dit|postale|abn-amro|rabobank|\bing\b|bbva|unicredit|intesa|nordea|swedbank|danske|handelsbanken|\bdbs\b|ocbc|uob|icici|hdfc|axis|kotak|\bsbi\b|\bnab\b|\banz\b|westpac|commonwealth|\bbnz\b|\basb\b|kiwibank|scotiabank|td-bank|\brbc\b|\bbmo\b|cibc|hang-seng|\brbs\b/i;

export function providerKind(slug: string, name: string): ProviderKind {
  if (feedBanks.has(slug)) return "bank";
  return BANK_PATTERN.test(slug) || BANK_PATTERN.test(name) ? "bank" : "specialist";
}

// ── Computation ───────────────────────────────────────────────────────────
/**
 * True total cost of a quote as a % of the amount sent: the gap between what a
 * mid-market transfer would deliver and what the provider actually delivers, so
 * it captures the fee and the exchange-rate markup together.
 *
 * Exported because amount-tier-index.ts needs the SAME definition of cost. A
 * second copy would drift, and two pages disagreeing about what a transfer
 * costs is the failure this module was created to fix.
 */
export function trueCostPct(q: NormalizedQuote): number | null {
  if (!q.midMarketRate || q.sendAmount <= 0) return null;
  const midReceive = q.sendAmount * q.midMarketRate;
  const pct = ((midReceive - q.receiveAmount) / midReceive) * 100;
  if (!isFinite(pct) || pct < -2 || pct >= 40) return null;
  return pct;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
/** Median — the robust counterpart to `mean` where a bad benchmark can outlie. */
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round2 = (n: number) => Math.round(n * 100) / 100;

interface Acc {
  slug: string;
  name: string;
  costs: number[];
  markups: number[];
  fees: number[];
  corridors: Set<string>;
}

const headline = new Map<string, Acc>();
const allAmounts = new Map<string, Acc>();
const headlineCorridors = new Set<string>();
/**
 * Usable quotes at the ranking amount — every quote that passed the cost bounds
 * and actually fed a figure on the page, including providers below the ranking
 * threshold. Published because "we analysed N live quotes" is the sentence a
 * reader or an AI assistant can cite, and until now the page performed the
 * analysis without ever saying how much data was behind it.
 */
let headlineQuoteCount = 0;

for (const [corridor, quotes] of Object.entries(quotesByCorridor)) {
  for (const q of quotes) {
    const cost = trueCostPct(q);
    if (cost === null) continue;
    const name = providerNames[q.providerSlug] ?? q.provider ?? q.providerSlug;
    const push = (map: Map<string, Acc>) => {
      const acc = map.get(q.providerSlug) ?? {
        slug: q.providerSlug,
        name,
        costs: [],
        markups: [],
        fees: [],
        corridors: new Set<string>(),
      };
      acc.costs.push(cost);
      acc.markups.push(q.markup);
      acc.fees.push((q.fee / q.sendAmount) * 100);
      acc.corridors.add(corridor);
      map.set(q.providerSlug, acc);
    };
    push(allAmounts);
    if (q.sendAmount === INDEX_AMOUNT) {
      push(headline);
      headlineCorridors.add(corridor);
      headlineQuoteCount += 1;
    }
  }
}

const logoOf = (slug: string) => providers.find((p) => p.slug === slug)?.logo ?? null;

const rows: IndexRow[] = [...headline.values()]
  .filter((a) => a.corridors.size >= MIN_CORRIDORS)
  .map((a) => {
    const avgCostPct = mean(a.costs);
    return {
      slug: a.slug,
      name: a.name,
      kind: providerKind(a.slug, a.name),
      corridors: a.corridors.size,
      quotes: a.costs.length,
      avgCostPct: round2(avgCostPct),
      avgMarkupPct: round2(mean(a.markups)),
      avgFeePct: round2(mean(a.fees)),
      costPerAmount: round2((avgCostPct / 100) * INDEX_AMOUNT),
      logo: logoOf(a.slug),
    };
  })
  .sort((a, b) => a.costPerAmount - b.costPerAmount || a.slug.localeCompare(b.slug));

const specialists = rows.filter((r) => r.kind === "specialist");
const banks = rows.filter((r) => r.kind === "bank");

export const REMITTANCE_INDEX = {
  /** ISO day of the freshest quote in the dataset. */
  dataAsOf: quoteDataDate ?? new Date().toISOString().slice(0, 10),
  amount: INDEX_AMOUNT,
  minCorridors: MIN_CORRIDORS,
  /** Every ranked provider, cheapest first. */
  providers: rows,
  specialists,
  banks,
  /** Distinct corridors carrying at least one quote at INDEX_AMOUNT. */
  corridorCount: headlineCorridors.size,
  /** Usable quotes at INDEX_AMOUNT behind every figure on the page. */
  quotesAnalysed: headlineQuoteCount,
  /** Distinct providers with any usable quote at INDEX_AMOUNT (ranked or not). */
  providersPriced: headline.size,
  avgSpecialistCost: round2(mean(specialists.map((r) => r.costPerAmount))),
  avgBankCost: round2(mean(banks.map((r) => r.costPerAmount))),
  avgSpecialistFeePct: round2(mean(specialists.map((r) => r.avgFeePct))),
  avgBankFeePct: round2(mean(banks.map((r) => r.avgFeePct))),
  avgSpecialistMarkupPct: round2(mean(specialists.map((r) => r.avgMarkupPct))),
  avgBankMarkupPct: round2(mean(banks.map((r) => r.avgMarkupPct))),
} as const;

// ── Per-provider measured markup (all amounts) for /companies profiles ────
const measured = new Map<string, MeasuredMarkup>();
for (const a of allAmounts.values()) {
  measured.set(a.slug, {
    markupPct: round2(mean(a.markups)),
    markupMedianPct: round2(median(a.markups)),
    corridors: a.corridors.size,
  });
}

/** Slugs with a measured markup; the key set provider-measured.ts resolves against. */
export const MEASURED_MARKUPS: ReadonlyMap<string, MeasuredMarkup> = measured;

// ── Per-corridor cost spread ──────────────────────────────────────────────
// The provider cut of this index answers "who is dearest". Nothing published
// the corridor cut: which corridors carry the widest markup, and therefore
// where comparing is worth the most. That question is the one a corridor page
// implicitly asks and the one that justifies a comparison table existing, so
// it belongs on the index rather than in a new near-duplicate URL.
//
// Reported as the gap between the cheapest provider and the MEDIAN provider,
// not the dearest. The dearest is often one bank with an outlying rate, which
// would let the page advertise a saving almost nobody is choosing between.
// The median is what a sender who does not compare is likely to land on.

/** A corridor needs this many providers before a median means anything. */
export const MIN_PROVIDERS_FOR_SPREAD = 3;

export interface CorridorSpreadRow {
  corridor: string;
  sendCurrency: string;
  receiveCurrency: string;
  providers: number;
  /** True total cost of the cheapest provider, %. */
  bestCostPct: number;
  /** True total cost of the median provider, %. */
  medianCostPct: number;
  /** medianCostPct − bestCostPct: what not comparing costs, in %. */
  comparisonGapPct: number;
  /** comparisonGapPct in send-currency units per INDEX_AMOUNT sent. */
  gapPerAmount: number;
}


const spreadRows: CorridorSpreadRow[] = [];
for (const [amountKey, quotes] of Object.entries(quotesByCorridorAmount)) {
  // Keys are `${send}_${receive}_${amount}` — only the headline amount.
  const parts = amountKey.split("_");
  if (parts.length !== 3 || Number(parts[2]) !== INDEX_AMOUNT) continue;

  // One figure per provider, best-first, so a provider quoting twice on a
  // corridor cannot weight the median toward itself.
  const bySlug = new Map<string, number>();
  for (const q of quotes) {
    const cost = trueCostPct(q);
    if (cost === null) continue;
    const prev = bySlug.get(q.providerSlug);
    if (prev === undefined || cost < prev) bySlug.set(q.providerSlug, cost);
  }
  const costs = [...bySlug.values()];
  if (costs.length < MIN_PROVIDERS_FOR_SPREAD) continue;

  const best = Math.min(...costs);
  const med = median(costs);
  const gap = med - best;
  spreadRows.push({
    corridor: `${parts[0]}-${parts[1]}`,
    sendCurrency: parts[0],
    receiveCurrency: parts[1],
    providers: costs.length,
    bestCostPct: round2(best),
    medianCostPct: round2(med),
    comparisonGapPct: round2(gap),
    gapPerAmount: round2((gap / 100) * INDEX_AMOUNT),
  });
}

spreadRows.sort((a, b) => b.comparisonGapPct - a.comparisonGapPct || a.corridor.localeCompare(b.corridor));

export const CORRIDOR_SPREAD = {
  amount: INDEX_AMOUNT,
  minProviders: MIN_PROVIDERS_FOR_SPREAD,
  /** Corridors with enough providers to compute a median. */
  corridorsMeasured: spreadRows.length,
  /** Widest comparison gaps first. */
  rows: spreadRows,
  /** Median comparison gap across every measured corridor, %. */
  medianGapPct: round2(median(spreadRows.map((r) => r.comparisonGapPct))),
} as const;
