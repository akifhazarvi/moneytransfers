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
  // ── Re-verified against live GSC on 2026-09-20 ────────────────────────────
  //
  // The list below used to hold eleven slugs, admitted on a 2026-09-01 pull of
  // 2026-06-02 → 08-30. A fresh pull shows that evidence has decayed to noise:
  //
  //   trailing 90d (2026-06-22 → 09-20), domain property
  //     switzerland-to-egypt          17 impr, pos 2.0, 1 click
  //     send-money-to-algeria (/fr/)  24 impr, pos 11.8, 1 click
  //     eur-to-cad                     1 impr, 0 clicks   (was 20 impr)
  //     gbp-to-gtq                     2 impr, 0 clicks   (was 20 impr)
  //     south-korea-to-south-africa    1 impr, 0 clicks   (was 24 impr)
  //     sweden-to-vietnam              1 impr, 0 clicks
  //     denmark-to-brazil              1 impr, 0 clicks
  //     saudi-arabia-to-vietnam        2 impr, 0 clicks
  //     send-money-to-serbia           1 impr, 0 clicks
  //     belgium-to-mexico              1 impr, 0 clicks
  //     eur-to-nok                     3 impr, pos 55.0, 0 clicks
  //
  //   trailing 28d (2026-08-23 → 09-20): 277 impressions and 12 clicks across
  //   the WHOLE property, every one of them on the homepage, plus four nav
  //   hubs at 8 impressions each on position 1 (brand sitelinks). Not one
  //   corridor earned a single impression.
  //
  // This file's rule is "average position <= 30, or >= 1 click, in the
  // trailing 90 days". A single impression sitting at position 2 satisfies the
  // position half of that on a sample of one, which is measurement noise
  // rather than a ranking — so only the two with a real click are kept.
  //
  // Keeping the rest would have exempted them from the duplication policy on
  // the strength of traffic that no longer exists. That is the failure mode
  // this file was written to prevent, pointed the other way.
  "switzerland-to-egypt",         // 17 impr, pos 2.0, 1 click (90d)
  "send-money-to-algeria",        // 24 impr, pos 11.8, 1 click (90d, via /fr/)
]);
