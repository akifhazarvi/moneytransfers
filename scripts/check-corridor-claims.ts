/**
 * Checks that corridor editorial prose never names a provider as a permanent
 * winner when the live comparison disagrees.
 *
 * WHY THIS EXISTS
 * /send-money/usa-to-india recommended TapTap Send in its table while its FAQ
 * said Wise and Remitly "consistently deliver the most rupees". That single
 * contradiction is what prompted the September 2026 content-quality pass. A
 * scan then found the same shape on 71 of 108 corridors — hardcoded superlatives
 * naming a provider that the quote engine no longer ranks first.
 *
 * Nothing caught it. check:rankings covers guides and business pages only;
 * check-corridor-summary covers the generated summary function, not the prose
 * beside it. The failure is invisible to every other guard because the sentence
 * is valid TypeScript, links resolve, and the figure is not a {{TOKEN}}.
 *
 * WHAT IT CHECKS
 * For each corridor it scans intro / context / feesNote / deliveryNote / FAQ
 * answers for a superlative that names a provider, then tests that provider
 * against the corridor's own record.
 *
 * IT TESTS THE 90-DAY RECORD FIRST, not just today's table. A single day's
 * ranking moves with a scrape; being absent from three months of winners does
 * not. Checking only today called "Instarem often matches or beats Wise on
 * AUD/INR" a pass on days Instarem happened to lead, when the honest number is
 * that it won 0 of 91 contested days and Ria won 54. Where rate-insights has no
 * consistency record for the pair (several SEK corridors), it falls back to
 * today's top-ranked estimate, which is weaker evidence but better than none.
 *
 * NOT A BUILD GATE, deliberately — same reasoning as check:sources and
 * check:rankings. It reads scraped data that refreshes every six hours, so the
 * live leader can change between a passing build and a deploy. Failing the
 * build on that would block shipping for a reason nobody introduced. Run it,
 * read it, and fix what it names.
 *
 * A PASS IS NOT A CLEAN BILL. A claim that happens to match today's leader is
 * still a hardcoded claim and will contradict tomorrow. The durable fix is to
 * carry the recommendation in corridorComparisonSummary() — which recomputes
 * it — and keep prose to things that do not change with the day's rates.
 *
 * Run: npm run check:corridor-claims
 */
import { corridors } from "../src/data/corridors";
import { getRateInsight } from "../src/lib/rate-history";
import { corridorDeepBlocks } from "../src/data/corridor-deep-content";
import { swedishCorridorBlocks } from "../src/data/sweden-content";
import { corridorEditorialNotes } from "../src/data/corridor-editorial-notes";
import { blogPosts } from "../src/data/blog-posts";
import { guideIsIndexable } from "../src/lib/guide-status";
import { generateQuotes } from "../src/lib/quotes-engine";
import { getProviderName, providers } from "../src/data/providers";

const NAMES = providers.map((p) => p.name).filter((n) => n.length > 3);

/** Phrasings that assert a standing winner rather than describing a feature. */
const SUPERLATIVE =
  /\b(consistently|always|every time|the cheapest|cheapest option|cheapest way|delivers the most|offers the best|is the best|best rate|wins|beats)\b/i;

/** sweden-content.ts is written in Swedish; the English pattern never matched it,
 *  so six contradictions sat unscanned until 2026-09-11. */
const SUPERLATIVE_SV = /\b(billigast\w*|bäst\w*|alltid|mest fördelaktig\w*|konsekvent)\b/i;

/**
 * Sentences that contain a superlative and a provider name but assert nothing
 * about who wins. Without these the guard reports "Always retain Wise/Revolut
 * receipts" and "Compare Wise, Remitly … to find the cheapest route" as ranking
 * claims — advice and a description of the comparison itself. A guard that
 * cries wolf gets switched off, which is the failure mode worth avoiding.
 */
