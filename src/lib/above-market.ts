/**
 * Labels for quotes priced better than the mid-market rate — CLIENT-SAFE (no imports).
 *
 * Owner decision 2026-10-12: every quote we collect is shown. A row beating the
 * mid-market rate used to be dropped (quote-integrity "beats-interbank"); it is
 * now shown, never ranked, and labelled by how far it beats the mid. A small
 * gap is what a promotional rate looks like (TapTap CAD→INR at 68 against a
 * 67.13 mid, +1.3%). A large one is not a rate anyone pays: the day this
 * shipped, Profee showed EUR→INR 12% above mid and Dahabshiil GBP→PKR 6% —
 * shown, but said to be what they most likely are.
 */

/** Beyond this many percent better than mid, the row is labelled a likely data error. */
export const FAR_ABOVE_MARKET_PCT = 2;

export function aboveMarketLabel(
  q: { aboveMarketPct?: number },
  form: "note" | "short" | "token" = "note",
): string {
  const far = (q.aboveMarketPct ?? 0) > FAR_ABOVE_MARKET_PCT;
  if (form === "short") return far ? "Far above market rate" : "Above market rate";
  if (form === "token") return far ? " (far above the market rate; check with the provider)" : " (above the market rate, likely a promo)";
  return far
    ? "Far above the market rate, may be a data error · check with the provider"
    : "Above the market rate, likely a promo that may not last";
}
