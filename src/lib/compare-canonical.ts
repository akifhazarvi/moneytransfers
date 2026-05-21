/**
 * Determine the canonical /compare/X-vs-Y direction for a given pair.
 *
 * The page component renders both "wise-vs-ofx" and "ofx-vs-wise" with the
 * same data — without a canonical hint, Google sees them as duplicates and
 * picks one direction itself, often the one we'd rather not rank.
 *
 * The set below is the GSC-winning direction for each pair: any slug that
 * earned ≥1 impression in the 90-day window ending 2026-05-18, with the
 * higher-impression direction kept when both sides have data. New pairs
 * (no GSC signal yet) fall through to alphabetical canonical.
 *
 * Regenerate via scripts/regen-compare-canonical.ts when a fresh GSC pull
 * makes the data stale. Manual edit acceptable for one-off fixes.
 */

const GSC_WINNING_SLUGS = new Set<string>([
  "ace-money-transfer-vs-nationwide",
  "anz-vs-westpac",
  "anz-vs-xe",
  "bank-of-america-vs-barclays",
  "bank-of-america-vs-commonwealth-bank",
  "bank-of-america-vs-santander",
  "barclays-vs-nationwide",
  "barclays-vs-natwest",
  "barclays-vs-paysend",
  "barclays-vs-santander",
  "boss-money-vs-deutsche-bank",
  "boss-money-vs-remitly",
  "chase-vs-bank-of-america",
  "chase-vs-hsbc",
  "commonwealth-bank-vs-anz",
  "commonwealth-bank-vs-scotiabank",
  "commonwealth-bank-vs-td-bank",
  "commonwealth-bank-vs-united-overseas-bank",
  "commonwealth-bank-vs-westpac",
  "currencies-direct-vs-fairfx",
  "currencyfair-vs-chase",
  "currencyfair-vs-deutsche-bank",
  "currencyfair-vs-fairfx",
  "dahabshiil-vs-deutsche-bank",
  "deutsche-bank-vs-remitly",
  "hsbc-vs-commonwealth-bank",
  "hsbc-vs-lloyds",
  "hsbc-vs-nationwide",
  "hsbc-vs-natwest",
  "hsbc-vs-paysend",
  "hsbc-vs-remitly",
  "hsbc-vs-santander",
  "instarem-vs-ace-money-transfer",
  "lloyds-vs-nationwide",
  "lloyds-vs-natwest",
  "lloyds-vs-paysend",
  "lloyds-vs-rbs",
  "lloyds-vs-remitly",
  "lloyds-vs-transfergo",
  "lloyds-vs-xe",
  "moneygram-vs-ace-money-transfer",
  "moneygram-vs-dahabshiil",
  "moneygram-vs-hsbc",
  "moneygram-vs-instarem",
  "moneygram-vs-mukuru",
  "moneygram-vs-nationwide",
  "moneygram-vs-sbi",
  "moneygram-vs-taptap-send",
  "moneygram-vs-xoom",
  "mukuru-vs-remitly",
  "nationwide-vs-paysend",
  "nationwide-vs-wise",
  "natwest-vs-rbs",
  "ofx-vs-bank-of-america",
  "ofx-vs-currencies-direct",
  "ofx-vs-moneygram",
  "ofx-vs-nationwide",
  "ofx-vs-paypal",
  "ofx-vs-revolut",
  "ofx-vs-taptap-send",
  "ofx-vs-torfx",
  "ofx-vs-western-union",
  "ofx-vs-worldremit",
  "ofx-vs-xe",
  "ofx-vs-xoom",
  "panda-remit-vs-united-overseas-bank",
  "paypal-vs-ace-money-transfer",
  "paypal-vs-anz",
  "paypal-vs-bank-of-america",
  "paypal-vs-chase",
  "paypal-vs-moneygram",
  "paypal-vs-natwest",
  "paypal-vs-rbs",
  "paypal-vs-santander",
  "paypal-vs-sbi",
  "paypal-vs-scotiabank",
  "paypal-vs-torfx",
  "paypal-vs-xoom",
  "paysend-vs-profee",
  "pnb-europe-vs-rbs",
  "remitly-vs-ace-money-transfer",
  "remitly-vs-anz",
  "remitly-vs-commonwealth-bank",
  "remitly-vs-currencies-direct",
  "remitly-vs-instarem",
  "remitly-vs-koho",
  "remitly-vs-moneygram",
  "remitly-vs-ofx",
  "remitly-vs-paypal",
  "remitly-vs-revolut",
  "remitly-vs-santander",
  "remitly-vs-scotiabank",
  "remitly-vs-taptap-send",
  "remitly-vs-wells-fargo",
  "remitly-vs-western-union",
  "remitly-vs-worldremit",
  "remitly-vs-xe",
  "remitly-vs-xoom",
  "revolut-vs-bank-of-america",
  "revolut-vs-chase",
  "revolut-vs-commonwealth-bank",
  "revolut-vs-hsbc",
  "revolut-vs-lloyds",
  "revolut-vs-monese",
  "revolut-vs-moneygram",
  "revolut-vs-nationwide",
  "revolut-vs-natwest",
  "revolut-vs-santander",
  "revolut-vs-taptap-send",
  "revolut-vs-torfx",
  "revolut-vs-transfergo",
  "revolut-vs-wells-fargo",
  "revolut-vs-westpac",
  "ria-vs-boss-money",
  "skrill-vs-currencies-direct",
  "skrill-vs-nationwide",
  "taptap-send-vs-ace-money-transfer",
  "taptap-send-vs-barclays",
  "taptap-send-vs-currencies-direct",
  "taptap-send-vs-hsbc",
  "taptap-send-vs-monese",
  "taptap-send-vs-nationwide",
  "taptap-send-vs-sendwave",
  "taptap-send-vs-transfergo",
  "taptap-send-vs-westpac",
  "torfx-vs-ace-money-transfer",
  "torfx-vs-instarem",
  "torfx-vs-taptap-send",
  "wells-fargo-vs-anz",
  "wells-fargo-vs-panda-remit",
  "wells-fargo-vs-profee",
  "wells-fargo-vs-transfergo",
  "western-union-vs-ace-money-transfer",
  "western-union-vs-bank-of-america",
  "western-union-vs-instarem",
  "western-union-vs-moneygram",
  "western-union-vs-nationwide",
  "western-union-vs-natwest",
  "western-union-vs-paypal",
  "western-union-vs-pnb-europe",
  "western-union-vs-santander",
  "western-union-vs-sbi",
  "western-union-vs-scotiabank",
  "western-union-vs-taptap-send",
  "western-union-vs-torfx",
  "western-union-vs-wells-fargo",
  "western-union-vs-wise",
  "western-union-vs-worldremit",
  "western-union-vs-xoom",
  "westpac-vs-wise",
  "wise-vs-anz",
  "wise-vs-barclays",
  "wise-vs-commonwealth-bank",
  "wise-vs-deutsche-bank",
  "wise-vs-instarem",
  "wise-vs-moneygram",
  "wise-vs-ofx",
  "wise-vs-panda-remit",
  "wise-vs-paypal",
  "wise-vs-rbs",
  "wise-vs-revolut",
  "wise-vs-ria",
  "wise-vs-taptap-send",
  "wise-vs-worldremit",
  "wise-vs-xe",
  "wise-vs-xoom",
  "worldremit-vs-ace-money-transfer",
  "worldremit-vs-currencies-direct",
  "worldremit-vs-instarem",
  "worldremit-vs-revolut",
  "worldremit-vs-sbi",
  "worldremit-vs-sendwave",
  "worldremit-vs-taptap-send",
  "worldremit-vs-torfx",
  "xe-vs-ace-money-transfer",
  "xe-vs-currencies-direct",
  "xe-vs-moneygram",
  "xe-vs-nationwide",
  "xe-vs-paypal",
  "xe-vs-revolut",
  "xe-vs-scotiabank",
  "xe-vs-torfx",
  "xe-vs-xoom",
  "xoom-vs-ace-money-transfer",
  "xoom-vs-taptap-send",
  "xoom-vs-torfx",
]);

