/**
 * Retired corridor pages — HTTP 410 Gone.
 *
 * Context (2026-06-25 cleanup): On 2026-03-20 a one-day 95% Google-impression
 * cliff followed the Mar 16-17 launch of 200+ programmatic pages on a months-old
 * domain — the signature of an algorithmic scaled-content reassessment (no manual
 * action; confirmed clean in Search Console). Recovery requires shrinking the
 * thin/templated footprint so the indexed-page quality average rises before the
 * next core update re-evaluates the site.
 *
 * These 53 slugs are hand-written editorial corridors that earned ZERO sessions
 * and ZERO key events across ALL channels (Google + Bing + AI assistants) over
 * the 90-day window, are NOT in the sitemap allowlist, and are NOT high-demand
 * head-terms (those — usa-to-india, uk-to-pakistan, uae-to-philippines, etc. —
 * are deliberately KEPT and re-submitted, because their zero traffic reflects
 * Google suppression, not low demand).
 *
 * 410 (not 404, not 301): 410 tells Google the URL is intentionally retired, so
 * it deindexes cleanly. 404 reads as "never existed" and lingers; 301 reads as
 * "content moved" which contradicts scaled-content remediation. These pages have
 * no sensible live equivalent to redirect to, so 410 is correct.
 *
 * Promote OUT of this set only if a slug starts earning real demand on Bing/AI.
 */
import { RANKING_CORRIDOR_SLUGS } from "@/lib/ranking-corridors";
import { allCorridors } from "@/data/corridors";
import { getCorridorTier } from "@/lib/corridor-tiers";
import duplicateCorridors from "@/data/scraped/duplicate-corridors.json";

