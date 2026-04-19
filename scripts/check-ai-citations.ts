#!/usr/bin/env tsx
/**
 * check-ai-citations.ts
 *
 * Probes AI search engines (ChatGPT web search, Perplexity, Google AI Overviews)
 * with target queries and records whether sendmoneycompare.com is cited.
 *
 * Usage:
 *   OPENAI_API_KEY=... PERPLEXITY_API_KEY=... npx tsx scripts/check-ai-citations.ts
 *
 * Output: src/data/scraped/ai-citations.json
 *
 * Runs best-effort: if a key is missing the provider is skipped, not failed.
 * Designed for weekly cron.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const QUERIES = [
  "cheapest way to send money to India from USA",
  "best money transfer service for sending to Philippines",
  "Wise vs Remitly comparison",
  "cheapest way to send money to Mexico",
  "cheapest international money transfer 2026",
  "how to send money to Pakistan",
  "best provider for USD to INR transfer",
  "compare international money transfer fees",
  "is Wise cheaper than bank wire transfer",
  "best app to send money abroad",
];

const DOMAIN = "sendmoneycompare.com";
const OUT_PATH = join(process.cwd(), "src/data/scraped/ai-citations.json");

type CitationResult = {
  query: string;
  platform: "chatgpt" | "perplexity";
  cited: boolean;
  citationUrl?: string;
  responsePreview: string;
  error?: string;
};

/** ChatGPT via OpenAI Responses API with web_search tool. */
async function checkChatGPT(query: string): Promise<CitationResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      query,
      platform: "chatgpt",
      cited: false,
      responsePreview: "",
      error: "OPENAI_API_KEY missing",
    };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        tools: [{ type: "web_search" }],
        input: query,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        query,
        platform: "chatgpt",
        cited: false,
        responsePreview: "",
        error: `HTTP ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = await res.json();
    const text = JSON.stringify(data).toLowerCase();
    const cited = text.includes(DOMAIN);
    const urlMatch = text.match(
      new RegExp(`https?://[^"\\s]*${DOMAIN.replace(".", "\\.")}[^"\\s]*`, "i"),
    );
    const output =
      data.output_text ??
      data.output?.map((o: { content?: { text?: string }[] }) =>
        o.content?.map((c) => c.text).join(" "),
      ).join("\n") ??
      JSON.stringify(data).slice(0, 500);

    return {
      query,
      platform: "chatgpt",
      cited,
      citationUrl: urlMatch?.[0],
      responsePreview: String(output).slice(0, 300),
    };
  } catch (e) {
    return {
      query,
      platform: "chatgpt",
      cited: false,
      responsePreview: "",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/** Perplexity via Sonar API (pplx-api). */
async function checkPerplexity(query: string): Promise<CitationResult> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) {
    return {
      query,
      platform: "perplexity",
      cited: false,
      responsePreview: "",
      error: "PERPLEXITY_API_KEY missing",
    };
  }

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [{ role: "user", content: query }],
        return_citations: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        query,
        platform: "perplexity",
        cited: false,
        responsePreview: "",
        error: `HTTP ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = await res.json();
    const citations: string[] = data.citations ?? [];
    const answerText = data.choices?.[0]?.message?.content ?? "";
    const cited = citations.some((c: string) => c.includes(DOMAIN)) ||
      answerText.toLowerCase().includes(DOMAIN);
    const citationUrl = citations.find((c: string) => c.includes(DOMAIN));

    return {
      query,
      platform: "perplexity",
      cited,
      citationUrl,
      responsePreview: String(answerText).slice(0, 300),
    };
  } catch (e) {
    return {
      query,
      platform: "perplexity",
      cited: false,
      responsePreview: "",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function main() {
  console.log(`[ai-citations] Checking ${QUERIES.length} queries across ChatGPT + Perplexity…`);

  const results: CitationResult[] = [];

  for (const q of QUERIES) {
    // Sequential to respect API rate limits and keep output readable.
    const chatgpt = await checkChatGPT(q);
    const perplexity = await checkPerplexity(q);
    results.push(chatgpt, perplexity);

    const cgMark = chatgpt.error ? "—" : chatgpt.cited ? "✓" : "·";
    const pxMark = perplexity.error ? "—" : perplexity.cited ? "✓" : "·";
    console.log(`  [ChatGPT ${cgMark}] [Perplexity ${pxMark}] ${q}`);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    domain: DOMAIN,
    queries: QUERIES.length,
    chatgptCitations: results.filter((r) => r.platform === "chatgpt" && r.cited).length,
    perplexityCitations: results.filter((r) => r.platform === "perplexity" && r.cited).length,
    chatgptErrors: results.filter((r) => r.platform === "chatgpt" && r.error).length,
    perplexityErrors: results.filter((r) => r.platform === "perplexity" && r.error).length,
    results,
  };

  mkdirSync(join(process.cwd(), "src/data/scraped"), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(summary, null, 2));

  console.log(`\n[ai-citations] Done.`);
  console.log(`  ChatGPT:    ${summary.chatgptCitations}/${QUERIES.length} citations, ${summary.chatgptErrors} errors`);
  console.log(`  Perplexity: ${summary.perplexityCitations}/${QUERIES.length} citations, ${summary.perplexityErrors} errors`);
  console.log(`  Output: ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("[ai-citations] Fatal:", e);
  process.exit(1);
});
