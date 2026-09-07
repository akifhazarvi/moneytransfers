#!/usr/bin/env tsx
/**
 * check-ai-citations.ts — the fixed AI-prompt citation benchmark.
 *
 * WHAT IT MEASURES
 * For each prompt in `BENCHMARK_PROMPTS`, whether an AI assistant cites
 * sendmoneycompare.com, WHICH page, at what POSITION in the citation list,
 * which COMPETITORS it cites instead, and whether we are mentioned by name
 * without being linked. The previous version recorded a single boolean plus
 * one URL, which could tell you that coverage changed but never what changed.
 *
 * COST DISCIPLINE (the credit is finite — see notes below)
 * - `sonar` is the cheapest Perplexity search model; do not silently upgrade
 *   it to sonar-pro/reasoning, which cost multiples for prose we discard.
 * - `max_tokens` is deliberately small. We need the citation array, not an
 *   essay; the answer text is only used to detect an unlinked brand mention,
 *   for which a few hundred tokens is plenty. Output tokens are the main lever.
 * - Every run records real token usage and request counts from the API
 *   response, so spend is measurable rather than assumed.
 * - `--limit`, `--ids` and `--platform` exist so a change to this script can be
 *   validated on three prompts instead of a hundred.
 *
 * PLATFORM COVERAGE — and its honest limit
 * ChatGPT (OpenAI Responses API + web_search) and Perplexity (Sonar) both have
 * APIs that return citations. Google AI Overviews / AI Mode and Bing Copilot do
 * NOT expose one, so they are not measured here. They are absent rather than
 * approximated: a scraped or simulated answer would not be the thing the
 * strategy wants to track, and reporting it beside real API data would make the
 * series untrustworthy.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/check-ai-citations.ts [flags]
 *     --platform=perplexity|chatgpt|all   default all
 *     --limit=N                           first N prompts only
 *     --ids=b01,c07                       specific prompt ids
 *     --dry-run                           resolve config, make no API calls
 *
 * Missing keys skip a platform rather than failing the run.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  BENCHMARK_PROMPTS,
  COMPETITOR_DOMAINS,
  type BenchmarkPrompt,
} from "../src/data/ai-prompt-benchmark";

const DOMAIN = "sendmoneycompare.com";

/**
 * Provider domains, separated from publisher competitors on purpose.
 *
 * The two lose us different things. A publisher outranking us is lost
 * attention; a PROVIDER outranking us is a user who books the transfer without
 * ever reaching a comparison — the leak worth measuring. Kept here rather than
 * in the prompt file because it is an analysis concern, not part of the fixed
 * prompt set.
 */
const PROVIDER_DOMAINS = [
  "wise.com",
  "remitly.com",
  "westernunion.com",
  "worldremit.com",
  "xe.com",
  "moneygram.com",
  "xoom.com",
  "revolut.com",
  "paypal.com",
  "ria.com",
  "instarem.com",
  "paysend.com",
] as const;

/**
 * Sentences that carry a recommendation, as opposed to background. Only these
 * are checked for which source backs them: the question is not "are we cited
 * somewhere" but "is the answer's actual advice sourced from us".
 */
const RECOMMENDATION_CUES =
  /\b(cheapest|best|recommend|lowest (?:cost|fee)|most affordable|top (?:choice|pick|option)|go with|opt for|better option|winner|ideal)\b/i;

type Route = "us" | "provider" | "publisher" | "unattributed";

const domainOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const isProvider = (d: string) => PROVIDER_DOMAINS.some((p) => d.endsWith(p));

/**
 * Which sources back the answer's recommendation.
 *
 * Perplexity marks claims with [n] pointing 1-based into the citation array, so
 * a recommendation sentence's markers resolve to the domains that actually
 * carry the advice. Where a recommendation sentence has no marker the route is
 * "unattributed" — reported as such rather than guessed, because assuming it
 * favours whoever we would like it to favour.
 *
 * NOTE the ceiling on this: `max_tokens` truncates long answers, so a
 * recommendation in a cut-off tail is invisible here. Cheap and directional,
 * not exhaustive.
 */