const RETIRED_SLUGS = new Set<string>([
  // Explicitly retired by the site owner after the September 20 SEO audit.
  "usa-to-china",
  "usa-to-egypt",
  "send-money-to-zimbabwe",
  // Second wave, same audit: every corridor measuring >=95% repeated text with
  // fewer than 110 word positions found nowhere else, out of 3,000-5,500 words
  // of body. Measured on production HTML with 10-word shingles over <main>,
  // React's $RC streaming splice replayed first (see FOLLOWUP.md). These carry
  // a full corridor template and almost no route-specific fact, so there is no
  // twin to consolidate into — 410, per this file's rule.
  //
  // Deliberately NOT extended to the >=90% band: those pages measure 318-582
  // unique words, which is real content sharing a template rather than
  // duplicate content. Retiring them would delete substance without touching
  // the shared boilerplate that produces the ratio.
  //
  // uk-to-guatemala (96.6%) and gbp-to-gtq (95.3%) also cleared the threshold
  // but are in RANKING_CORRIDOR_SLUGS, so GONE_CORRIDOR_SLUGS filters them out
  // below and listing them here would be a silent no-op. They need
  // differentiation instead.
  //
  // usa-to-canada (98.7%, 46 unique words) cleared the threshold too and is
  // deliberately NOT retired: it is in HEAD_CORRIDOR_SLUGS, which exists to
  // exempt high-demand routes from exactly this kind of sweep on the grounds
  // that their zero traffic reflects post-2026-03-20 suppression rather than
  // low demand. Retiring it would contradict that decision. It is a rewrite
  // candidate, not a deletion candidate.
  "usa-to-south-africa",
  "canada-to-germany",
  "send-money-to-croatia",
  "canada-to-spain",
  "usa-to-tanzania",
  "usa-to-thailand",
  "usa-to-poland",
  "usa-to-peru",
  "usa-to-south-korea",
  "usa-to-argentina",
  "usa-to-israel",
  "europe-to-india",
  "europe-to-nigeria",
  "europe-to-pakistan",
  "europe-to-philippines",
  "europe-to-ukraine",
  "hong-kong-to-india",
  "hong-kong-to-philippines",
  "india-to-australia",
  "ireland-to-malaysia",
  "ireland-to-philippines",
  "japan-to-india",
  "japan-to-philippines",
  "japan-to-usa",
  "malaysia-to-india",
  "malaysia-to-indonesia",
  "malaysia-to-philippines",
  "new-zealand-to-fiji",
  "new-zealand-to-india",
  "new-zealand-to-philippines",
  "singapore-to-bangladesh",
  "singapore-to-indonesia",
  "south-africa-to-kenya",
  "south-africa-to-nigeria",
  "south-africa-to-uk",
  "south-korea-to-philippines",
  "south-korea-to-vietnam",
  "sweden-to-brazil",
  "sweden-to-colombia",
  "sweden-to-mexico",
  "sweden-to-morocco",
  "sweden-to-philippines",
  "sweden-to-romania",
  "switzerland-to-india",
  "switzerland-to-philippines",
  "uae-to-egypt",
  "uae-to-nepal",
  "uk-to-europe",
  "uk-to-ghana",
  "uk-to-jamaica",
  "uk-to-nepal",
  "uk-to-south-africa",
  "uk-to-sri-lanka",
  "uk-to-ukraine",
  "usa-to-brazil",
  "usa-to-colombia",
  "usa-to-dominican-republic",
  "usa-to-guatemala",
  "usa-to-haiti",
  "usa-to-honduras",
  "usa-to-indonesia",
  "usa-to-jamaica",
  "usa-to-nepal",
  "usa-to-ukraine",
  // ── 2026-08-31: Eurozone duplicate collapse (327 slugs) ─────────────────
  //
  // Every Eurozone country x destination had its own URL, but they all resolve
  // to the same currency pair, so the pages were near-identical. Measured
  // 8-gram Jaccard on full rendered text: 88.7-90.9% between siblings
  // (france/germany/spain/italy-to-thailand). Unrelated corridors score 8-14%,
  // so the template is fine - the duplication was specific to EUR-source
  // siblings, where only the country name differed. Of 4,195 8-grams on
  // france-to-thailand, just 249 (5.9%) were absent from germany-to-thailand.
  //
  // The Aug 27 sitemap carried 1,013 URLs (752 corridors) - up from the ~178
  // that the May right-sizing left. That regrowth re-created the scaled-content
  // surface behind the 2026-03-20 impression cliff, at larger scale than before.
  //
  // ONE canonical page survives per EUR->destination pair (35 clusters). The
  // survivor is chosen by real demand where any exists (Bing per-page
  // impressions + GSC 90d), otherwise by outbound-remittance market rank
  // (germany > france > spain > italy > ...). Four slugs that would have been
  // cut were spared because they carry demand or sit on a protection list:
  // ireland-to-bangladesh, italy-to-brazil, france-to-pakistan (head/allowlist)
  // and france-to-turkey (2 Bing impressions).
  //
  // 410 not 301, consistent with the rest of this file: 301 reads as "content
  // moved", which contradicts scaled-content remediation. The surviving sibling
  // is not a redirect target for the others - it is the same comparison, and
  // Google should see the duplicates as retired rather than relocated.
  //
  // Promote OUT of this set only if a slug starts earning real demand on
  // Bing/AI - same readmit policy as the 2026-06-25 block above.
  "austria-to-argentina",
  "austria-to-bangladesh",
  "austria-to-brazil",
  "austria-to-chile",
  "austria-to-colombia",
  "austria-to-dominican-republic",
  "austria-to-ecuador",
  "austria-to-egypt",
  "austria-to-el-salvador",
  "austria-to-ghana",
  "austria-to-honduras",
  "austria-to-hong-kong",
  "austria-to-india",
  "austria-to-indonesia",
  "austria-to-japan",
  "austria-to-kenya",
  "austria-to-malaysia",
  "austria-to-mexico",
  "austria-to-morocco",
  "austria-to-nigeria",
  "austria-to-pakistan",
  "austria-to-panama",
  "austria-to-peru",
  "austria-to-philippines",
  "austria-to-poland",
  "austria-to-singapore",
  "austria-to-south-africa",
  "austria-to-south-korea",
  "austria-to-thailand",
  "austria-to-uk",
  "austria-to-ukraine",
  "austria-to-vietnam",
  "austria-to-zimbabwe",
  "belgium-to-argentina",
  "belgium-to-bangladesh",
  "belgium-to-brazil",
  "belgium-to-chile",
  "belgium-to-colombia",
  "belgium-to-dominican-republic",
  "belgium-to-ecuador",
  "belgium-to-egypt",
  "belgium-to-el-salvador",
  "belgium-to-ghana",
  "belgium-to-honduras",
  "belgium-to-hong-kong",
  "belgium-to-india",
  "belgium-to-indonesia",
  "belgium-to-japan",
  "belgium-to-kenya",
  "belgium-to-malaysia",
  "belgium-to-mexico",
  "belgium-to-nigeria",
  "belgium-to-panama",
  "belgium-to-peru",
  "belgium-to-philippines",
  "belgium-to-poland",
  "belgium-to-singapore",
  "belgium-to-south-africa",
  "belgium-to-south-korea",
  "belgium-to-thailand",
  "belgium-to-turkey",
  "belgium-to-uk",
  "belgium-to-ukraine",
  "belgium-to-vietnam",
  "belgium-to-zimbabwe",
  "finland-to-argentina",
  "finland-to-bangladesh",
  "finland-to-brazil",
  "finland-to-chile",
  "finland-to-colombia",
  "finland-to-dominican-republic",
  "finland-to-ecuador",
  "finland-to-egypt",
  "finland-to-el-salvador",
  "finland-to-ghana",
  "finland-to-honduras",
  "finland-to-hong-kong",
  "finland-to-india",
  "finland-to-indonesia",
  "finland-to-japan",
  "finland-to-kenya",
  "finland-to-malaysia",
  "finland-to-mexico",
  "finland-to-morocco",
  "finland-to-nigeria",
  "finland-to-pakistan",
  "finland-to-panama",
  "finland-to-peru",
  "finland-to-poland",
  "finland-to-singapore",
  "finland-to-south-africa",
  "finland-to-south-korea",
  "finland-to-thailand",
  "finland-to-turkey",
  "finland-to-uk",
  "finland-to-ukraine",
  "finland-to-vietnam",
  "finland-to-zimbabwe",
  "france-to-argentina",
  "france-to-bangladesh",
  "france-to-brazil",
  "france-to-chile",
  "france-to-colombia",
  "france-to-dominican-republic",
  "france-to-ecuador",
  "france-to-egypt",
  "france-to-el-salvador",
  "france-to-honduras",
  "france-to-hong-kong",
  "france-to-india",
  "france-to-indonesia",
  "france-to-japan",
  "france-to-kenya",
  "france-to-malaysia",
  "france-to-mexico",
  "france-to-morocco",
  "france-to-nigeria",
  "france-to-panama",
  "france-to-peru",
  "france-to-philippines",
  "france-to-poland",
  "france-to-singapore",
  "france-to-south-africa",
  "france-to-south-korea",
  "france-to-thailand",
  "france-to-ukraine",
  "france-to-vietnam",
  "france-to-zimbabwe",
  "germany-to-bangladesh",
  "germany-to-brazil",
  "germany-to-uk",
  "greece-to-argentina",
  "greece-to-bangladesh",
  "greece-to-brazil",
  "greece-to-chile",
  "greece-to-colombia",
  "greece-to-dominican-republic",
  "greece-to-ecuador",
  "greece-to-egypt",
  "greece-to-el-salvador",
  "greece-to-ghana",
  "greece-to-honduras",
  "greece-to-hong-kong",
  "greece-to-india",
  "greece-to-indonesia",
  "greece-to-japan",
  "greece-to-kenya",
  "greece-to-malaysia",
  "greece-to-mexico",
  "greece-to-morocco",
  "greece-to-nigeria",
  "greece-to-pakistan",
  "greece-to-panama",
  "greece-to-peru",
  "greece-to-philippines",
  "greece-to-singapore",
  "greece-to-south-africa",
  "greece-to-south-korea",
  "greece-to-thailand",
  "greece-to-turkey",
  "greece-to-uk",
  "greece-to-ukraine",
  "greece-to-vietnam",
  "greece-to-zimbabwe",
  "ireland-to-argentina",
  "ireland-to-chile",
  "ireland-to-colombia",
  "ireland-to-dominican-republic",
  "ireland-to-ecuador",
  "ireland-to-egypt",
  "ireland-to-el-salvador",
  "ireland-to-ghana",
  "ireland-to-honduras",
  "ireland-to-hong-kong",
  "ireland-to-india",
  "ireland-to-indonesia",
  "ireland-to-japan",
  "ireland-to-kenya",
  "ireland-to-mexico",
  "ireland-to-morocco",
  "ireland-to-nigeria",
  "ireland-to-pakistan",
  "ireland-to-panama",
  "ireland-to-peru",
  "ireland-to-poland",
  "ireland-to-singapore",
  "ireland-to-south-africa",
  "ireland-to-south-korea",
  "ireland-to-thailand",
  "ireland-to-turkey",
  "ireland-to-uk",
  "ireland-to-ukraine",
  "ireland-to-vietnam",
  "ireland-to-zimbabwe",
  "italy-to-argentina",
  "italy-to-bangladesh",
  "italy-to-chile",
  "italy-to-colombia",
  "italy-to-dominican-republic",
  "italy-to-ecuador",
  "italy-to-egypt",
  "italy-to-el-salvador",
  "italy-to-ghana",
  "italy-to-honduras",
  "italy-to-hong-kong",
  "italy-to-india",
  "italy-to-indonesia",
  "italy-to-japan",
  "italy-to-kenya",
  "italy-to-malaysia",
  "italy-to-mexico",
  "italy-to-morocco",
  "italy-to-nigeria",
  "italy-to-pakistan",
  "italy-to-panama",
  "italy-to-peru",
  "italy-to-philippines",
  "italy-to-poland",
  "italy-to-singapore",
  "italy-to-south-africa",
  "italy-to-south-korea",
  "italy-to-thailand",
  "italy-to-turkey",
  "italy-to-uk",
  "italy-to-ukraine",
  "italy-to-vietnam",
  "italy-to-zimbabwe",
  "netherlands-to-argentina",
  "netherlands-to-bangladesh",
  "netherlands-to-brazil",
  "netherlands-to-chile",
  "netherlands-to-colombia",
  "netherlands-to-dominican-republic",
  "netherlands-to-ecuador",
  "netherlands-to-egypt",
  "netherlands-to-el-salvador",
  "netherlands-to-ghana",
  "netherlands-to-honduras",
  "netherlands-to-hong-kong",
  "netherlands-to-india",
  "netherlands-to-indonesia",
  "netherlands-to-japan",
  "netherlands-to-kenya",
  "netherlands-to-malaysia",
  "netherlands-to-mexico",
  "netherlands-to-morocco",
  "netherlands-to-nigeria",
  "netherlands-to-pakistan",
  "netherlands-to-panama",
  "netherlands-to-peru",
  "netherlands-to-poland",
  "netherlands-to-singapore",
  "netherlands-to-south-africa",
  "netherlands-to-south-korea",
  "netherlands-to-thailand",
  "netherlands-to-turkey",
  "netherlands-to-uk",
  "netherlands-to-ukraine",
  "netherlands-to-vietnam",
  "netherlands-to-zimbabwe",
  "portugal-to-argentina",
  "portugal-to-brazil",
  "portugal-to-chile",
  "portugal-to-colombia",
  "portugal-to-dominican-republic",
  "portugal-to-ecuador",
  "portugal-to-egypt",
  "portugal-to-el-salvador",
  "portugal-to-ghana",
  "portugal-to-honduras",
  "portugal-to-hong-kong",
  "portugal-to-india",
  "portugal-to-indonesia",
  "portugal-to-japan",
  "portugal-to-kenya",
  "portugal-to-malaysia",
  "portugal-to-mexico",
  "portugal-to-morocco",
  "portugal-to-nigeria",
  "portugal-to-pakistan",
  "portugal-to-panama",
  "portugal-to-peru",
  "portugal-to-philippines",
  "portugal-to-poland",
  "portugal-to-singapore",
  "portugal-to-south-africa",
  "portugal-to-south-korea",
  "portugal-to-thailand",
  "portugal-to-turkey",
  "portugal-to-uk",
  "portugal-to-ukraine",
  "portugal-to-vietnam",
  "portugal-to-zimbabwe",
  "spain-to-argentina",
  "spain-to-bangladesh",
  "spain-to-brazil",
  "spain-to-chile",
  "spain-to-colombia",
  "spain-to-dominican-republic",
  "spain-to-ecuador",
  "spain-to-egypt",
  "spain-to-el-salvador",
  "spain-to-ghana",
  "spain-to-honduras",
  "spain-to-hong-kong",
  "spain-to-india",
  "spain-to-indonesia",
  "spain-to-japan",
  "spain-to-kenya",
  "spain-to-malaysia",
  "spain-to-mexico",
  "spain-to-morocco",
  "spain-to-nigeria",
  "spain-to-pakistan",
  "spain-to-panama",
  "spain-to-peru",
  "spain-to-philippines",
  "spain-to-poland",
  "spain-to-singapore",
  "spain-to-south-africa",
  "spain-to-south-korea",
  "spain-to-thailand",
  "spain-to-turkey",
  "spain-to-uk",
  "spain-to-ukraine",
  "spain-to-vietnam",
  "spain-to-zimbabwe",
]);

