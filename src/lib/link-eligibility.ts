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
import eligible from "@/data/google-eligible-routes.json";

const ELIGIBLE: ReadonlySet<string> = new Set<string>(eligible.routes);

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
export function isLinkEligible(href: string): boolean {
  const path = internalPagePath(href);
  return path === null || ELIGIBLE.has(path);
}

/** The href when it may render as a link, else null — for `href ? <a> : text`. */
export function eligibleHref(href: string | null | undefined): string | null {
  return href && isLinkEligible(href) ? href : null;
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
 * The link pass every rendered HTML body goes through (renderDataTokens and
 * sanitizeHtml both end with it): ineligible internal anchors become their
 * text, and every /go/ or /out/ anchor gets the affiliate rel. Idempotent.
 */
export function gateBodyLinks(html: string): string {
  if (!html.includes("<a")) return html;
  return unlinkIneligible(html).replace(/<a\b([^>]*)>/gi, (whole, attrs: string) => {
    const href = attrs.match(/\bhref=(["'])(.*?)\1/i)?.[2];
    if (!isAffiliateHref(href)) return whole;
    const relMatch = attrs.match(/\srel=(["'])(.*?)\1/i);
    const rel = affiliateRel(relMatch?.[2] ?? "");
    const rest = relMatch ? attrs.replace(relMatch[0], "") : attrs;
    return `<a${rest} rel="${rel}">`;
  });
}
