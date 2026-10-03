/**
 * Every /send-money/[corridor] page that may render — a ceiling, not a target.
 *
 * Corridor pages used to appear whenever the data allowed: a route reaching two
 * quoting providers became Tier 2 and got a page, a link from every hub and a
 * place in the duplicate-retiring pool. A new scraper route therefore created
 * pages nobody chose — the scaled-content pattern behind the March 2026
 * suppression. Owner decision 2026-10-03: new corridor data shows in the
 * comparison (provider rows on existing pages and /send-money results), never
 * as a new page.
 *
 * Frozen 2026-10-03 from the build: the 162 pages rendering then, plus 1
 * curated routes (sitemap, head-term, ranking, Bing-demand or reviewed lists)
 * that were temporarily below the data bar. The usual gates still apply inside
 * it — tier, GONE_CORRIDOR_SLUGS, the zero-quote 404 — so data can still remove
 * a page; it can no longer add one. Adding a slug here is a decision, not a
 * side effect of a scrape.
 */
export const CORRIDOR_PAGE_ALLOWLIST: ReadonlySet<string> = new Set<string>([
  // Rendering on 2026-10-03
  "aud-to-bdt", "australia-to-china", "australia-to-france",
  "australia-to-india", "australia-to-pakistan", "australia-to-philippines",
  "australia-to-uk", "australia-to-zimbabwe", "austria-to-cameroon",
  "austria-to-ethiopia", "austria-to-senegal", "austria-to-sri-lanka",
  "austria-to-uganda", "bahrain-to-bangladesh", "bahrain-to-india",
  "bahrain-to-pakistan", "bahrain-to-philippines", "belgium-to-morocco",
  "canada-to-india", "canada-to-nigeria", "canada-to-pakistan",
  "canada-to-philippines", "china-to-australia", "china-to-canada",
  "china-to-uk", "china-to-usa", "czech-republic-to-germany",
  "denmark-to-colombia", "denmark-to-france", "denmark-to-malaysia",
  "denmark-to-philippines", "finland-to-philippines", "france-to-pakistan",
  "france-to-uk", "germany-to-china", "germany-to-india",
  "germany-to-malaysia", "germany-to-nigeria", "germany-to-turkey",
  "germany-to-ukraine", "greece-to-poland", "india-to-canada",
  "india-to-croatia", "india-to-singapore", "india-to-uae",
  "india-to-uk", "india-to-usa", "ireland-to-bangladesh",
  "italy-to-brazil", "japan-to-ecuador", "new-zealand-to-australia",
  "new-zealand-to-uk", "norway-to-philippines", "oman-to-pakistan",
  "portugal-to-bangladesh", "saudi-arabia-to-bangladesh", "saudi-arabia-to-egypt",
  "saudi-arabia-to-india", "saudi-arabia-to-pakistan", "saudi-arabia-to-philippines",
  "send-money-to-algeria", "send-money-to-argentina", "send-money-to-australia",
  "send-money-to-bangladesh", "send-money-to-bolivia", "send-money-to-brazil",
  "send-money-to-cameroon", "send-money-to-canada", "send-money-to-chile",
  "send-money-to-china", "send-money-to-colombia", "send-money-to-costa-rica",
  "send-money-to-czech-republic", "send-money-to-dominican-republic", "send-money-to-egypt",
  "send-money-to-ethiopia", "send-money-to-europe", "send-money-to-fiji",
  "send-money-to-france", "send-money-to-gambia", "send-money-to-georgia",
  "send-money-to-germany", "send-money-to-ghana", "send-money-to-guatemala",
  "send-money-to-haiti", "send-money-to-honduras", "send-money-to-hong-kong",
  "send-money-to-hungary", "send-money-to-india", "send-money-to-indonesia",
  "send-money-to-israel", "send-money-to-jamaica", "send-money-to-japan",
  "send-money-to-jordan", "send-money-to-kazakhstan", "send-money-to-kenya",
  "send-money-to-madagascar", "send-money-to-malaysia", "send-money-to-mexico",
  "send-money-to-morocco", "send-money-to-mozambique", "send-money-to-nepal",
  "send-money-to-new-zealand", "send-money-to-nigeria", "send-money-to-pakistan",
  "send-money-to-paraguay", "send-money-to-peru", "send-money-to-philippines",
  "send-money-to-poland", "send-money-to-romania", "send-money-to-rwanda",
  "send-money-to-senegal", "send-money-to-singapore", "send-money-to-south-africa",
  "send-money-to-south-korea", "send-money-to-spain", "send-money-to-sri-lanka",
  "send-money-to-taiwan", "send-money-to-tanzania", "send-money-to-thailand",
  "send-money-to-turkey", "send-money-to-uae", "send-money-to-uganda",
  "send-money-to-uk", "send-money-to-ukraine", "send-money-to-uruguay",
  "send-money-to-uzbekistan", "send-money-to-vietnam", "send-money-to-zambia",
  "singapore-to-india", "singapore-to-philippines", "switzerland-to-egypt",
  "uae-to-bangladesh", "uae-to-india", "uae-to-pakistan",
  "uae-to-philippines", "uk-to-bangladesh", "uk-to-china",
  "uk-to-egypt", "uk-to-france", "uk-to-india",
  "uk-to-kenya", "uk-to-mexico", "uk-to-nigeria",
  "uk-to-pakistan", "uk-to-philippines", "uk-to-vietnam",
  "uk-to-zimbabwe", "usa-to-bangladesh", "usa-to-ethiopia",
  "usa-to-europe", "usa-to-ghana", "usa-to-india",
  "usa-to-kenya", "usa-to-mexico", "usa-to-nigeria",
  "usa-to-pakistan", "usa-to-philippines", "usa-to-sri-lanka",
  "usa-to-uae", "usa-to-uk", "usa-to-vietnam",
  // Curated, below the data bar on 2026-10-03
  "austria-to-tanzania",
]);
