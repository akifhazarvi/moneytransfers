/**
 * Quote ranking — CLIENT-SAFE.
 *
 * Lives apart from quotes-engine because the results table re-sorts in the
 * browser: SendMoneyClient owns the "Best value" control, so a ranking that
 * exists only on the server is silently overwritten on first render. That is
 * exactly what happened when this rule shipped inside the engine — the server
 * put TapTap Send first and the client put MoneyGram back on top.
 *
 * Both sides must import from here. quotes-engine pulls in ~4 MB of scraped
 * quotes and can never be imported by a client component; this module imports
 * only MONETISED_SLUGS from affiliate.ts, which has no imports of its own.
 */
import { MONETISED_SLUGS } from "@/lib/affiliate";

// How close two payouts must be before the difference stops being real
// information. Quotes are scraped every ~6 hours and major pairs routinely move
// more than this intraday, so a gap under the band says nothing reliable about
// which provider is actually cheaper at the moment someone transfers. On the
// USD->PKR screenshot that prompted this, the top two were separated by Rs47 on
// Rs138,500 — 0.034%, well inside the band, while the 4.7-rated provider sat
// below the 4.0-rated one. Kept deliberately tight: a wider band starts putting
// a visibly SMALLER payout above a larger one in a table that prints both in
// large type, which reads as broken and costs more trust than the slot is worth.
const MATERIALITY_BAND = 0.001; // 0.10%

/**
 * Rank by payout, then break *immaterial* differences toward a provider we have
 * a commercial relationship with.
 *
 * The strict payout order is preserved everywhere it carries information: a
 * provider that is materially cheaper always stays ahead, and nothing outside the
 * band ever moves. Only within the band — where the ordering was previously
 * decided by scrape timing and rounding — does the tie-break apply.
 *
 * This IS a commercial thumb on the scale and is disclosed as one. The affiliate
 * disclosure and the editorial policy both state the band and its size; changing
 * MATERIALITY_BAND without updating that copy makes the site's own claims false.
 */
export function rankQuotes<T extends { receiveAmount: number; providerSlug: string; rating?: number }>(
  quotes: T[],
): T[] {
  const ratingOf = (q: T) => q.rating ?? 0;
  const byPayout = [...quotes].sort((a, b) => b.receiveAmount - a.receiveAmount);
  const ranked: T[] = [];
  const pool = [...byPayout];
  while (pool.length) {
    const leader = pool[0].receiveAmount;
    // Everything indistinguishable from the current leader, in payout order.
    const bandEnd = pool.findIndex(
      (q) => leader <= 0 || (leader - q.receiveAmount) / leader > MATERIALITY_BAND,
    );
    const band = pool.splice(0, bandEnd === -1 ? pool.length : bandEnd);
    // Within the band the payout carries no information, so rating decides —
    // which is also the honest answer to "why is a 4.7 below a 4.0?". Partners
    // sort ahead of non-partners at equal standing; that part is commercial and
    // is disclosed as such.
    const byMerit = (a: T, b: T) =>
      (ratingOf(b) - ratingOf(a)) || (b.receiveAmount - a.receiveAmount);
    ranked.push(
      ...band.filter((q) => MONETISED_SLUGS.has(q.providerSlug)).sort(byMerit),
      ...band.filter((q) => !MONETISED_SLUGS.has(q.providerSlug)).sort(byMerit),
    );
  }
  return ranked;
}
