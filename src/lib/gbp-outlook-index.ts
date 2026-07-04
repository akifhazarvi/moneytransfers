/**
 * GBP Outlook Index — the live-data spine for the data-story at
 * /guides/gbp-forecast-2026.
 *
 * WHY THIS EXISTS
 * The article's core claim is that the gap between the best and worst
 * money-transfer provider on a single corridor is LARGER than the pound's
 * typical monthly currency move — so provider choice beats market timing. That
 * claim only holds if the provider-spread figure is real and current, not a
 * hard-coded snapshot that drifts as rates change. So we compute it live from
 * the same wise-comparison scrape that refreshes every 6 hours, exactly like
 * computeBankVsAppIndex(). See src/lib/bank-vs-app-index.ts for the sibling.
 *
 * METHODOLOGY
 * For the headline corridor (GBP -> USD at a fixed send amount) we take every
 * live provider quote, rank by receiveAmount, and report:
 *   - best (highest receive) and worst (lowest receive) provider + payout
 *   - the absolute and percentage gap between them
 *   - the full ranked table for the chart
 * The percentage gap is (best - worst) / best * 100. We keep only quotes with a
 * sane positive receiveAmount to drop scrape artifacts.
 */
import quotes from "@/data/scraped/wise-comparison-quotes.json";

interface ComparisonQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
}

const allQuotes = quotes as ComparisonQuote[];

/** The reporting corridor + amount the headline figures are computed on. */
export const HEADLINE_SEND = "GBP";
export const HEADLINE_RECEIVE = "USD";
export const HEADLINE_AMOUNT = 1000;

export interface ProviderRow {
  provider: string;
  providerSlug: string;
  receiveAmount: number;
  exchangeRate: number;
}

export interface GbpOutlookIndex {
  send: string;
  receive: string;
  amount: number;
  /** All providers on the corridor, ranked best (highest receive) first. */
  rows: ProviderRow[];
  providerCount: number;
  best: ProviderRow | null;
  worst: ProviderRow | null;
  /** Absolute payout difference best vs worst, e.g. 72.24. */
  spreadAbs: number;
  /** Percentage gap best vs worst, e.g. 5.4. */
  spreadPct: number;
}

export function computeGbpOutlookIndex(amount: number = HEADLINE_AMOUNT): GbpOutlookIndex {
  const rows: ProviderRow[] = allQuotes
    .filter(
      (q) =>
        q.sendCurrency === HEADLINE_SEND &&
        q.receiveCurrency === HEADLINE_RECEIVE &&
        q.sendAmount === amount &&
        typeof q.receiveAmount === "number" &&
        q.receiveAmount > 0,
    )
    // one row per provider — keep their best quote if duplicated
    .reduce<ProviderRow[]>((acc, q) => {
      const existing = acc.find((r) => r.provider === q.provider);
      if (!existing) {
        acc.push({
          provider: q.provider,
          providerSlug: q.providerSlug,
          receiveAmount: q.receiveAmount,
          exchangeRate: q.exchangeRate,
        });
      } else if (q.receiveAmount > existing.receiveAmount) {
        existing.receiveAmount = q.receiveAmount;
        existing.exchangeRate = q.exchangeRate;
      }
      return acc;
    }, [])
    .sort((a, b) => b.receiveAmount - a.receiveAmount);

  const best = rows[0] ?? null;
  const worst = rows.length > 1 ? rows[rows.length - 1] : null;
  const spreadAbs = best && worst ? best.receiveAmount - worst.receiveAmount : 0;
  const spreadPct = best && worst ? (spreadAbs / best.receiveAmount) * 100 : 0;

  return {
    send: HEADLINE_SEND,
    receive: HEADLINE_RECEIVE,
    amount,
    rows,
    providerCount: rows.length,
    best,
    worst,
    spreadAbs: Math.round(spreadAbs * 100) / 100,
    spreadPct: Math.round(spreadPct * 10) / 10,
  };
}
