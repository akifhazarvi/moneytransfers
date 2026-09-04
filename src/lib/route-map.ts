/**
 * Does this internal URL actually render? One answer, used by every link.
 *
 * WHY THIS EXISTS
 * The dynamic routes are deliberately allowlisted — `/compare/[slug]` and
 * `/exchange-rates/history/[pair]` set `dynamicParams = false`, and
 * `/send-money/[corridor]` prerenders Tier 1–2 plus the ranking rescues — so a
 * URL outside the allowlist is a hard 404 by design. Link generators did not
 * know that. They mapped over the source data instead (every corridor, every
 * rate insight, every provider pairing), so the site shipped, as measured on
 * the 2026-09-02 build:
 *
 *     2,100 links → 370 corridor URLs that 404
 *       871 links → 4 retired corridors that 410 (863 of them /send-money/uk-to-europe)
 *       839 links → 289 rate-history URLs that 404
 *       371 links → 182 compare URLs that 404
 *     1,330 links → one compare URL that 301s to its canonical twin
 *
 * That is the same defect class as the broken logo paths: a path built by
 * convention from data, with nothing checking that the target exists. It is
 * also the class the 2026-09-01 GSC audit was cleaning up, where 15 of 35
 * impression-earning URLs were 404 or 410.
 *
 * RULE: never interpolate a slug into an internal href. Ask here first, and
 * drop the link when the answer is no. `npm run check:links` walks the built
 * HTML and fails the build on any internal link whose target has no page, so
 * the rule is enforced rather than remembered.
 *
 * Each predicate mirrors exactly one route's `generateStaticParams`. When you
 * change a route's gate, change its predicate in the same commit.
 */
import { allCorridors } from "@/data/corridors";
import { getCorridorTier } from "@/lib/corridor-tiers";
import { GONE_CORRIDOR_SLUGS } from "@/lib/gone-corridors";
import { RANKING_CORRIDOR_SLUGS } from "@/lib/ranking-corridors";
import { EDITORIAL_COMPARE_SLUGS, getCompareCanonicalSlug } from "@/lib/compare-canonical";
import { SITEMAP_COMPARISON_SLUGS } from "@/lib/sitemap-allowlists";
import { KEEP_HISTORY_PAIRS, getAllInsights, corridorToSlug } from "@/lib/rate-history";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";
import { GONE_SWIFT_SLUGS } from "@/lib/gone-swift";
import { GONE_COMPANY_SLUGS } from "@/lib/gone-companies";
import { getAllPilotBankSlugs } from "@/lib/bank-comparisons";
import { businessPages } from "@/data/business-pages";

/* ── /send-money/[corridor] ─────────────────────────────────────────────── */
// Mirrors generateStaticParams in src/app/[locale]/send-money/[corridor]/page.tsx.
const CORRIDOR_BY_SLUG = new Map(allCorridors.map((c) => [c.slug, c]));

export function corridorPageRenders(slug: string | undefined | null): boolean {
  if (!slug) return false;
  if (GONE_CORRIDOR_SLUGS.has(slug)) return false;
  const c = CORRIDOR_BY_SLUG.get(slug);
  if (!c) return false;
  if (RANKING_CORRIDOR_SLUGS.has(slug)) return true;
  return getCorridorTier(slug, c.fromCurrency, c.toCurrency, c.isCountryPage) <= 2;
}

/* ── /compare/[slug] ────────────────────────────────────────────────────── */
// dynamicParams = false, so only the two allowlists render. Provider order
// matters: the route 301s a non-canonical ordering to its canonical twin, and
// linking the redirect wastes a hop on every page that carries it.
export function comparePageRenders(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return EDITORIAL_COMPARE_SLUGS.has(slug) || SITEMAP_COMPARISON_SLUGS.has(slug);
}

/** Canonical compare slug if the pairing renders at all, else null. */
export function comparePageHref(slug: string | undefined | null): string | null {
  if (!slug) return null;
  const canonical = getCompareCanonicalSlug(slug);
  return comparePageRenders(canonical) ? `/compare/${canonical}` : null;
}

/* ── /exchange-rates/history/[pair] ─────────────────────────────────────── */
// dynamicParams = false; a pair needs BOTH an allowlist entry and enough
// history to produce an insight.
let historyPairs: Set<string> | null = null;
function renderableHistoryPairs(): Set<string> {
  if (!historyPairs) {
    historyPairs = new Set(
      getAllInsights(2)
        .map((i) => corridorToSlug(i.corridor))
        .filter((p) => KEEP_HISTORY_PAIRS.has(p)),
    );
  }
  return historyPairs;
}