function recommendationRoute(answerText: string, citations: string[]): {
  route: Route;
  domains: string[];
} {
  const sentences = answerText.split(/(?<=[.!?])\s+|\n+/).filter((x) => RECOMMENDATION_CUES.test(x));
  const domains = new Set<string>();
  for (const sentence of sentences) {
    for (const m of sentence.matchAll(/\[(\d{1,2})\]/g)) {
      const idx = Number(m[1]) - 1;
      const url = citations[idx];
      if (url) domains.add(domainOf(url));
    }
  }
  const list = [...domains].filter(Boolean);
  if (list.length === 0) return { route: "unattributed", domains: [] };
  if (list.some((d) => d.endsWith(DOMAIN))) return { route: "us", domains: list };
  if (list.some(isProvider)) return { route: "provider", domains: list };
  return { route: "publisher", domains: list };
}
const BRAND = "sendmoneycompare";
const OUT_PATH = join(process.cwd(), "src/data/scraped/ai-citations.json");
const HISTORY_PATH = join(process.cwd(), "src/data/scraped/ai-citations-history.json");

/**
 * Kept small on purpose — see COST DISCIPLINE. Raising this raises spend on
 * every prompt of every run for text we only scan for a brand mention.
 */
const MAX_TOKENS = 350;

/**
 * Perplexity's cheapest search-grounded model. Overridable for a deliberate
 * experiment, not as a default.
 */
const PPLX_MODEL = process.env.PERPLEXITY_MODEL ?? "sonar";

/**
 * The OpenAI model used to probe ChatGPT. Configurable because the answer — and
 * therefore what gets cited — depends on it, and the right choice is whatever
 * best approximates ChatGPT Search today rather than whatever was current when
 * this was written.
 */
const OPENAI_MODEL = process.env.OPENAI_CITATION_MODEL ?? "gpt-4o-mini";

type Platform = "chatgpt" | "perplexity";

interface Usage {
  promptTokens: number;
  completionTokens: number;
  requests: number;
}

export interface CitationResult {
  id: string;
  query: string;
  topic: BenchmarkPrompt["topic"];
  baseline: boolean;
  /** The page we hoped would answer this, if any. */
  target?: string;
  platform: Platform;
  /** Our domain appears in the citation list. */
  cited: boolean;
  /** Every one of our URLs cited, in citation order. */
  ourUrls: string[];
  /** 1-based position of our first citation among all citations. */
  position: number | null;
  /** Total citations returned, for context on the position. */
  totalCitations: number;
  /**
   * Brand named in the answer text with no link to us. Worth separating: an
   * unlinked mention is a different problem from absence — it means the model
   * knows the entity but is not sourcing from it.
   */
  mentionedUnlinked: boolean;
  /** Competitor domains cited, with their first position. */
  competitors: { domain: string; position: number }[];
  /** Whether we appear in the first three citations — the ones users click. */
  inTopThree: boolean;
  /** Position of the best-placed provider site, if any is cited. */
  bestProviderPosition: number | null;
  /**
   * A provider site is cited ABOVE us. The leak: the user can book without
   * ever reaching a comparison.
   */
  providerOutranksUs: boolean;
  /** Whose source backs the answer's recommendation. */
  recommendationRoute: Route;
  /** Domains cited by the recommendation sentences. */
  recommendationDomains: string[];
  /** Did the cited page match `target`? Null when there is no target or no citation. */
  targetHit: boolean | null;
  responsePreview: string;
  error?: string;
}

// ── CLI ───────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return undefined;
  return hit.includes("=") ? hit.split("=").slice(1).join("=") : "true";
};
const platformArg = (flag("platform") ?? "all").toLowerCase();
const limitArg = Number(flag("limit") ?? "0");
const idsArg = flag("ids")?.split(",").map((s) => s.trim()).filter(Boolean);
const dryRun = flag("dry-run") === "true";

let prompts = BENCHMARK_PROMPTS;
if (idsArg?.length) prompts = prompts.filter((p) => idsArg.includes(p.id));
if (limitArg > 0) prompts = prompts.slice(0, limitArg);