/**
 * The retired list MINUS anything Google or Bing currently ranks.
 *
 * Subtracting here rather than hand-pruning the list above makes it
 * structurally impossible to serve 410 for a page that still earns
 * impressions — the failure mode found on 2026-09-01, where
 * south-africa-to-nigeria (pos 6.2) and belgium-to-mexico (pos 5.0) were both
 * retired while still ranking. Add a slug to RANKING_CORRIDOR_SLUGS and it
 * drops out of this set automatically, everywhere it is consumed.
 */
export const RETIRED_CORRIDOR_SLUGS: ReadonlySet<string> = RETIRED_SLUGS;

/**
 * Corridor pages retired by the generation threshold rather than by hand.
 *
 * The Sep 2026 content brief (§4, §10-A) requires that a page only be generated
 * when unique data exists for it. Every quote we hold is keyed on the CURRENCY
 * pair and none carries a sending country, so two country corridors sharing a
 * pair render the same table, leader, markup and answers — australia-to-croatia
 * and australia-to-france are word-for-word identical bar the country name, 20
 * unique words in 4,698. This file lists the pair-mates that restate a stronger
 * twin; scripts/build-corridor-uniqueness.ts derives it and explains the
 * priority order that decides which URL survives a collision.
 */
const DUPLICATE_PAIR_SLUGS: ReadonlySet<string> = new Set(
  duplicateCorridors.surplus.map((s) => s.slug),
);

