/**
 * Classify the origin of a server-side request (e.g. an affiliate /go redirect)
 * from its User-Agent and Referer headers.
 *
 * Why this exists: server-side redirect hits arrive with no GA session, so GA4
 * files them under "Unassigned" with no source. Most of our /go traffic is
 * fetched server-side by AI assistants and AI-search engines when they cite us
 * (ChatGPT, Perplexity, Copilot/Bing, Google AI), or by classic crawlers. Those
 * are real, worthy referrals — but invisible unless we read the UA/Referer
 * ourselves and stamp a `traffic_source` we can report on.
 *
 * Returns a stable, low-cardinality label suitable for the GA4 `traffic_source`
 * custom dimension: e.g. "chatgpt", "perplexity", "bing_ai", "google_ai",
 * "claude", "search", "bot", or "web" (a normal human browser referral).
 */

// AI assistant / AI-search fetchers — matched against the User-Agent. Each
// entry carries `human`: true when the UA fires because a REAL PERSON acted in
// the assistant (clicked a citation, asked a question that fetched us live).
// Those are genuine referral traffic and must NOT be counted as bots — they're
// our most valuable channel. `human: false` are training/index crawlers
// (GPTBot, ClaudeBot, Google-Extended…) that scrape with no person attached;
// still stored, but flagged is_bot so reports can exclude them.
const AI_UA_PATTERNS: Array<[RegExp, string, boolean]> = [
  // User-initiated — a person is on the other end → real traffic.
  [/OAI-SearchBot|ChatGPT-User/i, "chatgpt", true],
  [/Perplexity-User/i, "perplexity", true],
  [/Claude-User/i, "claude", true],
  [/DuckAssistBot/i, "duckduckgo", true],
  // Training / index crawlers — no person attached → keep flagged as bot.
  [/GPTBot/i, "chatgpt", false],
  [/PerplexityBot/i, "perplexity", false],
  [/ClaudeBot|Anthropic/i, "claude", false],
  [/Google-Extended|GoogleOther|Googlebot.*AI/i, "google_ai", false],
  [/BingBot|BingPreview|msnbot|copilot/i, "bing_ai", false],
  [/Amazonbot|Applebot-Extended|Bytespider|Meta-ExternalAgent|cohere-ai|YouBot/i, "ai_other", false],
];

// Referer host → source. AI assistants that pass a referer use these domains.
const REFERER_HOST_PATTERNS: Array<[RegExp, string]> = [
  [/chatgpt\.com|openai\.com/i, "chatgpt"],
  [/perplexity\.ai/i, "perplexity"],
  [/claude\.ai|anthropic\.com/i, "claude"],
  [/copilot\.microsoft|bing\.com/i, "bing_ai"],
  [/gemini\.google|bard\.google/i, "google_ai"],
  [/duckduckgo\.com/i, "duckduckgo"],
  [/google\.[a-z.]+$/i, "search"],
  [/yahoo\.com/i, "search"],
];

// Generic crawler signatures (not AI) — UA contains these but matched none above.
const GENERIC_BOT_RE = /bot|crawler|spider|crawl|fetch|headless|python-requests|curl|wget|axios|node-fetch|http-client|scrapy/i;

export type SourceClass = {
  /** Low-cardinality label for the GA4 traffic_source custom dimension. */
  source: string;
  /** True for automated fetchers with NO person attached (generic crawlers +
   *  AI training/index bots). False for user-initiated AI fetches
   *  (ChatGPT-User, Perplexity-User, Claude-User) — those are real traffic. */
  isBot: boolean;
  /** Referer host (or "" when none / same-origin). Stored for provability. */
  refererHost: string;
};

/**
 * Resolve the traffic source from request headers. `explicit` (the ?ai_src=
 * query param) always wins when present.
 *
 * Classification is UA/Referer-based only: it answers "which channel sent
 * this", not "how bot-like does this request look". The additive 0–100
 * bot-likelihood scorer that used to run here was removed — see
 * src/lib/redirect-decision.ts for what now gates the affiliate forward.
 */
export function classifyTrafficSource(
  userAgent: string | null | undefined,
  referer: string | null | undefined,
  explicit?: string,
): SourceClass {
  const ua = userAgent || "";
  let refererHost = "";
  try {
    refererHost = referer ? new URL(referer).host : "";
  } catch {
    refererHost = "";
  }

  if (explicit) {
    return { source: explicit, isBot: false, refererHost };
  }
  for (const [re, label, human] of AI_UA_PATTERNS) {
    if (re.test(ua)) return { source: label, isBot: !human, refererHost };
  }
  // A referer from an AI assistant / search host means a real person clicked
  // through from that platform — real traffic (unless the UA is a crawler).
  for (const [re, label] of REFERER_HOST_PATTERNS) {
    if (re.test(refererHost)) {
      return { source: label, isBot: /bot|crawler|spider|preview/i.test(ua), refererHost };
    }
  }
  if (GENERIC_BOT_RE.test(ua)) {
    return { source: "bot", isBot: true, refererHost };
  }
  // A real browser referral, or a direct hit with no referer.
  return { source: refererHost ? "web" : "direct", isBot: false, refererHost };
}
