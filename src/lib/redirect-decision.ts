/**
 * Shared decision logic for the affiliate redirect routes (/go and /out). Both
 * routes call `decideRedirect` with the signals they've already computed, then
 * act on the returned outcome. Keeping this in one place guarantees /go and
 * /out behave identically.
 *
 * Owner decision, 2026-10-05: every provider except TapTap Send goes through a
 * review page (/go/<provider>/review) where TapTap is cross-sold beside the
 * visitor's pick, with the app install and WhatsApp channel. TapTap, the paid
 * partner, keeps the instant redirect. This reverses the 2026-09-03 removal of
 * the interstitial for humans; the trade, recorded so it can be judged on data:
 * a second click on the way to every other provider (`go_review_continue`
 * measures who takes it) in exchange for a TapTap offer on every outbound
 * click. A side effect: junk /go volume no longer forwards to Impact and
 * Partnerize, since a page that is never clicked forwards nothing.
 *
 * The three outcomes:
 *
 *   "redirect"       Forward to the provider now: a TapTap click from a
 *                    person (valid token, or tokenless and not a
 *                    self-identifying crawler), or any provider once the
 *                    review page's Continue comes back with ?continue=1.
 *
 *   "interstitial"   The review page, for every other provider's human hit,
 *                    on-site (valid token) or not.
 *
 *   "not_forwarded"  A self-identifying automated client without a valid
 *                    token. It gets the same review page — a mislabelled
 *                    human can still click Continue — but is not counted as a
 *                    genuine click.
 *
 * genuineClick is the token alone: "came from a real click on our own page".
 */
import type { TokenStatus } from "@/lib/click-token";
import providerNamesData from "@/data/provider-names.json";

const providerNames = providerNamesData as Record<string, string>;

/** Providers forwarded straight through, with no review page (incl. the legacy alias in affiliate.ts). */
export const DIRECT_PROVIDERS: ReadonlySet<string> = new Set(["taptap-send", "taptapsend"]);

/**
 * Human-readable provider name. Falls back to a Title-Cased version of the slug
 * when the slug isn't in the display-name map (unknown-but-valid slugs still
 * redirect, so they still need a name to show).
 */
export function providerDisplayName(slug: string): string {
  const known = providerNames[slug];
  if (known) return known;
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export type RedirectOutcome = "redirect" | "interstitial" | "not_forwarded";

export function decideRedirect(input: {
  provider: string;
  tokenStatus: TokenStatus;
  isBot: boolean;
}): { outcome: RedirectOutcome; genuineClick: boolean; gated: boolean } {
  const genuineClick = input.tokenStatus === "valid";

  if (!DIRECT_PROVIDERS.has(input.provider)) {
    return { outcome: input.isBot && !genuineClick ? "not_forwarded" : "interstitial", genuineClick, gated: true };
  }
  // TapTap: a proven on-site click forwards immediately; so does a tokenless
  // hit that is not a self-identifying crawler (the people who arrive on a /go
  // URL that ChatGPT or Perplexity printed — a stateless GET cannot separate
  // them from scrapers running a real browser UA). genuineClick=false keeps the
  // two populations apart in reporting.
  if (genuineClick) return { outcome: "redirect", genuineClick: true, gated: false };
  if (input.isBot) return { outcome: "not_forwarded", genuineClick: false, gated: true };
  return { outcome: "redirect", genuineClick: false, gated: false };
}

/**
 * Where the review page lives for a hit: same query (from/to/amount/src and
 * the click_id/cid/ai_src/t attribution), so Continue can hand all of it back
 * to the route. `via=out` sends Continue back through /out. Built from the
 * provider rather than the request path so a locale-prefixed path cannot leak
 * into it.
 */
export function reviewPath(provider: string, requestUrl: string, via: "go" | "out"): string {
  const params = new URL(requestUrl).searchParams;
  params.delete("continue");
  if (via === "out") params.set("via", "out");
  const qs = params.toString();
  return `/go/${provider}/review${qs ? `?${qs}` : ""}`;
}
