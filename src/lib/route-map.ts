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
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";
import { GONE_SWIFT_SLUGS } from "@/lib/gone-swift";
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

/* ── data-list routes ───────────────────────────────────────────────────── */
// These prerender straight from a data list, so "renders" means "is in the
// list". They are listed here so link generators have one place to ask.
const GUIDE_SLUGS = new Set(blogPosts.map((p) => p.slug));
const NEWS_SLUGS = new Set(newsItems.map((n) => n.slug));
const IBAN_SLUGS = new Set(wiseCountries.filter((c) => c.slug).map((c) => c.slug as string));
const SWIFT_SLUGS = new Set(getSwiftCountries().filter((c) => !GONE_SWIFT_SLUGS.has(c.slug)).map((c) => c.slug));
const BANK_SLUGS = new Set(getAllPilotBankSlugs());
const BUSINESS_SLUGS = new Set(businessPages.map((p) => p.slug));

// Lives in ./company-route so client components can ask it without this
// module's data graph; re-exported here so server callers keep one entry point.
export { companyPageRenders } from "./company-route";
export const guidePageRenders = (slug?: string | null) => Boolean(slug && GUIDE_SLUGS.has(slug));
export const newsPageRenders = (slug?: string | null) => Boolean(slug && NEWS_SLUGS.has(slug));
export const ibanPageRenders = (slug?: string | null) => Boolean(slug && IBAN_SLUGS.has(slug));
export const swiftPageRenders = (slug?: string | null) => Boolean(slug && SWIFT_SLUGS.has(slug));
export const bankPageRenders = (slug?: string | null) => Boolean(slug && BANK_SLUGS.has(slug));
export const businessPageRenders = (slug?: string | null) => Boolean(slug && BUSINESS_SLUGS.has(slug));