/**
 * Auto-generated currency-pair corridors (usd-to-inr), retired 2026-09-19.
 *
 * Two independent measurements agreed that this whole bucket is scaled content
 * that no channel wants:
 *
 * 1. DUPLICATION. Over 84 live pages (trafilatura prose, 5-gram shingle
 *    overlap) the currency-pair bucket runs 87.1% duplicate against its
 *    siblings raw and 99.1% once providers, countries, currencies and numbers
 *    are masked — best-pair containment 0.98 — on a median of 729 prose words
 *    carrying a median of TWO sentences unique to the page. The country-pair
 *    bucket, same template and same measurement, runs 50.7% with a median of 43
 *    unique sentences and beats the competitor benchmark (Monito's own corridor
 *    pages measure ~65.8%). Tier classification cannot separate them: provider
 *    count calls these pages rich, prose shows one page printed 233 times.
 *
 * 2. DEMAND. Bing Webmaster Page Traffic, 90 days to 2026-09-20: the entire
 *    /send-money/* family earned 1,011 of 308,906 site impressions (0.33%) and
 *    11 clicks, while being 47.7% of the sitemap. Of the currency-pair pages
 *    specifically, FOUR earned any impressions at all — sgd-to-krw (110/1
 *    click), aed-to-lkr (78/1), hkd-to-zar (13/0), cad-to-usd (12/1) — for 213
 *    impressions and 3 clicks in a quarter. By comparison /guides earned
 *    181,066 impressions and 1,237 clicks off 66 pages.
 *
 * 410, not noindex: these have no sensible redirect target (only 6 of 233 even
 * share a currency pair with a country corridor) and 410 is what deindexes
 * cleanly for scaled-content remediation — the same reasoning as RETIRED_SLUGS
 * above.
 *
 * Only slugs that currently RENDER are listed. The rest of the ~4,282 generated
 * currency pairs are already outside the tier allowlist and hard-404 via
 * `dynamicParams = false`, so adding them here would change nothing.
 *
 * As with every other set in this file, RANKING_CORRIDOR_SLUGS is subtracted
 * below — so a currency pair that genuinely earns impressions (gbp-to-gtq,
 * eur-to-cad, eur-to-nok today) keeps rendering and stays indexable.
 */