const NOT_A_RANKING_CLAIM: RegExp[] = [
  // "Compare X, Y, Z … to find the cheapest" / "Jämför … för att hitta den billigaste"
  /\b(compare|jämför)\b[\s\S]*\b(to find|för att hitta)\b/i,
  // Imperative advice that happens to start with "Always"
  /\balways (retain|keep|check|confirm|use|compare|verify|read|include)\b/i,
  // Superlatives about DELIVERY or SPEED. providerConsistency measures cost
  // only, so "M-Pesa is the best delivery option" and "Remitly often wins on
  // speed" are outside what this guard can judge. Flagging them would assert
  // that a cost record refutes a timing claim, which it does not.
  /\bbest (delivery|payout|receiving|payment) (option|method|rail)\b/i,
  /\bwins on (speed|time|delivery|arrival|transparency|features|support|coverage|app)\b/i,
  // Claims about who is DEAREST. The leader record names who delivered most; it
  // cannot refute "Western Union and UK banks are consistently the most
  // expensive". Judging that against the leader reports a true sentence as false.
  /\b(most expensive|priciest|worst value|dearest)\b/i,
  // Sentences that already carry the hedge this guard exists to enforce, e.g.
  // "competitive, but not automatically the cheapest".
  /\bnot (automatically |always |necessarily )?(the )?(outright )?(cheapest|best|winner)\b/i,
  // "best FOR <non-cost dimension>" — speed, app quality, small transfers.
  // The leader record ranks payout, so it cannot judge "Remitly is the best for
  // speed and small transfers (frequent $0-fee promos, delivery in minutes)".
  /\bbest (for|on) (speed|small transfers|large transfers|the app|app|support|coverage|cash pickup|beginners)\b/i,
  // BUSINESS-scoped claims. providerConsistency is built from consumer
  // remittance quotes, so it ranks LemFi and Ria — apps that do not serve
  // business payments at all. Judging "Wise Business offers ... which is usually
  // cheaper" against a consumer leader is the same consumer/business mismatch
  // BUSINESS_FX_SLUGS exists to prevent on the comparison widget.
  /\b(business (payments?|account|transfers?)|Wise Business|Revolut Business|business-focused)\b/i,
];

/**
 * Pairwise claims — "OFX consistently beats Wise on total cost", "matching or
 * slightly beating Wise on small transfers". The leader record says who
 * delivered most overall; it cannot refute a claim about one provider against
 * ANOTHER NAMED ONE, which can be true even when neither ever leads. Judging
 * those against the leader reports true sentences as contradictions.
 *
 * Detected as a comparison verb whose object is a provider name.
 */
