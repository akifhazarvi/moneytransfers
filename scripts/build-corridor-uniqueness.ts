/**
 * Generation threshold for corridor pages — writes the list of corridor slugs
 * that carry no data their currency-pair twin does not already carry.
 *
 * WHY
 * The Sep 2026 content brief ("Content_Links_Brief_sendmoneycompare_EN.docx",
 * §4 and §10-A) requires: "Introduce a generation threshold: only create a page
 * when unique data exists for it; otherwise do not generate it (return 404/410)
 * and do not link to it."
 *
 * The reason corridor pages have no unique data is structural, not editorial.
 * Every quote we hold is keyed on the CURRENCY pair — corridor-leaders.json has
 * 210 entries, all of the form "AED-BDT" — and no quote carries a sending
 * country. So /send-money/australia-to-croatia and /send-money/australia-to-france
 * are both AUD→EUR and render the same table, the same leader, the same markup,
 * the same FAQ answers. Measured on the build, they are word-for-word identical
 * apart from the country name: 4,698 words, of which 20 appear on no other page.
 *
 * Across the 847 rendered corridor pages there are 389 distinct currency pairs,
 * so 458 pages are restating a pair-mate. That is what Google's scaled-content
 * policy describes, and no rewrite fixes it, because the differentiating data
 * does not exist to write from.
 *
 * WHAT SURVIVES A COLLISION (highest priority first)
 *   1. A ranking URL. CLAUDE.md: "A ranking URL must never 404, 410, or serve
 *      noindex." check:ranking enforces it. These are never retired.
 *   2. A page with proven demand — in the sitemap allowlist (Bing >=5 impressions
 *      /90d) or a head term. Demand data outranks this script's judgement.
 *   3. A hand-written editorial corridor, which carries prose no generator made.
 *   4. Otherwise one page per pair, chosen deterministically.
 *
 * Everything else is surplus and goes to GONE_CORRIDOR_SLUGS -> HTTP 410, which
 * already drops it from generateStaticParams, the sitemap, IndexNow and every
 * internal link that asks route-map first.
 *
 * The output is a reviewable JSON file rather than an inline Set because it
 * retires several hundred URLs, and that should be readable in a diff before it
 * ships.
 *
 * Usage: npx tsx scripts/build-corridor-uniqueness.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { allCorridors, corridors as editorialCorridors, type Corridor } from "@/data/corridors";
import { RANKING_CORRIDOR_SLUGS } from "@/lib/ranking-corridors";
import { getCorridorTier } from "@/lib/corridor-tiers";
import { SITEMAP_CORRIDOR_SLUGS } from "@/lib/sitemap-allowlists";
import { HEAD_CORRIDOR_SLUGS } from "@/lib/head-corridors";
import { RETIRED_CORRIDOR_SLUGS } from "@/lib/gone-corridors";
import { CONTENT_BRIEF_REWRITE_CORRIDORS } from "@/lib/content-brief-rewrites";
import { readFileSync, readdirSync } from "node:fs";

const EDITORIAL = new Set(editorialCorridors.map((c) => c.slug));

/**
 * Corridors that a hand-written article links to in its body text.
 *
 * A corridor with an editorial guide behind it is not a page "with no unique
 * data" in the brief's sense — the guide is data about that exact route, written
 * for it, and the link is an editor's judgement that the page is worth sending a
 * reader to. Retiring it would also mean rewriting prose in blog-posts.ts to
 * route around a 410, which is how you break sentences to satisfy a link check.
 *
 * Scanned from source rather than hand-listed so it cannot drift as articles are
 * added or edited.
 */
const EDITORIALLY_LINKED = new Set<string>();
{
  const dir = join(__dirname, "../src/data");
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".ts")) continue;
    const raw = readFileSync(join(dir, f), "utf8");
    for (const [, slug] of raw.matchAll(/\/send-money\/([a-z0-9-]+)/g)) EDITORIALLY_LINKED.add(slug);
  }
}

/**
 * Pages the route actually builds today, minus the ones already retired.
 *
 * BUG FIXED 2026-09-15 (caught in content-brief validation): this used to
 * filter out RETIRED_CORRIDOR_SLUGS directly, but that is the pre-ranking-
 * rescue list — gone-corridors.ts's real GONE_CORRIDOR_SLUGS subtracts
 * RANKING_CORRIDOR_SLUGS from it, because a ranking URL is never actually
 * retired however this list names it. belgium-to-mexico is on
 * RETIRED_CORRIDOR_SLUGS AND on RANKING_CORRIDOR_SLUGS, so it renders live —
 * but the old filter here dropped it from the EUR-MXN group before the
 * survivor logic ever ran. eur-to-mxn then "won" that pair by being the only
 * entrant, with no real competitor check, and shipped at 39 unique words.
 * Can't import GONE_CORRIDOR_SLUGS directly (gone-corridors.ts imports this
 * script's JSON output — that would be circular), so the same subtraction is
 * replicated here instead.
 */
