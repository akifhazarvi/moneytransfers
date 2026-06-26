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
export const GONE_CORRIDOR_SLUGS = new Set<string>([
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
]);