function isPairwiseComparison(sentence: string, names: string[]): boolean {
  return names.some((n) =>
    new RegExp(`\\b(beats?|beating|beaten|matching|matches|outperforms?|undercuts?|edges? out|versus|vs\\.?)\\s+(?:the\\s+)?${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(sentence),
  );
}
function assertsAWinner(sentence: string): boolean {
  return !NOT_A_RANKING_CLAIM.some((re) => re.test(sentence));
}

const winners = new Map<string, string | undefined>();
function liveLeader(from: string, to: string, amount: number): string | undefined {
  const key = `${from}_${to}_${amount}`;
  if (!winners.has(key)) {
    try {
      const quotes = (generateQuotes(amount, from, to) as { providerSlug: string; isIndicative?: boolean }[])
        .filter((q) => !q.isIndicative);
      winners.set(key, quotes[0]?.providerSlug);
    } catch {
      winners.set(key, undefined);
    }
  }
  return winners.get(key);
}

type Problem = { slug: string; field: string; claimed: string; leader: string; basis: string; sentence: string };

/**
 * Providers with a defensible record on this corridor: anyone who actually won
 * a contested day in the window. A claim naming a provider that never won is
 * unsupported by our own data, whatever today's table says.
 */
function habitualLeaders(from: string, to: string): { names: Set<string>; basis: string } | null {
  const insight = getRateInsight(from, to) as { providerConsistency?: {
    windowDays: number; contestedDays: number;
    leaders: { providerSlug: string; providerName?: string; wins: number }[];
  } } | null;
  const pc = insight?.providerConsistency;
  if (!pc || !pc.leaders?.length) return null;
  const names = new Set<string>();
  for (const l of pc.leaders) {
    if (l.wins > 0) names.add(String(l.providerName ?? l.providerSlug).toLowerCase());
  }
  if (!names.size) return null;
  const top = pc.leaders[0];
  return {
    names,
    basis: `${String(top.providerName ?? top.providerSlug)} won ${top.wins}/${pc.contestedDays} contested days in ${pc.windowDays}d`,
  };
}
const problems: Problem[] = [];
let scanned = 0;
let matchingLeader = 0;

for (const corridor of corridors as unknown as Record<string, never>[] as unknown as {
  slug: string; fromCurrency: string; toCurrency: string; sampleAmount?: number;
  intro?: string; context?: string; feesNote?: string; deliveryNote?: string;
  faqs?: { q: string; a: string }[];
}[]) {
  const amount = corridor.sampleAmount || 1000;
  const leaderSlug = liveLeader(corridor.fromCurrency, corridor.toCurrency, amount);
  // No comparable estimate means nothing to contradict — the page cannot be
  // wrong about a ranking we are not publishing.
  if (!leaderSlug) continue;
  const leader = getProviderName(leaderSlug);

  const fields: [string, string][] = [
    ["intro", corridor.intro ?? ""],
    ["context", corridor.context ?? ""],
    ["feesNote", corridor.feesNote ?? ""],
    ["deliveryNote", corridor.deliveryNote ?? ""],
  ];
  (corridor.faqs ?? []).forEach((faq, i) => fields.push([`faq${i}`, faq.a ?? ""]));

  for (const [field, text] of fields) {
    for (const sentence of String(text).split(/(?<=\.)\s+/)) {
      if (!SUPERLATIVE.test(sentence)) continue;
      // Case-insensitive: the prose writes "Lemfi", providers.ts says "LemFi",
      // and a case-sensitive match silently skipped those entirely.
      const named = NAMES.filter((n) => sentence.toLowerCase().includes(n.toLowerCase()));
      if (!named.length) continue;
      scanned++;
      const record = habitualLeaders(corridor.fromCurrency, corridor.toCurrency);
      if (record) {
        if (named.some((n) => record.names.has(n.toLowerCase()))) { matchingLeader++; continue; }
        problems.push({ slug: corridor.slug, field, claimed: named.join("/"), leader, basis: record.basis, sentence: sentence.trim().slice(0, 160) });
        continue;
      }
      if (named.some((n) => n.toLowerCase() === leader.toLowerCase())) { matchingLeader++; continue; }
      problems.push({ slug: corridor.slug, field, claimed: named.join("/"), leader, basis: `today's top estimate is ${leader} (no 90-day record for this pair)`, sentence: sentence.trim().slice(0, 160) });
    }
  }
}

/** corridor-deep-content.ts and sweden-content.ts render on the same corridor
 *  URLs and carry the same risk, keyed by the same slugs. */
function scanBlocks(
  label: string,
  blocks: Record<string, { h2?: string; intro?: string; faqs?: { a: string }[] }>,
  pattern: RegExp,
) {
  for (const [slug, block] of Object.entries(blocks)) {
    const corridor = (corridors as unknown as { slug: string; fromCurrency: string; toCurrency: string; sampleAmount?: number }[])
      .find((c) => c.slug === slug);
    if (!corridor) continue;
    const leaderSlug = liveLeader(corridor.fromCurrency, corridor.toCurrency, corridor.sampleAmount || 1000);
    if (!leaderSlug) continue;
    const leader = getProviderName(leaderSlug);
    const record = habitualLeaders(corridor.fromCurrency, corridor.toCurrency);

    const fields: [string, string][] = [["intro", block.intro ?? ""], ["h2", block.h2 ?? ""]];
    (block.faqs ?? []).forEach((faq, i) => fields.push([`faq${i}`, faq.a ?? ""]));
    for (const [field, text] of fields) {
      for (const sentence of String(text).split(/(?<=\.)\s+/)) {
        if (!pattern.test(sentence)) continue;
        if (!assertsAWinner(sentence)) continue;
        if (isPairwiseComparison(sentence, NAMES)) continue;
        const named = NAMES.filter((n) => sentence.toLowerCase().includes(n.toLowerCase()));
        if (!named.length) continue;
        scanned++;
        if (record) {
          if (named.some((n) => record.names.has(n.toLowerCase()))) { matchingLeader++; continue; }
          problems.push({ slug: `${slug} (${label})`, field, claimed: named.join("/"), leader, basis: record.basis, sentence: sentence.trim().slice(0, 160) });
          continue;
        }
        if (named.some((n) => n.toLowerCase() === leader.toLowerCase())) { matchingLeader++; continue; }
        problems.push({ slug: `${slug} (${label})`, field, claimed: named.join("/"), leader, basis: `today's top estimate is ${leader} (no 90-day record)`, sentence: sentence.trim().slice(0, 160) });
      }
    }
  }
}
scanBlocks("deep-content", corridorDeepBlocks as never, SUPERLATIVE);
scanBlocks("sweden", swedishCorridorBlocks as never, SUPERLATIVE_SV);

