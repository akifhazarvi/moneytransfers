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
 * For each corridor it computes the current top-ranked non-indicative estimate
 * at that corridor's sample amount, then scans intro / context / feesNote /
 * deliveryNote / FAQ answers for a superlative that names a provider. A
 * sentence naming someone other than the current leader is a contradiction.
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
import { generateQuotes } from "../src/lib/quotes-engine";
import { getProviderName, providers } from "../src/data/providers";

const NAMES = providers.map((p) => p.name).filter((n) => n.length > 3);

/** Phrasings that assert a standing winner rather than describing a feature. */
const SUPERLATIVE =
  /\b(consistently|always|every time|the cheapest|cheapest option|cheapest way|delivers the most|offers the best|is the best|best rate|wins|beats)\b/i;

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

type Problem = { slug: string; field: string; claimed: string; leader: string; sentence: string };
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
      if (named.some((n) => n.toLowerCase() === leader.toLowerCase())) {
        matchingLeader++;
        continue;
      }
      problems.push({ slug: corridor.slug, field, claimed: named.join("/"), leader, sentence: sentence.trim().slice(0, 160) });
    }
  }
}

console.log(
  `check:corridor-claims — ${corridors.length} corridors, ${scanned} superlative claims naming a provider\n`,
);

if (problems.length) {
  console.error(`check:corridor-claims — ${problems.length} contradiction(s):\n`);
  for (const p of problems) {
    console.error(`  /send-money/${p.slug} [${p.field}]`);
    console.error(`      claims ${p.claimed}, but the live comparison ranks ${p.leader} first`);
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
