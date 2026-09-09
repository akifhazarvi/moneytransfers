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
 * quotes and can never be imported by a client component; this module has no
 * imports at all.
 *
 * Commercial relationships play no part in this order. An earlier version
 * sorted affiliate partners ahead of non-partners inside the materiality band
 * and disclosed it as a tie-break — while the homepage, /methodology and
 * /editorial-policy all said no provider can pay for a higher position. Both
 * could not be true. Measured on 2026-09-03 across 72 corridor/amount runs, the
 * partner rule never changed a single ordering, so it was removed rather than
 * the promise. Do not reintroduce it without rewriting every one of those pages.
 */

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
 * Rank by payout, then break *immaterial* differences by customer rating.
 *
 * The strict payout order is preserved everywhere it carries information: a
 * provider that is materially cheaper always stays ahead, and nothing outside the
 * band ever moves. Only within the band — where the ordering was previously
 * decided by scrape timing and rounding — does the tie-break apply: higher
 * rating first, then the larger payout, then the slug, so the order is
 * deterministic and identical on server and client.
 *
 * The affiliate disclosure states the band and its size; changing
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
    // which is also the honest answer to "why is a 4.7 below a 4.0?".
    const byMerit = (a: T, b: T) =>
      (ratingOf(b) - ratingOf(a)) ||
      (b.receiveAmount - a.receiveAmount) ||
      a.providerSlug.localeCompare(b.providerSlug);
    ranked.push(...band.sort(byMerit));
  }
  return ranked;
}

/** The materiality band as a percentage, for copy that has to state it. */
export const MATERIALITY_BAND_PCT = MATERIALITY_BAND * 100;

/**
 * Providers ranked directly above a row that shows a LARGER payout.
 *
 * The band is relative but the credibility cost is absolute. 0.10% of a
 * ₹128,000 payout prints as ₹115, which reads as real money; the same band on
 * GBP→EUR is €1.17 and nobody notices. So on large-denomination corridors the
 * table shows ₹128,372 above ₹128,487 with no stated reason and looks broken —
 * the exact failure this module's header warns a wider band would cause.
 *
 * The ordering is deliberate, measured and disclosed, so this does not change
 * it. It marks the rows where the order visibly contradicts the number beside
 * it, so the table can say why instead of leaving the reader to guess.
 *
 * ADJACENT PAIRS ONLY, and this is the whole design. A first attempt marked any
 * row with a larger payout anywhere below it and lit up 21 of 31 rows on
 * GBP→INR, because generateQuotes appends indicative quotes — pinned at
 * mid-market, so higher than every real one — after the ranked list, and
 * because banding cascades: band 2's leader is legitimately below band 1's
 * members. Neither case is visually jarring. Only two neighbouring rows where
 * the lower one prints a bigger number need explaining.
 *
 * Indicative rows are excluded on both sides: they are estimates, already
 * labelled as such, and never claim to be a real quote to beat.
 */
export function tiedAboveLargerPayout<
  T extends { receiveAmount: number; providerSlug: string; isIndicative?: boolean },
>(ranked: T[]): Set<string> {
  const marked = new Set<string>();
  for (let i = 0; i < ranked.length - 1; i++) {
    const here = ranked[i];
    const next = ranked[i + 1];
    if (here.isIndicative || next.isIndicative) continue;
    if (next.receiveAmount > here.receiveAmount) marked.add(here.providerSlug);
  }
  return marked;
}