/** corridorEditorialNotes: summary + bullets + warning body, same corridor URLs.
 *  Unreachable by any guard until it was moved out of the route file. */
/**
 * Corridor-targeted guides. Included because /guides/* is the ONE family Google
 * still crawls weekly (checked 2026-09-11: guides Sep 5, corridors March), so a
 * false standing-winner claim there is the one most likely to be read.
 *
 * Only claims in a guide that names an explicit CCY->CCY pair are testable; the
 * pair is what selects the 90-day record. A guide with no identifiable corridor
 * is skipped rather than guessed at.
 */
const PAIR = /\b([A-Z]{3})\s*(?:to|→|-)\s*([A-Z]{3})\b/;
for (const post of blogPosts) {
  if (!guideIsIndexable(post)) continue;
  const fields: [string, string][] = [["excerpt", post.excerpt ?? ""]];
  post.sections.forEach((sec, i) => fields.push([`s${i}`, sec.content]));
  (post.faqs ?? []).forEach((faq, i) => fields.push([`faq${i}`, faq.answer]));
  for (const [field, text] of fields) {
    // Close block-level tags to sentence boundaries BEFORE stripping markup.
    // Stripping first glues a heading, a link label and the paragraph after it
    // into one pseudo-sentence, so "Quick Comparison: Best Providers for CAD to
    // INR" merged with the provider names in the table beneath it and reported
    // as a ranking claim. Headings and link text are not claims.
    const plain = String(text)
      .replace(/<\/(h[1-6]|p|li|td|th|tr|div|section)>/gi, ". ")
      .replace(/<br\s*\/?>/gi, ". ")
      .replace(/<[^>]+>/g, " ");
    for (const sentence of plain.split(/(?<=\.)\s+/)) {
      if (!SUPERLATIVE.test(sentence)) continue;
      if (!assertsAWinner(sentence)) continue;
      const named = NAMES.filter((n) => sentence.toLowerCase().includes(n.toLowerCase()));
      if (!named.length) continue;
      if (isPairwiseComparison(sentence, NAMES)) continue;
      const pair = sentence.match(PAIR) ?? plain.match(PAIR);
      if (!pair) continue;
      const record = habitualLeaders(pair[1], pair[2]);
      if (!record) continue;
      scanned++;
      if (named.some((n) => record.names.has(n.toLowerCase()))) { matchingLeader++; continue; }
      problems.push({
        slug: `guides/${post.slug}`, field, claimed: named.join("/"),
        leader: pair[1] + "->" + pair[2], basis: record.basis,
        sentence: sentence.trim().slice(0, 160),
      });
    }
  }
}

scanBlocks(
  "editorial-note",
  Object.fromEntries(
    Object.entries(corridorEditorialNotes).map(([slug, note]) => [
      slug,
      { intro: [note.summary, note.warningBody].join(" "), faqs: note.bullets.map((b) => ({ a: b })) },
    ]),
  ) as never,
  SUPERLATIVE,
);

console.log(
  `check:corridor-claims — ${corridors.length} corridors + ${Object.keys(corridorDeepBlocks).length} deep blocks + ${Object.keys(swedishCorridorBlocks).length} Swedish blocks, ${scanned} superlative claims naming a provider\n`,
);

if (problems.length) {
  console.error(`check:corridor-claims — ${problems.length} contradiction(s):\n`);
  for (const p of problems) {
    console.error(`  /send-money/${p.slug} [${p.field}]`);
    console.error(`      claims ${p.claimed}; ${p.basis}`);
    console.error(`      "${p.sentence}"\n`);
  }
  console.error(
    `Delete the sentence or replace it with the computed recommendation.\n` +
    `A corridor page must not name a standing winner the table contradicts.`,
  );
  process.exit(1);
}

console.log(
  `check:corridor-claims ok — no corridor names a provider the live comparison contradicts.\n` +
  `${matchingLeader} claim(s) currently agree with the leader but are still hardcoded and will drift;\n` +
  `prefer corridorComparisonSummary() for anything that changes with the day's rates.`,
);