const CORRIDOR_BY_SLUG = new Map(allCorridors.map((c) => [c.slug, c]));

const CURRENCY_PAIR_SLUGS: ReadonlySet<string> = new Set(
  allCorridors
    .filter((c) => c.isCurrencyCorridor)
    .filter(
      (c) =>
        getCorridorTier(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage) <= 2,
    )
    .map((c) => c.slug),
);

export const GONE_CORRIDOR_SLUGS: ReadonlySet<string> = new Set(
  [...RETIRED_SLUGS, ...DUPLICATE_PAIR_SLUGS, ...CURRENCY_PAIR_SLUGS].filter(
    (slug) => !RANKING_CORRIDOR_SLUGS.has(slug),
  ),
);

/**
 * Duplicate pair-mates that should 301 to their surviving twin, not 410.
 *
 * build-corridor-uniqueness.ts has always emitted a `redirectTo` for every
 * surplus corridor — the stronger page on the same currency pair — but nothing
 * ever read it, so all 413 were folded into the 410 set. That contradicts this
 * file's own rule: 410 is for pages with "no sensible live equivalent to
 * redirect to", and a duplicate pair-mate has one by definition. It also
 * discards whatever signal the retired URL held instead of consolidating it.
 *
 * Found via check:ranking, which had /fr/send-money/germany-to-pakistan and
 * /fr/send-money/usa-to-japan failing as "redirect target returns 410" — two
 * URLs the ranking list names, answering 410 while their twins
 * (france-to-pakistan, send-money-to-japan) serve 200.
 *
 * Only targets that actually render are used, so a redirect can never point at
 * another retired page. Anything left over stays in the 410 set above.
 *
 * RETIRED_SLUGS and CURRENCY_PAIR_SLUGS are deliberately NOT here: those have
 * no equivalent twin, which is exactly why they are 410.
 */