const runChatGPT = platformArg === "all" || platformArg === "chatgpt";
const runPerplexity = platformArg === "all" || platformArg === "perplexity";

const usage: Record<Platform, Usage> = {
  chatgpt: { promptTokens: 0, completionTokens: 0, requests: 0 },
  perplexity: { promptTokens: 0, completionTokens: 0, requests: 0 },
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Shared analysis ───────────────────────────────────────────────────────
/**
 * One analysis path for both platforms, so a difference between them is a
 * difference in what the assistant returned rather than in how we read it.
 */
function analyse(
  p: BenchmarkPrompt,
  platform: Platform,
  citations: string[],
  answerText: string,
): CitationResult {
  const ourUrls = citations.filter((c) => c.toLowerCase().includes(DOMAIN));
  const firstIdx = citations.findIndex((c) => c.toLowerCase().includes(DOMAIN));
  const lowerAnswer = answerText.toLowerCase();

  const competitors: { domain: string; position: number }[] = [];
  for (const d of COMPETITOR_DOMAINS) {
    const i = citations.findIndex((c) => c.toLowerCase().includes(d));
    if (i >= 0) competitors.push({ domain: d, position: i + 1 });
  }
  competitors.sort((a, b) => a.position - b.position);

  const cited = ourUrls.length > 0;
  let targetHit: boolean | null = null;
  if (p.target) {
    targetHit = cited ? ourUrls.some((u) => u.includes(p.target!)) : false;
  }

  const providerPositions = citations
    .map((c, i) => ({ d: domainOf(c), i: i + 1 }))
    .filter((x) => isProvider(x.d))
    .map((x) => x.i);
  const bestProviderPosition = providerPositions.length ? Math.min(...providerPositions) : null;
  const rec = recommendationRoute(answerText, citations);
  const ourPosition = firstIdx >= 0 ? firstIdx + 1 : null;

  return {
    id: p.id,
    query: p.prompt,
    topic: p.topic,
    baseline: !!p.baseline,
    target: p.target,
    platform,
    cited,
    ourUrls,
    position: ourPosition,
    totalCitations: citations.length,
    mentionedUnlinked: !cited && lowerAnswer.includes(BRAND),
    competitors,
    inTopThree: ourPosition !== null && ourPosition <= 3,
    bestProviderPosition,
    // Uncited counts as outranked: if a provider is cited and we are not, the
    // provider has the user and we are not in the running at all.
    providerOutranksUs:
      bestProviderPosition !== null && (ourPosition === null || bestProviderPosition < ourPosition),
    recommendationRoute: rec.route,
    recommendationDomains: rec.domains,
    targetHit,
    responsePreview: answerText.slice(0, 300),
  };
}

function skipped(p: BenchmarkPrompt, platform: Platform, error: string): CitationResult {
  return {
    id: p.id,
    query: p.prompt,
    topic: p.topic,
    baseline: !!p.baseline,
    target: p.target,
    platform,
    cited: false,
    ourUrls: [],
    position: null,
    totalCitations: 0,
    mentionedUnlinked: false,
    competitors: [],
    inTopThree: false,
    bestProviderPosition: null,
    providerOutranksUs: false,
    recommendationRoute: "unattributed",
    recommendationDomains: [],
    targetHit: null,
    responsePreview: "",
    error,
  };
}

// ── Perplexity ────────────────────────────────────────────────────────────
async function checkPerplexity(p: BenchmarkPrompt): Promise<CitationResult> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) return skipped(p, "perplexity", "PERPLEXITY_API_KEY missing");

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: PPLX_MODEL,
        messages: [{ role: "user", content: p.prompt }],
        max_tokens: MAX_TOKENS,
        return_citations: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return skipped(p, "perplexity", `HTTP ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    usage.perplexity.requests += 1;
    usage.perplexity.promptTokens += data.usage?.prompt_tokens ?? 0;
    usage.perplexity.completionTokens += data.usage?.completion_tokens ?? 0;

    // Newer responses carry `search_results` alongside/instead of `citations`.
    const citations: string[] = (
      data.citations ??
      (data.search_results ?? []).map((r: { url?: string }) => r.url).filter(Boolean) ??
      []
    ) as string[];
    const answerText: string = data.choices?.[0]?.message?.content ?? "";
    return analyse(p, "perplexity", citations, answerText);
  } catch (e) {
    return skipped(p, "perplexity", e instanceof Error ? e.message : String(e));
  }
}

// ── ChatGPT ───────────────────────────────────────────────────────────────
async function checkChatGPT(p: BenchmarkPrompt): Promise<CitationResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return skipped(p, "chatgpt", "OPENAI_API_KEY missing");

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        tools: [{ type: "web_search" }],
        max_output_tokens: MAX_TOKENS,
        input: p.prompt,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return skipped(p, "chatgpt", `HTTP ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    usage.chatgpt.requests += 1;
    usage.chatgpt.promptTokens += data.usage?.input_tokens ?? 0;
    usage.chatgpt.completionTokens += data.usage?.output_tokens ?? 0;

    // Citations arrive as url_citation annotations on the output text.
    const citations: string[] = [];
    for (const item of data.output ?? []) {
      for (const c of item.content ?? []) {
        for (const a of c.annotations ?? []) {
          if (a.url) citations.push(a.url);
        }
      }
    }
    const answerText: string =
      data.output_text ??
      (data.output ?? [])
        .map((o: { content?: { text?: string }[] }) => (o.content ?? []).map((c) => c.text).join(" "))
        .join("\n");

    return analyse(p, "chatgpt", citations, String(answerText ?? ""));
  } catch (e) {
    return skipped(p, "chatgpt", e instanceof Error ? e.message : String(e));
  }
}

