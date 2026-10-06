import pulse from "@/data/research/reader-pulse.json";
import { getProviderName, popularCorridors } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { hasProviderLogo, providerLogo } from "@/lib/provider-logo";
import { SITE_STATS } from "@/lib/site-stats";
import LiveActivityToast, { type RateUpdate } from "./LiveActivityToast";

/**
 * Live activity toast, site-wide (mounted once in the layout): every 10–15
 * seconds a small card under the header shows one real thing — a reader in a
 * country comparing a route or choosing a provider (first-party, via
 * /api/live-activity), the top payout on a popular route from the quotes this
 * build carries, or what readers' picks were worth over 30 days
 * (reader-pulse.json). Every card says when it happened.
 *
 * Rendered in the browser only: none of its text is in any page's HTML, so it
 * adds nothing to the text pages hold in common (CLAUDE.md strict rule 3).
 * Only numbers, codes and paths cross the server boundary here.
 */

/** A route's top payout is news only when there is a field to top. */
const MIN_PROVIDERS = 3;
const REFERENCE_AMOUNT = 1000;
/** Figures older than this past the build's quotes step aside until refreshed. */
const MAX_SUMMARY_AGE_DAYS = 45;

// Same quotes for every page of a build: work them out once.
let cachedRates: RateUpdate[] | null = null;

function rateUpdates(): RateUpdate[] {
  if (cachedRates) return cachedRates;
  const out: RateUpdate[] = [];
  for (const { from, to } of popularCorridors) {
    const quotes = generateQuotes(REFERENCE_AMOUNT, from, to).filter((q) => !q.isIndicative && q.receiveAmount > 0);
    if (quotes.length < MIN_PROVIDERS) continue;
    const top = quotes.reduce((a, b) => (b.receiveAmount > a.receiveAmount ? b : a));
    const at = Date.parse(top.dateCollected ?? "") || Date.parse(SITE_STATS.quotesUpdatedAt);
    out.push({
      from,
      to,
      amount: REFERENCE_AMOUNT,
      provider: getProviderName(top.providerSlug),
      ...(hasProviderLogo(top.providerSlug) ? { logo: providerLogo(top.providerSlug) } : {}),
      receive: Math.round(top.receiveAmount),
      providers: quotes.length,
      at,
    });
  }
  cachedRates = out;
  return out;
}

export default function LiveActivity() {
  const summaryAgeDays = (Date.parse(SITE_STATS.quotesUpdatedAt) - Date.parse(`${pulse.choices.to}T00:00:00Z`)) / 86_400_000;
  const vsBankPer1000 = summaryAgeDays <= MAX_SUMMARY_AGE_DAYS ? pulse.choices.vsBankPer1000 : null;
  return <LiveActivityToast rates={rateUpdates()} vsBankPer1000={vsBankPer1000} />;
}
