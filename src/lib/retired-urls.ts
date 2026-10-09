/**
 * The one answer for a retired URL — used by middleware (to respond) and by
 * scripts/check-redirects.ts (to prove every 301 lands on a rendered page in
 * one hop). Pure: no next/server import, so a build script can call it.
 */
import { GONE_CORRIDOR_SLUGS, DUPLICATE_CORRIDOR_REDIRECTS } from "./gone-corridors";
import { GONE_SWIFT_SLUGS } from "./gone-swift";
import { GONE_RATE_PAIR_SLUGS, RATE_PAIR_REDIRECTS, RATE_HISTORY_REDIRECTS } from "./gone-rate-pairs";
import { GONE_COMPANY_SLUGS } from "./gone-companies";
import { GONE_NEWS_SLUGS, NEWS_REDIRECTS } from "./gone-news";
import { getCompareCanonicalSlug, EDITORIAL_COMPARE_SLUGS } from "./compare-canonical";
import { SITEMAP_COMPARISON_SLUGS } from "./sitemap-allowlists";

export const GONE = Symbol("gone");

/**
 * What a retired URL answers: GONE (410), the path of the live same-intent
 * page to 301 to, or null when the URL is not retired. Every target here is a
 * page that renders, so a redirect is always one hop to a 200
 * (scripts/check-redirects.ts asserts it against the build).
 *
 * - /send-money/<slug>: retired corridors (gone-corridors.ts). Duplicate
 *   pair-mates used to 301 to a twin in another country; since 2026-10-08
 *   they are 410 (brief §3.2: a different corridor is not the same query).
 * - /swift-codes/<country>: retired SWIFT pages (gone-swift.ts), 410.
 * - /exchange-rates/<pair>: 301 to the same pair's rate history, or 410 —
 *   never to the hub (gone-rate-pairs.ts).
 * - /exchange-rates/history/<pair>: a pair with no history page but a
 *   standalone page 301s there.
 * - /companies/<slug>: retired reviews, 410.
 * - /news/<slug>: a merged item 301s to its survivor, a retired one is 410.
 * - /compare/<a>-vs-<b>: the non-canonical direction 301s to the canonical
 *   one (Bing Webmaster Blog, Dec 2025: consolidate variants with a 301).
 * - /comparison and /comparison/<slug>: the old section name. Resolved here,
 *   not in next.config redirects, which 308'd /comparison/<slug> to
 *   /compare/<slug> and so chained into the canonical-direction 301
 *   (/comparison/moneygram-vs-wise → /compare/moneygram-vs-wise →
 *   /compare/wise-vs-moneygram). One hop to the canonical page, or 410 when
 *   that pairing no longer renders.
 */
export function retiredAnswer(pathname: string): string | typeof GONE | null {
  const corridor = pathname.match(/^\/send-money\/([a-z0-9-]+)$/);
  if (corridor) {
    const twin = DUPLICATE_CORRIDOR_REDIRECTS.get(corridor[1]);
    if (twin) return `/send-money/${twin}`;
    return GONE_CORRIDOR_SLUGS.has(corridor[1]) ? GONE : null;
  }
  const swift = pathname.match(/^\/swift-codes\/([a-z0-9-]+)$/);
  if (swift) return GONE_SWIFT_SLUGS.has(swift[1]) ? GONE : null;
  const history = pathname.match(/^\/exchange-rates\/history\/([a-z0-9-]+)$/);
  if (history) return RATE_HISTORY_REDIRECTS.get(history[1]) ?? null;
  const rate = pathname.match(/^\/exchange-rates\/([a-z0-9-]+)$/);
  if (rate) {
    const sameRate = RATE_PAIR_REDIRECTS.get(rate[1]);
    if (sameRate) return sameRate;
    return GONE_RATE_PAIR_SLUGS.has(rate[1]) ? GONE : null;
  }
  const company = pathname.match(/^\/companies\/([a-z0-9-]+)$/);
  if (company) return GONE_COMPANY_SLUGS.has(company[1]) ? GONE : null;
  const news = pathname.match(/^\/news\/([a-zA-Z0-9-]+)$/);
  if (news) {
    const survivor = NEWS_REDIRECTS.get(news[1]);
    if (survivor) return `/news/${survivor}`;
    return GONE_NEWS_SLUGS.has(news[1]) ? GONE : null;
  }
  if (pathname === "/comparison") return "/compare";
  const comparison = pathname.match(/^\/comparison\/([a-z0-9-]+)$/);
  if (comparison) {
    const canonical = getCompareCanonicalSlug(comparison[1]);
    return EDITORIAL_COMPARE_SLUGS.has(canonical) || SITEMAP_COMPARISON_SLUGS.has(canonical) ? `/compare/${canonical}` : GONE;
  }
  const compare = pathname.match(/^\/compare\/([a-z0-9-]+)$/);
  if (compare) {
    const canonical = getCompareCanonicalSlug(compare[1]);
    return canonical !== compare[1] ? `/compare/${canonical}` : null;
  }
  return null;
}