// ── Run ───────────────────────────────────────────────────────────────────
function summarise(results: CitationResult[], platform: Platform) {
  const rows = results.filter((r) => r.platform === platform);
  const usable = rows.filter((r) => !r.error);
  const cited = usable.filter((r) => r.cited);
  const positions = cited.map((r) => r.position!).filter((n) => Number.isFinite(n));
  const withTarget = usable.filter((r) => r.target);
  const routes = usable.reduce(
    (a, r) => {
      a[r.recommendationRoute] += 1;
      return a;
    },
    { us: 0, provider: 0, publisher: 0, unattributed: 0 } as Record<Route, number>,
  );
  const attributed = routes.us + routes.provider + routes.publisher;

  return {
    prompts: rows.length,
    usable: usable.length,
    errors: rows.length - usable.length,
    citations: cited.length,
    citationRatePct: usable.length ? Math.round((cited.length / usable.length) * 1000) / 10 : 0,
    /** Cited in the first three sources — the ones a reader actually opens. */
    inTopThree: cited.filter((r) => r.inTopThree).length,
    /**
     * Prompts where a provider site is cited above us (or we are absent while
     * one is present). The headline leak number.
     */
    providerOutranksUs: usable.filter((r) => r.providerOutranksUs).length,
    /** Whose source backs the recommendation. */
    recommendationRoute: routes,
    /**
     * Our share of the recommendations that ARE attributed. Unattributed ones
     * are excluded from the denominator rather than counted against us, since
     * they say nothing either way.
     */
    ourRecommendationSharePct: attributed ? Math.round((routes.us / attributed) * 1000) / 10 : 0,
    meanPosition: positions.length
      ? Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) / 10
      : null,
    mentionedUnlinked: usable.filter((r) => r.mentionedUnlinked).length,
    targetHits: withTarget.filter((r) => r.targetHit).length,
    targetsChecked: withTarget.length,
    baselineCitations: usable.filter((r) => r.baseline && r.cited).length,
    baselinePrompts: usable.filter((r) => r.baseline).length,
  };
}

