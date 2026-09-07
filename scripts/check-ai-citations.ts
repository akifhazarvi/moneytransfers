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

  return {
    id: p.id,
    query: p.prompt,
    topic: p.topic,
    baseline: !!p.baseline,
    target: p.target,
    platform,
    cited,
    ourUrls,
    position: firstIdx >= 0 ? firstIdx + 1 : null,
    totalCitations: citations.length,
    mentionedUnlinked: !cited && lowerAnswer.includes(BRAND),
    competitors,
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
  return {
    prompts: rows.length,
    usable: usable.length,
    errors: rows.length - usable.length,
    citations: cited.length,
    citationRatePct: usable.length ? Math.round((cited.length / usable.length) * 1000) / 10 : 0,
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
