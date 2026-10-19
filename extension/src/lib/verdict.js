// "Is this a good deal?" One answer, shared by the popup's "You're on …" banner
// and the on-page price check, so the two can never disagree.
//
// It compares what the reader would get from the provider whose site they are
// on with the highest payout among the other providers we compare for the same
// route and amount. The provider's own figure is the payout its calculator shows
// on the page, when that figure is plausible (within 15% of the amount at the
// mid-market rate); otherwise the quote we collected. Wording follows the site's
// claim rules: "the most" only among 3+ priced providers, never "cheapest".

import { money, pct } from "./format.js";

/** Payouts this close are tied (src/lib/rank-quotes.ts MATERIALITY_BAND). */
export const TIE_BAND = 0.001;
/** Within this share of the best payout, the price is fair. */
export const FAIR_BAND = 0.005;

/**
 * @param c     a /api/ext/v1/compare payload
 * @param here  { name, slugs } from providerForHost()
 * @param live  the payout the provider's page shows for c.amount, in c.to (optional)
 */
export function judge(c, here, live) {
  const sent = money(c.amount, c.from, Number.isInteger(c.amount) ? 0 : undefined);
  const ranked = c.rows.filter((r) => r.ranked);
  const row = c.rows.find((r) => here.slugs.includes(r.slug)) ?? null;
  const others = ranked.filter((r) => !here.slugs.includes(r.slug));
  const best = others.reduce((a, b) => (!a || b.receive > a.receive ? b : a), null);
  const plausible = Boolean(live && c.mid && Math.abs(live / (c.amount * c.mid) - 1) < 0.15);
  const theirs = plausible ? live : row?.ranked ? row.receive : null;
  const base = { row, best, theirs, livePayout: plausible, sent, compared: ranked.length };

  if (!best) {
    return { ...base, tone: "unknown", title: "No comparison yet", text: `We don't have other providers' prices for ${c.from} → ${c.to} yet.` };
  }
  if (theirs == null) {
    return {
      ...base,
      tone: "unknown",
      title: "Compare before you send",
      text: `${best.name} pays ${money(best.receive, c.to)} for ${sent}. We don't have ${here.name}'s price for this route${row?.note ? ` (${row.note.toLowerCase()})` : ""}.`,
    };
  }

  const rank = 1 + others.filter((r) => r.receive > theirs).length;
  const field = others.length + 1;
  const gap = best.receive - theirs;
  const shows = plausible ? "shows" : "pays";
  if (gap <= theirs * TIE_BAND) {
    const among =
      field >= 3 ? `the most of the ${field} providers we compare` : `as much as the other provider we compare`;
    return {
      ...base,
      rank,
      field,
      gap: 0,
      tone: "good",
      title: "Good deal",
      text: `${here.name} ${shows} ${money(theirs, c.to)} for ${sent}: ${among}.`,
    };
  }
  const share = (gap / theirs) * 100;
  if (gap <= theirs * FAIR_BAND) {
    return {
      ...base,
      rank,
      field,
      gap,
      tone: "fair",
      title: "Fair price",
      text: `${best.name} pays ${money(gap, c.to)} more (${pct(share)}). ${here.name} is #${rank} of ${field} we compare.`,
    };
  }
  return {
    ...base,
    rank,
    field,
    gap,
    tone: "better",
    title: `You could get ${money(gap, c.to)} more`,
    text: `${best.name} pays ${money(best.receive, c.to)} for ${sent}, ${pct(share)} more than ${here.name}. ${here.name} is #${rank} of ${field} we compare.`,
  };
}
