import pulse from "@/data/research/reader-pulse.json";
import { getProviderName, popularCorridors } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { SITE_STATS } from "@/lib/site-stats";
import LiveActivityStrip, { type RateUpdate } from "./LiveActivityStrip";

/**
 * Live activity strip: one real thing happening on the site at a time —
 * a reader in a country comparing a route or choosing a provider (GA4, via
 * /api/live-activity, fetched in the browser), the top payout on a popular
 * route from the quotes this build carries, and what readers' picks were
 * worth over 30 days (reader-pulse.json). Every item states when it happened.
 *
 * Rendered in the browser, not the server HTML: the same sentences on every
 * guide and hub would raise each page's share of text it holds in common with
 * the others (CLAUDE.md strict rule 3). Only numbers and codes cross the
 * server boundary here.
 */

/** A route's top payout is news only when there is a field to top. */
const MIN_PROVIDERS = 3;
const REFERENCE_AMOUNT = 1000;
/** Figures older than this past the build's quotes step aside until the pull resumes. */
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
    out.push({ from, to, provider: getProviderName(top.providerSlug), receive: Math.round(top.receiveAmount), providers: quotes.length, at });
  }
  cachedRates = out;
  return out;
}

export default function LiveActivity({ placement }: { placement: string }) {
  const summaryAgeDays = (Date.parse(SITE_STATS.quotesUpdatedAt) - Date.parse(`${pulse.choices.to}T00:00:00Z`)) / 86_400_000;
  const summary = summaryAgeDays <= MAX_SUMMARY_AGE_DAYS
    ? { vsBankPer1000: pulse.choices.vsBankPer1000, countries: pulse.countries.codes }
    : null;
  return <LiveActivityStrip placement={placement} rates={rateUpdates()} summary={summary} />;
}