/**
 * Editorial article slugs from src/data/comparison-articles.ts. Maintained
 * separately (rather than imported) so this module stays edge-runtime safe
 * for middleware — comparison-articles.ts pulls in providers, scraped quote
 * data, and ~7000 lines we don't want in the edge bundle.
 *
 * Editorial slugs are always canonical: the editorial owner deliberately
 * picked the direction, often the one Google already indexes. Keep this list
 * in sync when a new editorial article ships.
 */
const EDITORIAL_COMPARE_SLUGS = new Set<string>([
  "wise-vs-remitly", "remitly-vs-xe", "wise-vs-western-union", "wise-vs-xe",
  "wise-vs-paypal", "remitly-vs-western-union", "wise-vs-revolut",
  "remitly-vs-xoom", "remitly-vs-taptap-send", "remitly-vs-revolut",
  "remitly-vs-moneygram", "chase-vs-revolut", "wise-vs-westpac",
  "chase-vs-hsbc", "boss-money-vs-remitly", "lloyds-vs-nationwide",
  "western-union-vs-bank-of-america", "paypal-vs-xoom", "moneygram-vs-revolut",
  "moneygram-vs-wise", "moneygram-vs-worldremit", "moneygram-vs-xoom",
  "paypal-vs-revolut", "paypal-vs-western-union", "paypal-vs-worldremit",
  "remitly-vs-worldremit", "revolut-vs-western-union", "revolut-vs-worldremit",
  "revolut-vs-xoom", "western-union-vs-worldremit", "western-union-vs-xoom",
  "wise-vs-worldremit", "wise-vs-moneygram", "wise-vs-xoom",
  "worldremit-vs-xoom", "xe-vs-moneygram", "xe-vs-paypal", "xe-vs-revolut",
  "xe-vs-western-union", "xe-vs-worldremit", "xe-vs-xoom",
  "remitly-vs-paypal", "paypal-vs-moneygram",
]);

/**
 * Returns the canonical /compare/X-vs-Y slug for a given input.
 *
 * Rules (first match wins):
 *  1. If the slug is an editorial article, it's canonical.
 *  2. If the reverse is an editorial article, return that.
 *  3. If the slug is the GSC-winning direction, it's canonical.
 *  4. If the reverse is the GSC-winning direction, return that.
 *  5. Otherwise (no GSC signal either direction yet), return alphabetical.
 *
 * Returns the input unchanged if it doesn't match the X-vs-Y pattern
 * (let the page handle the 404 via parseSlug).
 */
export function getCompareCanonicalSlug(slug: string): string {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return slug;
  const [a, b] = parts;
  const reverse = `${b}-vs-${a}`;
  if (EDITORIAL_COMPARE_SLUGS.has(slug)) return slug;
  if (EDITORIAL_COMPARE_SLUGS.has(reverse)) return reverse;
  if (GSC_WINNING_SLUGS.has(slug)) return slug;
  if (GSC_WINNING_SLUGS.has(reverse)) return reverse;
  // No GSC signal — default to alphabetical
  const [first, second] = [a, b].sort();
  return `${first}-vs-${second}`;
}
