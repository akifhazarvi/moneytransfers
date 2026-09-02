/**
 * Corridors that Google or Bing actively ranks — never delete these.
 *
 * Context (2026-09-01): a live GSC pull for 2026-06-02 → 2026-08-30 showed the
 * site earned 52 clicks / 2,007 impressions, with only 35 URLs earning any
 * impression at all. Fifteen of those 35 were returning 404, 410, or a 301 into
 * a 404 — including pages sitting at position 1–3. The tier classifier had
 * demoted them to Tier 3 on provider count, and `dynamicParams = false` turned
 * that into a hard 404. Provider count is a data-richness signal; it says
 * nothing about whether a page ranks.
 *
 * THE RULE THIS FILE ENFORCES: never 404/410 a URL that ranks — defined as
 * average position ≤ 30, or ≥1 click, in the trailing 90 days on Google or
 * Bing. The threshold matters: a bare "≥1 impression" test would also protect
 * genuinely thin pages that surface on page 5 and convert nothing (e.g.
 * /swift-codes/serbia, 340 words at position 46 with no clicks, correctly
 * retired). Position ≤ 30 is page 1–3 — reachable, worth defending.
 * Membership here forces Tier 1, so the
 * page is built, indexable, and in the sitemap regardless of provider count —
 * and `gone-corridors.ts` subtracts this set from GONE_CORRIDOR_SLUGS, so a
 * slug can never be simultaneously ranking and retired.
 *
 * Each entry records the GSC evidence that earned it a place. Re-verify against
 * a fresh GSC pull before removing any of them; an entry that has genuinely
 * dropped to zero impressions across two consecutive 90-day windows can go.
 */
export const RANKING_CORRIDOR_SLUGS = new Set<string>([
  // ── Was Tier 3 → hard 404. All of these ranked while returning 404. ──
  "switzerland-to-egypt",         // 24 impr, pos 2.0, 1 click
  "south-korea-to-south-africa",  // 24 impr, pos 3.2
  "eur-to-cad",                   // 20 impr, pos 2.5
  "gbp-to-gtq",                   // 20 impr, pos 2.6
  "eur-to-nok",                   //  9 impr, pos 24.0
  "sweden-to-vietnam",            //  8 impr, pos 2.1
  "send-money-to-serbia",         //  6 impr, pos 3.0
  "denmark-to-brazil",            //  3 impr, pos 1.3
  "saudi-arabia-to-vietnam",      //  3 impr, pos 1.7
  // Reached via /fr/ locale URLs that 301 here; the target had been deleted,
  // so the redirect chained into a 404 and the impressions went nowhere.
  "send-money-to-algeria",        // 43 impr, pos 8.8, 1 click (via /fr/)
  "uk-to-guatemala",              // 28 impr, pos 3.5 (via /fr/)

  // ── Was in GONE_CORRIDOR_SLUGS → 410. ──
  "south-africa-to-nigeria",      //  9 impr, pos 6.2 — retired in the Jun 25 cleanup
  "belgium-to-mexico",            //  1 impr, pos 5.0 — retired in the Aug 31 EUR collapse
]);
