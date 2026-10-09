/**
 * Counter 2 of the three provider counts — "providers compared for this
 * query" — as prose can use it. The definitions of all three live in
 * site-stats.ts (search "THE THREE PROVIDER COUNTS").
 *
 * Split from site-stats because it runs generateQuotes(): site-stats is imported
 * by i18n/request.ts on every route, and keeping the quote engine out of that
 * module keeps it out of routes that never compare anything.
 *
 * Server-only (quotes-engine imports the full quote corpus).
 */
import { generateQuotes } from "@/lib/quotes-engine";

/**
 * Distinct providers with a comparable (non-indicative) estimate for sending
 * `amount` of each `from` currency to `to` — the rows a comparison table for
 * that query prints, counted the way {{PROVIDER_TALLY}} and the corridor
 * pages count them.
 */
export function providersComparedOn(from: readonly string[], to: string, amount = 1000): number {
  const slugs = new Set<string>();
  for (const f of from) {
    for (const q of generateQuotes(amount, f, to)) if (!q.isIndicative) slugs.add(q.providerSlug);
  }
  return slugs.size;
}

/** "14 providers" / "1 provider" — the count with its noun, so prose cannot pluralise wrong. */
export function providersComparedPhrase(from: readonly string[], to: string, amount = 1000): string {
  const n = providersComparedOn(from, to, amount);
  return `${n} provider${n === 1 ? "" : "s"}`;
}

/**
 * {{ROUTE_PROVIDERS:USD:INR}} → "20 providers";
 * {{ROUTE_PROVIDERS:USD,EUR,GBP:COP}} → providers quoting any of those routes;
 * {{ROUTE_PROVIDERS:AED:PKR:3000}} → at a stated amount (default 1,000 units of
 * each send currency). With no provider quoting, the token is left in place so
 * check:assets fails the build rather than printing "0 providers".
 *
 * Resolved by renderDataTokens (article bodies) AND by blog-posts.ts on titles,
 * meta descriptions and excerpts, which never pass through the renderer.
 */
export function resolveRouteProviderTokens(text: string): string {
  if (!text.includes("{{ROUTE_PROVIDERS:")) return text;
  return text.replace(
    /\{\{ROUTE_PROVIDERS:([A-Z]{3}(?:,[A-Z]{3})*):([A-Z]{3})(?::(\d+))?\}\}/g,
    (match, from: string, to: string, amt?: string) => {
      const n = providersComparedOn(from.split(","), to, amt ? Number(amt) : 1000);
      return n > 0 ? `${n} provider${n === 1 ? "" : "s"}` : match;
    },
  );
}
