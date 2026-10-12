/**
 * Labels for quotes shown but never ranked — CLIENT-SAFE (no imports).
 *
 * Owner decision 2026-10-12: never hide a quote. Rows the integrity guards
 * used to drop are shown as collected, after every ranked row, with a label
 * that says why they are not ranked:
 *
 *   above-market  better than the mid-market rate. A small gap is what a
 *                 promotional rate looks like (TapTap CAD→INR at 68 against a
 *                 67.13 mid, +1.3%); a large one is not a rate anyone pays
 *                 (TapTap RON→COP +12% the day this shipped).
 *   implausible   a fee above half the amount or a markup above 25% — a misread
 *                 field more often than a price (TapTap HUF→EUR at 0.002
 *                 against a 0.00274 mid).
 *   stale         collected more than 72h before the freshest quote: the
 *                 scraper stopped (Ria, 2026-10-09 to -11).
 */

/** Beyond this many percent better than mid, an above-market row is labelled a likely data error. */
export const FAR_ABOVE_MARKET_PCT = 2;

type Labelled = { unranked?: "above-market" | "implausible" | "stale"; aboveMarketPct?: number; dateCollected?: string };
type Form = "note" | "short" | "token";

function collectedOn(iso?: string): string {
  if (!iso) return "earlier";
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function unrankedLabel(q: Labelled, form: Form = "note"): string {
  switch (q.unranked) {
    case "stale":
      if (form === "short") return `Collected ${collectedOn(q.dateCollected)}`;
      if (form === "token") return ` (collected ${collectedOn(q.dateCollected)}, may be out of date)`;
      return `Collected ${collectedOn(q.dateCollected)}, may be out of date`;
    case "implausible":
      if (form === "short") return "Possible data error";
      if (form === "token") return " (possible data error; check with the provider)";
      return "Fee or rate far outside a real price, may be a data error · check with the provider";
    case "above-market": {
      const far = (q.aboveMarketPct ?? 0) > FAR_ABOVE_MARKET_PCT;
      if (form === "short") return far ? "Far above market rate" : "Above market rate";
      if (form === "token") return far ? " (far above the market rate; check with the provider)" : " (above the market rate, likely a promo)";
      return far
        ? "Far above the market rate, may be a data error · check with the provider"
        : "Above the market rate, likely a promo that may not last";
    }
    default:
      return "";
  }
}