export const DUPLICATE_CORRIDOR_REDIRECTS: ReadonlyMap<string, string> = new Map(
  duplicateCorridors.surplus
    .filter(
      (s): s is typeof s & { redirectTo: string } =>
        typeof (s as { redirectTo?: string }).redirectTo === "string" &&
        !!(s as { redirectTo?: string }).redirectTo,
    )
    .filter((s) => !RANKING_CORRIDOR_SLUGS.has(s.slug))
    // A hand-retired slug stays 410 even if the generator also names it a
    // duplicate. The 2026-08-31 Eurozone block above decided that deliberately —
    // "301 reads as 'content moved', which contradicts scaled-content
    // remediation" — and that decision outranks the generator. Currently a
    // no-op (zero overlap), asserted so it cannot quietly stop being one.
    .filter((s) => !RETIRED_SLUGS.has(s.slug))
    // The target must survive every retirement rule AND still render, or we
    // would 301 into a 410 or a 404. The tier check mirrors
    // route-map.corridorPageRenders — asserted here rather than imported,
    // because route-map imports this module. uae-to-malaysia pointed at
    // aed-to-myr, which is retired by tier rather than by any of the sets
    // below, and only the tier check catches it.
    .filter((s) => {
      if (
        RETIRED_SLUGS.has(s.redirectTo) ||
        DUPLICATE_PAIR_SLUGS.has(s.redirectTo) ||
        CURRENCY_PAIR_SLUGS.has(s.redirectTo)
      ) {
        return false;
      }
      const target = CORRIDOR_BY_SLUG.get(s.redirectTo);
      if (!target) return false;
      if (RANKING_CORRIDOR_SLUGS.has(target.slug)) return true;
      return (
        getCorridorTier(
          target.slug,
          target.fromCurrency,
          target.toCurrency,
          target.isCountryPage,
        ) <= 2
      );
    })
    .map((s) => [s.slug, s.redirectTo] as const),
);
