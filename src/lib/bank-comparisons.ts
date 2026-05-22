/**
 * Bank Comparison Data Layer
 *
 * Reads the Wise comparison API scrape (`wise-comparison-quotes.json`), filters
 * for `providerType === "bank"` and exposes per-bank views computed against
 * the best-digital-provider on each corridor. Powers the /banks/[slug] pages.
 *
 * This is a marketing surface, not an internal API. The pages exist to capture
 * branded transactional intent ("wells fargo international wire transfer fee",
 * "lloyds international transfer cost") that comparison competitors don't
 * target with live data — sendmoneycompare is the only site with continuously
 * scraped bank quotes alongside digital-provider quotes for the same corridor
 * and amount, which is the entire point of the SEO play.
 */
import wiseComparison from "@/data/scraped/wise-comparison-quotes.json";

interface RawQuote {
  provider: string;
  providerSlug: string;
  providerType: string; // "bank" | "moneyTransferProvider"
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  paymentMethod?: string | null;
  deliveryEstimate?: string | null;
}

const RAW: RawQuote[] = wiseComparison as unknown as RawQuote[];

/**
 * Pilot bank metadata. Slug must match providerSlug in wise-comparison-quotes.json.
 * Limited to the 5 launch pilots so we don't sitemap-spam — once the pattern
 * proves out, expand from the bank inventory (`/tmp/bank_inventory.js`).
 */
export interface BankMeta {
  slug: string;
  name: string;
  legalName: string;
  country: string;
  countryCode: string; // ISO-2 for flag lookup
  primaryCurrency: string;
  founded: number;
  /** Human-readable headline angle used in H1 + meta */
  headline: string;
  /** Description of the bank's international-transfer product */
  productNote: string;
  /** The bank's own published international transfer fee page if relevant */
  sourcePage?: string;
  /** Which provider IS cheaper for users currently with this bank */
  recommendedAlternative: { slug: string; label: string };
}

export const PILOT_BANKS: Record<string, BankMeta> = {
  "hsbc": {
    slug: "hsbc",
    name: "HSBC",
    legalName: "HSBC UK",
    country: "United Kingdom",
    countryCode: "GB",
    primaryCurrency: "GBP",
    founded: 1865,
    headline: "HSBC International Transfer Fees — What You Actually Pay (Live Data, 2026)",
    productNote:
      "HSBC's Global Money service (free for HSBC Premier and Advance customers) competes head-on with Wise for some currencies, but standard HSBC Bank Account holders pay a 1.2-2.0% exchange rate margin plus a fixed transfer fee on most outbound international payments.",
    sourcePage: "https://www.hsbc.co.uk/help/online-banking/global-money-transfer/",
    recommendedAlternative: { slug: "wise", label: "Wise — mid-market rate, 0% markup, 70+ currencies" },
  },
  "wells-fargo": {
    slug: "wells-fargo",
    name: "Wells Fargo",
    legalName: "Wells Fargo Bank, N.A.",
    country: "United States",
    countryCode: "US",
    primaryCurrency: "USD",
    founded: 1852,
    headline: "Wells Fargo International Wire Transfer Fees — Live Cost vs Wise & Remitly (2026)",
    productNote:
      "Wells Fargo charges $30 for an online international wire transfer in USD and $40-50 in foreign currency, plus an exchange rate markup that typically lands 2.5-3.5% above the mid-market rate. The bank does not publish its FX margin upfront — the only way to see the real cost is to compare the receive amount.",
    sourcePage: "https://www.wellsfargo.com/online-banking/transfers/wire-transfers/",
    recommendedAlternative: { slug: "wise", label: "Wise — typically saves $25-80 on a $1,000 transfer" },
  },
  "chase": {
    slug: "chase",
    name: "Chase",
    legalName: "JPMorgan Chase Bank, N.A.",
    country: "United States",
    countryCode: "US",
    primaryCurrency: "USD",
    founded: 1799,
    headline: "Chase International Wire Transfer Fees — How Much You're Actually Losing (2026)",
    productNote:
      "Chase charges $40-50 for an international wire transfer initiated online ($50 in branch). Foreign currency wires include a non-disclosed FX margin that adds 2-3.5% on top — Chase does not display the markup; you only see it by comparing the foreign-currency receive amount against the mid-market rate.",
    sourcePage: "https://www.chase.com/personal/wire-transfer",
    recommendedAlternative: { slug: "wise", label: "Wise — typically saves $30-90 on a $1,000 transfer" },
  },
  "lloyds": {
    slug: "lloyds",
    name: "Lloyds Bank",
    legalName: "Lloyds Bank plc",
    country: "United Kingdom",
    countryCode: "GB",
    primaryCurrency: "GBP",
    founded: 1765,
    headline: "Lloyds Bank International Transfer Fees — Real Cost vs Wise on a £1,000 Send (2026)",
    productNote:
      "Lloyds charges £9.50 for an international SEPA payment and up to £20 for a SWIFT payment, plus an exchange rate margin typically 2.8-4.5% above the mid-market rate. Internet Banking customers pay slightly less than branch customers but the FX margin is the same.",
    sourcePage: "https://www.lloydsbank.com/international-banking/sending-money-abroad.html",
    recommendedAlternative: { slug: "wise", label: "Wise — typically saves £40-70 on a £1,000 transfer to India" },
  },
  "barclays": {
    slug: "barclays",
    name: "Barclays",
    legalName: "Barclays Bank UK PLC",
    country: "United Kingdom",
    countryCode: "GB",
    primaryCurrency: "GBP",
    founded: 1690,
    headline: "Barclays International Transfer Fees — What £1,000 to India Actually Costs (2026)",
    productNote:
      "Barclays Online International Payment costs £25 (£15 if you use Barclays International Banking with a Premier or Wealth relationship), plus an FX margin typically 2.0-3.0% above mid-market. Cheaper than Lloyds or Santander on like-for-like, but still substantially more than specialist providers.",
    sourcePage: "https://www.barclays.co.uk/international-banking/international-payments/",
    recommendedAlternative: { slug: "wise", label: "Wise — typically saves £25-40 on a £1,000 transfer to India" },
  },
};

