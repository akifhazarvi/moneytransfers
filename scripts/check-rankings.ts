/**
 * Checks that pages making a ranking claim only rank providers we hold data for.
 *
 * WHY THIS EXISTS
 * /guides/best-money-transfer-services was titled "Ranked by Cost" and ranked
 * SoFi first, at "Score: 9.8/10". SoFi has no /companies page, no measured
 * markup, no row in the cost or consistency index, and no quotes anywhere — we
 * had never priced it. The page also claimed the ranking came from "real fee
 * data from 90+ providers across 300+ corridors", which was untrue of the entry
 * ranked first.
 *
 * Every existing guard passed it. check:assets only fails on an unresolved
 * `{{token}}`; check:links only cares that hrefs resolve; check:indexing only
 * looks at robots and canonicals. A hand-written ranking naming a provider that
 * exists nowhere in our data is invisible to all of them, and it sat live for
 * months.
 *
 * WHAT IT CHECKS
 * On any page whose title claims a ranking (best / cheapest / top / ranked), it
 * collects the providers presented as ranked entries and verifies each appears
 * in at least one dataset that could support the claim. It also fails on
 * uncomputed "Score: N/10" values, which no code on this site produces — a
 * figure to one decimal implies a precision that does not exist.
 *
 * SCOPE, DELIBERATELY NARROW
 * Only numbered ranking headings ("1. Wise — Best Overall") are treated as
 * ranked entries. Prose mentions and comparison links are not: a guide may
 * legitimately discuss a provider we do not price, and flagging that would make
 * the guard noisy enough to disable. The failure mode being caught is a
 * provider given a RANK.
 *
 * Not a build gate, for the same reason as check:sources — run it and read it.
 * Run: npm run check:rankings
 */
import { blogPosts } from "../src/data/blog-posts";
import { businessPages } from "../src/data/business-pages";
import { MEASURED_MARKUPS, REMITTANCE_INDEX } from "../src/lib/remittance-cost-index";
import { CONSISTENCY_ROWS } from "../src/lib/consistency-index";
import { companyPageRenders } from "../src/lib/route-map";
import { providers } from "../src/data/providers";

const RANKING_TITLE = /\b(best|cheapest|top|ranked|ranking)\b/i;
/** "1. Wise — Best Overall", "3) Remitly – fastest", etc. */
const RANKED_HEADING = /^\s*(\d+)[.)]\s+(.+?)(?:\s+[—–-]\s+|\s*:\s*|$)/;

const nameToSlug = new Map<string, string>();
for (const p of providers) {
  nameToSlug.set(p.name.toLowerCase(), p.slug);
  nameToSlug.set(p.slug, p.slug);
}
for (const r of CONSISTENCY_ROWS) nameToSlug.set(r.providerName.toLowerCase(), r.providerSlug);
for (const r of REMITTANCE_INDEX.providers) nameToSlug.set(r.name.toLowerCase(), r.slug);

/** Any dataset that could justify ranking this provider. */
function backedBy(slug: string): string[] {
  const where: string[] = [];
  if (companyPageRenders(slug)) where.push("review page");
  if (MEASURED_MARKUPS.has(slug)) where.push("measured markup");
  if (REMITTANCE_INDEX.providers.some((p) => p.slug === slug)) where.push("cost index");
  if (CONSISTENCY_ROWS.some((r) => r.providerSlug === slug)) where.push("consistency index");
  return where;
}

/** Strip the trailing qualifier so "SoFi Checking & Savings" resolves to "sofi". */
function resolve(label: string): string | undefined {
  const clean = label.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  if (nameToSlug.has(clean)) return nameToSlug.get(clean);
  for (const [name, slug] of nameToSlug) {
    if (name.length >= 4 && clean.startsWith(name)) return slug;
  }
  return undefined;
}

type Problem = { page: string; kind: string; detail: string };
const problems: Problem[] = [];

/**
 * An entry may name a provider we do not price, PROVIDED the page says so where
 * it is ranked. That is the honest resolution: SoFi and OnePay earn their place
 * on account features and cash-pickup reach, neither of which we measure, and
 * deleting them would lose real information. What is not acceptable is ranking
 * them silently on a page that claims to rank on cost.
 */
const DISCLOSED = /not a measured cost ranking|absent from our live dataset|we do not price|not a cost we have verified/i;

const pages: { slug: string; title: string; sections: { heading: string; content: string }[]; body: string }[] = [
  ...blogPosts.map((p) => ({
    slug: `guides/${p.slug}`,
    title: p.title,
    sections: p.sections.map((s) => ({ heading: s.heading, content: s.content })),
    body: p.sections.map((s) => s.content).join(" "),
  })),
  ...businessPages.map((p) => ({
    slug: `business/${p.slug}`,
    title: p.title,
    sections: p.sections.map((s) => ({ heading: s.heading, content: s.content })),
    body: p.intro + " " + p.sections.map((s) => s.content).join(" "),
  })),
];

for (const page of pages) {
  // Uncomputed scores are wrong anywhere, ranking page or not.
  for (const m of page.body.matchAll(/Score:\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*10/gi)) {
    problems.push({ page: page.slug, kind: "uncomputed score", detail: `"Score: ${m[1]}/10" — no code produces this` });
  }

  if (!RANKING_TITLE.test(page.title)) continue;

  for (const sec of page.sections) {
    const m = sec.heading.match(RANKED_HEADING);
    if (!m) continue;
    if (DISCLOSED.test(sec.content)) continue; // page states it is not measured
    const slug = resolve(m[2]);
    if (!slug) {
      // Both instances this caught on its first run were real (SoFi, OnePay),
      // so an unrecognisable ranked entry fails rather than warns. If a heading
      // that is not a provider ever trips it, narrow RANKED_HEADING instead of
      // downgrading this — a ranked entry we cannot identify is the worst case,
      // not the mildest.
      problems.push({ page: page.slug, kind: "unresolved entry", detail: `#${m[1]} "${m[2]}" — not a provider we recognise` });
      continue;
    }
    if (backedBy(slug).length === 0) {
      problems.push({
        page: page.slug,
        kind: "ranked but unmeasured",
        detail: `#${m[1]} "${m[2]}" (${slug}) — absent from every dataset`,
      });
    }
  }
}

const scores = problems.filter((p) => p.kind === "uncomputed score");
const ranked = problems.filter((p) => p.kind === "ranked but unmeasured");
const unresolved = problems.filter((p) => p.kind === "unresolved entry");

console.log(`check:rankings — ${pages.length} pages scanned, ${pages.filter((p) => RANKING_TITLE.test(p.title)).length} make a ranking claim\n`);

if (scores.length || ranked.length || unresolved.length) {
  const all = [...ranked, ...unresolved, ...scores];
  console.error(`check:rankings — ${all.length} problem(s):\n`);
  for (const p of all) console.error(`  ${p.page}\n      ${p.kind}: ${p.detail}`);
  console.error(
    `\nA page that ranks providers must only rank ones we hold data for, or say inline\n` +
    `that an entry is not measured. Uncomputed scores should be removed outright.`,
  );
  process.exit(1);
}

console.log("check:rankings ok — every ranked provider is backed by data, no uncomputed scores");