async function main() {
  console.log(
    `[ai-citations] ${prompts.length} prompt(s) · platforms: ${[
      runChatGPT && "chatgpt",
      runPerplexity && "perplexity",
    ]
      .filter(Boolean)
      .join(" + ")} · pplx model ${PPLX_MODEL} · max_tokens ${MAX_TOKENS}${dryRun ? " · DRY RUN" : ""}`,
  );
  if (dryRun) {
    console.log(prompts.map((p) => `  ${p.id}  ${p.prompt}`).join("\n"));
    return;
  }

  const results: CitationResult[] = [];
  for (const p of prompts) {
    if (runChatGPT) results.push(await checkChatGPT(p));
    if (runPerplexity) results.push(await checkPerplexity(p));

    const mark = (pl: Platform) => {
      const r = results.find((x) => x.id === p.id && x.platform === pl);
      if (!r) return " ";
      if (r.error) return "—";
      if (r.cited) return `✓${r.position}`;
      return r.mentionedUnlinked ? "~" : "·";
    };
    console.log(
      `  ${p.id} [cg ${runChatGPT ? mark("chatgpt") : "-"}] [px ${runPerplexity ? mark("perplexity") : "-"}] ${p.prompt.slice(0, 58)}`,
    );
    // Gentle on rate limits; the run is not time-critical.
    await delay(600);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    domain: DOMAIN,
    promptsRun: prompts.length,
    promptSetSize: BENCHMARK_PROMPTS.length,
    models: { perplexity: PPLX_MODEL, chatgpt: OPENAI_MODEL },
    maxTokens: MAX_TOKENS,
    usage,
    chatgpt: summarise(results, "chatgpt"),
    perplexity: summarise(results, "perplexity"),
    results,
  };

  mkdirSync(join(process.cwd(), "src/data/scraped"), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(summary, null, 2));

  // History: aggregates only, so the series stays small enough to read and to
  // diff. A single run's detail lives in ai-citations.json; the point of the
  // series is spotting a rise or a drop, which needs the summary, not 200 rows.
  type HistoryEntry = {
    generatedAt: string;
    promptsRun: number;
    chatgpt: ReturnType<typeof summarise>;
    perplexity: ReturnType<typeof summarise>;
    usage: typeof usage;
  };
  const history: HistoryEntry[] = existsSync(HISTORY_PATH)
    ? (JSON.parse(readFileSync(HISTORY_PATH, "utf8")) as HistoryEntry[])
    : [];
  history.push({
    generatedAt: summary.generatedAt,
    promptsRun: prompts.length,
    chatgpt: summary.chatgpt,
    perplexity: summary.perplexity,
    usage,
  });
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));

  for (const pl of ["chatgpt", "perplexity"] as Platform[]) {
    const s = summary[pl];
    if (s.prompts === 0) continue;
    console.log(
      `\n  ${pl}: ${s.citations}/${s.usable} cited (${s.citationRatePct}%)` +
        `${s.meanPosition ? `, mean position ${s.meanPosition} of ${Math.round(
          results.filter((r) => r.platform === pl && r.cited).reduce((a, r) => a + r.totalCitations, 0) /
            Math.max(1, s.citations),
        )}` : ""}` +
        `, ${s.mentionedUnlinked} unlinked mentions, ${s.errors} errors` +
        `\n     top-3 citations ${s.inTopThree}/${s.citations}` +
        ` · provider outranks us on ${s.providerOutranksUs}/${s.usable}` +
        ` · recommendation route: us ${s.recommendationRoute.us}, provider ${s.recommendationRoute.provider},` +
        ` publisher ${s.recommendationRoute.publisher}, unattributed ${s.recommendationRoute.unattributed}` +
        ` (our share of attributed: ${s.ourRecommendationSharePct}%)` +
        `${s.targetsChecked ? `, ${s.targetHits}/${s.targetsChecked} hit the intended page` : ""}`,
    );
    const u = usage[pl];
    if (u.requests) {
      console.log(
        `     usage: ${u.requests} requests, ${u.promptTokens} in / ${u.completionTokens} out tokens`,
      );
    }
  }
  console.log(`\n  detail:  ${OUT_PATH}`);
  console.log(`  history: ${HISTORY_PATH} (${history.length} run(s))`);
}

main().catch((e) => {
  console.error("[ai-citations] Fatal:", e);
  process.exit(1);
});