export function getBankMeta(slug: string): BankMeta | undefined {
  return PILOT_BANKS[slug];
}

export function getAllPilotBankSlugs(): string[] {
  return Object.keys(PILOT_BANKS);
}

/**
 * One quote row for a (bank, corridor, amount) combination plus the computed
 * "vs best digital provider" delta. The delta is what makes these pages
 * marketing assets: it's the dollar-and-cents proof that the bank costs the
 * user money on every transfer.
 */
export interface BankCorridorQuote {
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  /** What the bank delivers */
  bankReceive: number;
  bankRate: number;
  bankFee: number;
  /** What the best digital provider delivers on the same corridor + amount */
  bestDigitalReceive: number;
  bestDigitalProvider: string;
  bestDigitalProviderSlug: string;
  bestDigitalRate: number;
  bestDigitalFee: number;
  /** How much the bank user LOSES vs switching */
  lossInReceiveCurrency: number;
  lossPct: number;
}

/**
 * Returns every (corridor, amount) pair for which we have BOTH a bank quote
 * AND at least one digital-provider quote on the same row of the comparison.
 * Sorted by absolute loss (largest first) — the marketing hook is "look how
 * much you're losing," not "look at the smallest gap."
 */
export function getBankCorridorQuotes(bankSlug: string): BankCorridorQuote[] {
  const bankRows = RAW.filter((q) => q.providerSlug === bankSlug && q.providerType === "bank");
  const results: BankCorridorQuote[] = [];

  for (const br of bankRows) {
    const peers = RAW.filter(
      (q) =>
        q.providerType === "moneyTransferProvider" &&
        q.sendCurrency === br.sendCurrency &&
        q.receiveCurrency === br.receiveCurrency &&
        q.sendAmount === br.sendAmount,
    );
    if (peers.length === 0) continue;

    const best = peers.reduce((max, q) => (q.receiveAmount > max.receiveAmount ? q : max));
    const loss = best.receiveAmount - br.receiveAmount;
    const lossPct = (loss / best.receiveAmount) * 100;

    results.push({
      sendCurrency: br.sendCurrency,
      receiveCurrency: br.receiveCurrency,
      sendAmount: br.sendAmount,
      bankReceive: br.receiveAmount,
      bankRate: br.exchangeRate,
      bankFee: br.fee,
      bestDigitalReceive: best.receiveAmount,
      bestDigitalProvider: best.provider,
      bestDigitalProviderSlug: best.providerSlug,
      bestDigitalRate: best.exchangeRate,
      bestDigitalFee: best.fee,
      lossInReceiveCurrency: loss,
      lossPct,
    });
  }

  return results.sort((a, b) => b.lossInReceiveCurrency - a.lossInReceiveCurrency);
}

/**
 * Aggregate stats across all corridors a bank operates on. Used in the page
 * hero for headline numbers.
 */
export interface BankAggregateStats {
  corridorCount: number;
  amountSizesCovered: number[];
  averageLossPct: number;
  largestLossExample: BankCorridorQuote | null;
  smallestLossExample: BankCorridorQuote | null;
}

export function getBankAggregateStats(bankSlug: string): BankAggregateStats {
  const quotes = getBankCorridorQuotes(bankSlug);
  if (quotes.length === 0) {
    return {
      corridorCount: 0,
      amountSizesCovered: [],
      averageLossPct: 0,
      largestLossExample: null,
      smallestLossExample: null,
    };
  }
  const corridorPairs = new Set(quotes.map((q) => `${q.sendCurrency}-${q.receiveCurrency}`));
  const sizes = [...new Set(quotes.map((q) => q.sendAmount))].sort((a, b) => a - b);
  const avgPct = quotes.reduce((s, q) => s + q.lossPct, 0) / quotes.length;
  const sortedByLoss = [...quotes].sort((a, b) => b.lossPct - a.lossPct);
  return {
    corridorCount: corridorPairs.size,
    amountSizesCovered: sizes,
    averageLossPct: avgPct,
    largestLossExample: sortedByLoss[0],
    smallestLossExample: sortedByLoss[sortedByLoss.length - 1],
  };
}
