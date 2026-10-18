/**
 * The comparison an IBAN surface hands its reader: the route and amount the
 * country page's own live table prices, so "compare all providers" continues
 * the table the reader just saw instead of resetting to a geo default.
 *
 * Moved out of /iban/[slug] on 2026-10-18 so the IBAN checker on /iban and the
 * country pages' closing links name the same route. Before that the country
 * page's two "compare" links went to bare /send-money and dropped both the
 * destination and the amount.
 */
import { wiseCountries } from "@/data/wise-iban";
import { assignTableAmounts } from "@/lib/table-amounts";
import { compareHashHref } from "@/lib/link-eligibility";

// Default sending currency for the inline comparison. USD is the largest
// outbound remittance market and the site's default quote currency; the widget
// is skipped entirely when it would produce a same-currency corridor.
const SEND_FROM_CURRENCY = "USD";
/**
 * Euro countries whose largest sending market is the UK quote GBP→EUR instead:
 * every euro IBAN page quoting USD→EUR printed the same provider rows, the bulk
 * of what France, Ireland, Portugal and Spain shared (round-3 duplicate crawl).
 */
const GBP_SENDER_SLUGS = new Set(["ireland", "spain", "portugal", "france", "cyprus", "malta"]);

export function ibanSendFrom(slug: string): string {
  return GBP_SENDER_SLUGS.has(slug) ? "GBP" : SEND_FROM_CURRENCY;
}

/** Distinct table amount per page on a shared currency — see table-amounts.ts. */
const IBAN_TABLE_AMOUNTS = assignTableAmounts(
  wiseCountries.filter((c) => c.slug),
  (c) => c.slug!,
  (c) => `${ibanSendFrom(c.slug!)}-${c.currency}`,
  "iban",
);

export interface IbanComparison {
  from: string;
  to: string;
  amount: number;
  /** /send-money#from=…&to=…&amount=… */
  href: string;
}

/** Null when the country's currency is the sending currency (no corridor to price). */
export function ibanComparison(slug: string, currency: string): IbanComparison | null {
  const from = ibanSendFrom(slug);
  if (!currency || currency === from) return null;
  const amount = IBAN_TABLE_AMOUNTS.get(slug) ?? 1050;
  return { from, to: currency, amount, href: compareHashHref(from, currency, amount) };
}