export function rateHistoryPageRenders(pair: string | undefined | null): boolean {
  return Boolean(pair) && renderableHistoryPairs().has(pair as string);
}

/** `/exchange-rates/history/<pair>` when it renders, else null. */
export function rateHistoryHref(pair: string | undefined | null): string | null {
  return rateHistoryPageRenders(pair) ? `/exchange-rates/history/${pair}` : null;
}

/* ── data-list routes ───────────────────────────────────────────────────── */
// These prerender straight from a data list, so "renders" means "is in the
// list". They are listed here so link generators have one place to ask.
const PROVIDER_SLUGS = new Set(
  // Retired review pages serve 410 from middleware, so a link into one is a
  // link into a dead URL — drop it at the generator rather than the template.
  providers.map((p) => p.slug).filter((slug) => !GONE_COMPANY_SLUGS.has(slug)),
);
const GUIDE_SLUGS = new Set(blogPosts.map((p) => p.slug));
const NEWS_SLUGS = new Set(newsItems.map((n) => n.slug));
const IBAN_SLUGS = new Set(wiseCountries.filter((c) => c.slug).map((c) => c.slug as string));
const SWIFT_SLUGS = new Set(getSwiftCountries().filter((c) => !GONE_SWIFT_SLUGS.has(c.slug)).map((c) => c.slug));
const BANK_SLUGS = new Set(getAllPilotBankSlugs());
const BUSINESS_SLUGS = new Set(businessPages.map((p) => p.slug));

export const companyPageRenders = (slug?: string | null) => Boolean(slug && PROVIDER_SLUGS.has(slug));
export const guidePageRenders = (slug?: string | null) => Boolean(slug && GUIDE_SLUGS.has(slug));
export const newsPageRenders = (slug?: string | null) => Boolean(slug && NEWS_SLUGS.has(slug));
export const ibanPageRenders = (slug?: string | null) => Boolean(slug && IBAN_SLUGS.has(slug));
export const swiftPageRenders = (slug?: string | null) => Boolean(slug && SWIFT_SLUGS.has(slug));
export const bankPageRenders = (slug?: string | null) => Boolean(slug && BANK_SLUGS.has(slug));
export const businessPageRenders = (slug?: string | null) => Boolean(slug && BUSINESS_SLUGS.has(slug));

/**
 * Guides that are dedicated routes under src/app/[locale]/guides/ rather than
 * entries in blogPosts. Keep in sync with that directory.
 */
const STANDALONE_GUIDES = new Set([
  "bank-vs-app-transfer-cost-2026",
  "best-apps-to-send-money-from-us-2026",
  "best-day-to-send-money-abroad",
  "fx-cost-vs-purchasing-power",
  "gbp-forecast-2026",
]);

/* ── generic gate ───────────────────────────────────────────────────────── */
/**
 * True when an internal path renders. Static paths are assumed to render (they
 * are not generated from data and check:links catches a typo); every
 * data-driven family is checked against its route's gate.
 *
 * Affiliate redirects and API routes are intentionally excluded from this
 * check — /go and /out are 302 handlers, disallowed in robots.txt.
 */
export function internalPathRenders(path: string): boolean {
  const clean = path.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
  const seg = clean.split("/").filter(Boolean);
  if (seg.length === 0) return true;
  if (seg[0] === "go" || seg[0] === "out" || seg[0] === "api") return true;

  switch (seg[0]) {
    case "send-money":
      return seg.length === 1 || corridorPageRenders(seg[1]);
    case "compare":
      return seg.length === 1 || comparePageRenders(seg[1]);
    case "companies":
      return seg.length === 1 || companyPageRenders(seg[1]);
    case "guides":
      // The five flagship data-stories are their own routes rather than
      // blogPosts entries, so they are named here explicitly.
      return seg.length === 1 || guidePageRenders(seg[1]) || STANDALONE_GUIDES.has(seg[1]);
    case "news":
      return seg.length === 1 || newsPageRenders(seg[1]);
    case "iban":
      return seg.length === 1 || ibanPageRenders(seg[1]);
    case "swift-codes":
      return seg.length === 1 || swiftPageRenders(seg[1]);
    case "banks":
      return seg.length === 1 || bankPageRenders(seg[1]);
    case "business":
      return seg.length === 1 || businessPageRenders(seg[1]);
    case "exchange-rates":
      if (seg.length === 1) return true;
      if (seg[1] === "history") return seg.length === 2 || rateHistoryPageRenders(seg[2]);
      return true; // /exchange-rates/[pair] renders on demand
    default:
      return true; // static route
  }
}
