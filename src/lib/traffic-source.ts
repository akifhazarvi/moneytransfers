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

// AI assistant / AI-search fetchers — matched against the User-Agent. These are
// the official bots that fetch a page when an AI answer cites or previews it.
const AI_UA_PATTERNS: Array<[RegExp, string]> = [
  [/OAI-SearchBot|ChatGPT-User|GPTBot/i, "chatgpt"],
  [/PerplexityBot|Perplexity-User/i, "perplexity"],
  [/ClaudeBot|Claude-User|Anthropic/i, "claude"],
  [/Google-Extended|GoogleOther|Googlebot.*AI/i, "google_ai"],
  [/BingBot|BingPreview|msnbot|copilot/i, "bing_ai"],
  [/Amazonbot|Applebot-Extended|Bytespider|Meta-ExternalAgent|cohere-ai|YouBot|DuckAssistBot/i, "ai_other"],
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
  /** True when the request looks like an automated fetcher (AI or generic bot). */
  isBot: boolean;
  /** Referer host (or "" when none / same-origin). Stored for provability. */
  refererHost: string;
};

/**
 * Resolve the traffic source from request headers. `explicit` (the ?ai_src=
 * query param) always wins when present, since that is set deliberately by the
 * on-site AiSourceInjector for human sessions referred by an AI platform.
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

  for (const [re, label] of AI_UA_PATTERNS) {
    if (re.test(ua)) return { source: label, isBot: true, refererHost };
  }
  for (const [re, label] of REFERER_HOST_PATTERNS) {
    if (re.test(refererHost)) {
      return { source: label, isBot: /bot|preview/i.test(ua), refererHost };
    }
  }
  if (GENERIC_BOT_RE.test(ua)) {
    return { source: "bot", isBot: true, refererHost };
  }
  // A real browser referral, or a direct hit with no referer.
  return { source: refererHost ? "web" : "direct", isBot: false, refererHost };
}
