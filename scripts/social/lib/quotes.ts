import { generateQuotes } from "../../../src/lib/quotes-engine";
import { getProviderName } from "../../../src/data/providers";

export interface Quote {
  provider: string;
  providerSlug: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  dateCollected?: string;
  source: string;
}

// Returns the corridor's quotes at `sendAmount`, sorted best → worst — the SAME
// rows the site's comparison table shows, from generateQuotes().
//
// This used to re-read a hand-picked subset of the scraped files and rank them
// by each file's raw `receiveAmount`. That skipped every guard and correction
// the site applies (quote-integrity quarantine, fee-convention restatement,
// per-amount pricing, hidden providers, transfer limits, freshness-aware
// dedupe), missed five sources (PandaRemit, SkyRemit, LemFi, Unplex,
// RemitRoutes), and so could publish a "cheapest" that the linked page
// contradicted — e.g. Ria's promo-priced receive amounts, fixed 2026-09-26.
export function getAllQuotes(
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number
): { quotes: Quote[]; latestCollected: Date | null } {
  const rows = generateQuotes(sendAmount, sendCurrency, receiveCurrency).filter((q) => !q.isIndicative);

  let latest: Date | null = null;
  const raw: Quote[] = rows.map((q) => {
    if (q.dateCollected) {
      const d = new Date(q.dateCollected);
      if (!Number.isNaN(d.getTime()) && (!latest || d > latest)) latest = d;
    }
    return {
      provider: getProviderName(q.providerSlug),
      providerSlug: q.providerSlug,
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: q.fee,
      exchangeRate: q.exchangeRate,
      receiveAmount: q.receiveAmount,
      dateCollected: q.dateCollected,
      source: "site-comparison",
    };
  });
  raw.sort((a, b) => b.receiveAmount - a.receiveAmount);

  // Outlier filter: drop quotes >5% better than the 3rd-best. Kept as a last
  // line of defence for a public post, on top of the site's own guards.
  let quotes = raw;
  if (raw.length >= 4) {
    const benchmark = raw[2].receiveAmount;
    quotes = raw.filter((q) => q.receiveAmount <= benchmark * 1.05);
  }

  return { quotes, latestCollected: latest };
}
