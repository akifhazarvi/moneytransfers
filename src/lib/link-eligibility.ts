/**
 * May this internal link render as a link?
 *
 * Owner decision 2026-10-08 (round-3 freelance brief §5.1–5.2): an internal
 * link points only at a page Google may index — the paths in
 * sitemap-google.xml, generated into google-eligible-routes.json by
 * scripts/build-google-eligible-routes.ts. A link to anything else (Bing-only
 * pages, pages noindexed everywhere, redirects, 410s) renders its anchor text
 * as plain text. Released pages rejoin the list on the next build, so their
 * links come back without touching the components.
 *
 * Safe in client components: the list is ~300 short strings.
 * Enforced on the built HTML by scripts/check-link-eligibility.ts.
 */
import { cache } from "react";
import eligible from "@/data/google-eligible-routes.json";
import { trackedProviderHref } from "@/lib/affiliate";

const ELIGIBLE: ReadonlySet<string> = new Set<string>(eligible.routes);

/**
 * Bing-only pages (sitemap.xml minus sitemap-google.xml), owner decision
 * 2026-11-15 after the Bing readout: a Bing-only page may link to another
 * Bing-only page. Rule 14 left these ~350 pages with no internal links at all
 * (found through sitemap.xml alone), while Bing ties internal links to
 * authority and to grounding eligibility for Copilot answers. A page Google
 * indexes still links only to Google-eligible pages, so Google's link graph
 * does not change: the source of every new link is a page Google is told not
 * to index.
 */
const BING_ONLY: ReadonlySet<string> = new Set<string>(
  (eligible as { routes: string[]; bingOnlyRoutes?: string[] }).bingOnlyRoutes ?? [],
);

/**
 * The page being rendered, per request: React's cache() is scoped to one
 * server render. A Bing-only page route calls setLinkSource() before it
 * renders anything. In client components and outside a render, cache() does
 * not memoise, so the scope reads "not Bing-only" and links stay
 * Google-only, which also keeps server and client output identical.
 */
const linkScope = cache((): { bingOnlySource: boolean } => ({ bingOnlySource: false }));

/** Paths that are not pages: affiliate redirects, APIs, files. Never gated. */
const NON_PAGE_PREFIXES = ["/go/", "/out/", "/api/", "/_next/", "/logos/", "/images/", "/pwa/", "/icons/"];

/**
 * The page path an href points at, or null when the href is not an internal
 * page (external URL, mailto/tel, in-page anchor, affiliate redirect, file).
 */