const trulyGone = new Set([...RETIRED_CORRIDOR_SLUGS].filter((slug) => !RANKING_CORRIDOR_SLUGS.has(slug)));
const rendered = allCorridors
  .filter((c) => !trulyGone.has(c.slug))
  .filter(
    (c) =>
      getCorridorTier(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage) <= 2 ||
      RANKING_CORRIDOR_SLUGS.has(c.slug),
  );

/**
 * Pages that are never retired, whatever else shares their currency pair.
 *
 * Exempting rather than merely ranking these matters: two demand-proven pages
 * can share a pair (USD-PKR carries both usa-to-pakistan and
 * send-money-to-pakistan), and a priority sort still has to drop one of them.
 * Retiring a URL that earns impressions is the 2026-09-01 failure this file's
 * sibling guardrail exists to prevent, so demand wins over tidiness: a pair may
 * legitimately keep more than one page when more than one has earned it.
 */
function isProtected(c: Corridor): boolean {
  return (
    RANKING_CORRIDOR_SLUGS.has(c.slug) ||
    SITEMAP_CORRIDOR_SLUGS.has(c.slug) ||
    HEAD_CORRIDOR_SLUGS.has(c.slug) ||
    // The brief names these for rewriting (§4), which is the opposite of
    // retiring them (§10-A). send-money-to-india and send-money-to-philippines
    // are on both sides of that line otherwise.
    CONTENT_BRIEF_REWRITE_CORRIDORS.has(c.slug) ||
    EDITORIALLY_LINKED.has(c.slug) ||
    // The /send-money/send-money-to-<country> family: one canonical hub per
    // destination country. The brief's §4 rule applies to these — "each targets
    // a different search query", "send money to Mexico" being a different query
    // from "send money from USA to Mexico" — so they are rewritten, not merged
    // away. They are also what /send-money, the SWIFT pages and the country
    // guides all point at, so retiring them would gut the country hub structure.
    c.isCountryPage === true
  );
}

/** Lower rank = stronger claim to represent a pair that has no protected page. */
function priority(c: Corridor): number {
  if (EDITORIAL.has(c.slug)) return 0;
  if (c.isCountryPage) return 1;
  return 2;
}

const byPair = new Map<string, Corridor[]>();
for (const c of rendered) {
  const k = `${c.fromCurrency}-${c.toCurrency}`;
  const a = byPair.get(k);
  if (a) a.push(c);
  else byPair.set(k, [c]);
}

const surplus: { slug: string; pair: string; keptInstead: string; redirectTo: string }[] = [];
const kept: Record<string, string> = {};

for (const [pair, group] of [...byPair].sort((a, b) => a[0].localeCompare(b[0]))) {
  const protectedPages = group.filter(isProtected);
  // Deterministic: priority, then slug, so a rebuild never reshuffles which
  // URL survives — a page that flips between 200 and 410 is worse than either.
  const ordered = [...group].sort((a, b) => priority(a) - priority(b) || a.slug.localeCompare(b.slug));

  // A pair with a demand-proven page keeps every such page and retires the rest.
  // A pair with none keeps its single strongest page.
  const survivors = protectedPages.length ? protectedPages : [ordered[0]];
  kept[pair] = survivors.map((c) => c.slug).join(", ");

  const surviving = new Set(survivors.map((c) => c.slug));
  // The page an existing internal link should point at instead. Same currency
  // pair, so the comparison it renders is the same one the link promised — an
  // editorial cross-sell keeps working rather than being dropped.
  const redirectTo = survivors[0].slug;
  for (const c of ordered) {
    if (surviving.has(c.slug)) continue;
    surplus.push({ slug: c.slug, pair, keptInstead: kept[pair], redirectTo });
  }
}

surplus.sort((a, b) => a.slug.localeCompare(b.slug));

const out = {
  generated: new Date().toISOString(),
  rationale:
    "Corridor pages whose currency pair is already represented by a stronger page. " +
    "Quotes are keyed on currency pair, not country pair, so these restate a twin " +
    "verbatim. Content brief Sep 2026, §4 / §10-A generation threshold.",
  renderedBefore: rendered.length,
  distinctCurrencyPairs: byPair.size,
  retiring: surplus.length,
  renderedAfter: rendered.length - surplus.length,
  keptPerPair: kept,
  surplus,
};

const dest = join(__dirname, "../src/data/scraped/duplicate-corridors.json");
writeFileSync(dest, JSON.stringify(out, null, 1) + "\n");

console.log(`corridor uniqueness threshold`);
console.log(`  rendered before : ${out.renderedBefore}`);
console.log(`  currency pairs  : ${out.distinctCurrencyPairs}`);
console.log(`  retiring (410)  : ${out.retiring}`);
console.log(`  rendered after  : ${out.renderedAfter}`);
console.log(`  ranking URLs retired: ${surplus.filter((s) => RANKING_CORRIDOR_SLUGS.has(s.slug)).length} (must be 0)`);
console.log(`  wrote ${dest.replace(join(__dirname, ".."), ".")}`);