export function internalPagePath(href: string): string | null {
  if (!href) return null;
  let path = href.trim();
  if (path.startsWith("https://sendmoneycompare.com")) path = path.slice("https://sendmoneycompare.com".length) || "/";
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  path = path.replace(/[?#].*$/, "");
  if (NON_PAGE_PREFIXES.some((prefix) => path.startsWith(prefix))) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return null;
  path = path.replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

/** True unless the href is an internal page that Google may not index. */
/**
 * Round-4 brief §0.3, Option A (2026-10-27): the /companies and /compare hubs
 * link their major reviews and comparisons — the brief's Bing-demand lists for
 * waves 2 and 3 (worksheet 11) — even while those pages are withheld from
 * Google, so neither hub is a dead end. A link to a noindex page is not
 * penalised; a hub with no children reads as an empty directory. Only the hub
 * itself may link these (EligibleLink/Card `hub` prop), and
 * check:link-eligibility accepts exactly these pairs.
 */
export const HUB_CHILD_LINKS: Readonly<Record<string, readonly string[]>> = {
  "/companies": [
    "/companies/remitly", "/companies/taptap-send", "/companies/xoom", "/companies/instarem",
    "/companies/wise", "/companies/worldremit", "/companies/western-union", "/companies/moneygram",
    "/companies/lemfi", "/companies/ofx", "/companies/xe", "/companies/ria",
  ],
  "/compare": [
    "/compare/western-union-vs-moneygram", "/compare/paypal-vs-revolut", "/compare/wise-vs-revolut",
    "/compare/wise-vs-paypal", "/compare/wise-vs-remitly", "/compare/wise-vs-westpac",
    "/compare/remitly-vs-western-union", "/compare/remitly-vs-paypal", "/compare/remitly-vs-taptap-send",
    "/compare/wise-vs-worldremit", "/compare/remitly-vs-moneygram", "/compare/revolut-vs-hsbc",
    "/compare/hsbc-vs-paypal", "/compare/wise-vs-taptap-send",
  ],
};

/** True when `hub` may link `href` under Option A above. */
export function hubChildLinkAllowed(hub: string | null | undefined, href: string): boolean {
  const path = internalPagePath(href);
  return Boolean(hub && path && HUB_CHILD_LINKS[hub]?.includes(path));
}

/** Called by a page route before it renders: is this page Bing-only? */
export function setLinkSource(pagePath: string): void {
  const path = internalPagePath(pagePath);
  linkScope().bingOnlySource = path !== null && BING_ONLY.has(path);
}

export function isLinkEligible(href: string): boolean {
  const path = internalPagePath(href);
  return path === null || ELIGIBLE.has(path) || (BING_ONLY.has(path) && linkScope().bingOnlySource);
}

/** The same rule with an explicit source page — for check:link-eligibility. */
export function isLinkEligibleFrom(source: string, href: string): boolean {
  const path = internalPagePath(href);
  return path === null || ELIGIBLE.has(path) || (BING_ONLY.has(source) && BING_ONLY.has(path));
}

/** The href when it may render as a link, else null — for `href ? <a> : text`. */
export function eligibleHref(href: string | null | undefined, hub?: string): string | null {
  return href && (isLinkEligible(href) || hubChildLinkAllowed(hub, href)) ? href : null;
}

/**
 * Unwrap ineligible internal anchors in an HTML string, keeping their inner
 * text — for guide, news and editorial bodies rendered with
 * dangerouslySetInnerHTML. Anchors are not nested in these bodies, so the
 * non-greedy match is exact.
 */
export function unlinkIneligible(html: string): string {
  return html.replace(/<a\b([^>]*?)\bhref=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi, (whole, _pre, _q, href: string, _post, inner: string) =>
    isLinkEligible(href) ? whole : inner,
  );
}

/**
 * The comparison for a currency pair — the eligible stand-in for a corridor
 * page Google may not index (the reader still lands on that route's quotes).
 * A hash, not a query: route selections stay out of crawlable URLs.
 */
export function compareHashHref(from?: string | null, to?: string | null, amount?: number | null): string {
  if (!from || !to) return "/send-money";
  return `/send-money#from=${from}&to=${to}${amount ? `&amount=${amount}` : ""}`;
}

/**
 * Point a body's bare "compare" links (href="/send-money") at the route and
 * amount the page already prices, so a reader who follows one lands on the
 * comparison they were reading about, not a geo default. Links that already
 * name a route, corridor page or fragment are left alone.
 */
export function routeBareCompareLinks(html: string, from?: string | null, to?: string | null, amount?: number | null): string {
  const href = compareHashHref(from, to, amount);
  if (href === "/send-money") return html;
  return html.replace(/href=(["'])\/send-money\1/g, (_m, q: string) => `href=${q}${href}${q}`);
}

/** True for an affiliate redirect (/go/…, /out/…), relative or absolute. */
export function isAffiliateHref(href: string | null | undefined): boolean {
  return Boolean(href && /^(https:\/\/sendmoneycompare\.com)?\/(go|out)\//.test(href.trim()));
}

/**
 * The rel an affiliate link carries (round-3 brief §5.4): always
 * `nofollow sponsored noopener`, plus `noreferrer` when the link already had
 * it. Pass the rel the call site would otherwise have used.
 */
export function affiliateRel(existing = ""): string {
  const had = new Set(existing.split(/\s+/).filter(Boolean));
  return ["nofollow", "sponsored", "noopener", ...(had.has("noreferrer") ? ["noreferrer"] : [])].join(" ");
}

/**
 * JSX props for a link to a provider's own site (PROVIDER_SITES in
 * affiliate.ts): its tracked /go/<slug>?page= href with the affiliate rel. Null
 * for any other URL — the call site keeps its own href and rel.
 */
export function trackedProviderLinkProps(url: string | null | undefined, src: string): { href: string; rel: string; target: "_blank" } | null {
  const href = trackedProviderHref(url, src);
  return href ? { href, rel: affiliateRel(), target: "_blank" } : null;
}

/**
 * The link pass every rendered HTML body goes through (renderDataTokens and
 * sanitizeHtml both end with it): ineligible internal anchors become their
 * text, a direct link to a provider's own site (PROVIDER_SITES in affiliate.ts)
 * becomes its tracked /go/<slug>?page= link, and every /go/ or /out/ anchor
 * gets the affiliate rel. Idempotent.
 */
export function gateBodyLinks(html: string): string {
  if (!html.includes("<a")) return html;
  return unlinkIneligible(html).replace(/<a\b([^>]*)>/gi, (whole, attrs: string) => {
    const hrefMatch = attrs.match(/\bhref=(["'])(.*?)\1/i);
    const href = hrefMatch?.[2];
    const tracked = trackedProviderHref(href?.replace(/&amp;/g, "&"));
    if (hrefMatch && tracked) {
      // No noreferrer: /go is ours, and its affiliate_redirect event records
      // the page the click came from (referer_path).
      const rest = attrs.replace(hrefMatch[0], `href="${tracked.replace(/&/g, "&amp;")}"`).replace(/\srel=(["'])(.*?)\1/i, "");
      return `<a${rest} rel="${affiliateRel()}">`;
    }
    if (!isAffiliateHref(href)) return whole;
    const relMatch = attrs.match(/\srel=(["'])(.*?)\1/i);
    const rel = affiliateRel(relMatch?.[2] ?? "");
    const rest = relMatch ? attrs.replace(relMatch[0], "") : attrs;
    return `<a${rest} rel="${rel}">`;
  });
}
