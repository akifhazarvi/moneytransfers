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
  /** Additive 0–100 bot-likelihood score (NEVER alters isBot or drops data —
   *  it's attached to each row so real-vs-bot can be judged without guessing). */
  botScore: number;
  /** Human-readable signals that contributed, for auditability. */
  botReasons: string[];
};

// ── Bot scoring ────────────────────────────────────────────────────────────
// A weighted, additive 0–100 score over ~12 independent signals. This is the
// safe design the user asked for: we SCORE and store it next to each row — we
// do NOT mutate isBot, drop, or filter anyone on the score alone. Real users
// keep their data; the score just lets us SEE which clicks look automated
// (e.g. the Jun 20 Beijing scraper: browser-UA, no referer, fresh visitor each
// time, nonsensical corridors NOK→MXN/AUD→UZS on a ~90s cadence).
//
// Higher = more bot-like. ~60+ is "almost certainly automated"; 30–60 is
// "suspicious, worth a look"; under 30 reads as a real user.

const COMMON_SEND = new Set(["USD", "GBP", "EUR", "AUD", "CAD", "AED", "SAR", "SGD", "NZD", "CHF", "HKD"]);
const COMMON_RECV = new Set(["INR", "PHP", "PKR", "NGN", "BDT", "MXN", "NPR", "LKR", "EUR", "GBP", "USD", "VND", "KES", "GHS", "EGP"]);
// Datacenter/scraper-leaning origins for a referer-less browser hit (weighted,
// never decisive alone — a real diaspora user can be here).
const SUSPECT_COUNTRIES = new Set(["CN", "HK", "RU"]);

export type BotSignalInput = {
  ua: string;
  refererHost: string;
  country?: string | null;
  corridor?: string | null;
  /** Did the on-site injector forward a live GA client id? (real-session signal) */
  hadCid?: boolean;
  /** Was an explicit AI source set by the injector? (real-session signal) */
  hadAiSrc?: boolean;
  /** Did the request carry an smc_vid cookie already? (returning real visitor) */
  hadVidCookie?: boolean;
  /** Accept header (browsers send text/html; many bots send */ /* or nothing) */
  accept?: string | null;
  /** Accept-Language header (real browsers almost always send one) */
  acceptLanguage?: string | null;
};

/**
 * Compute the additive bot score (0–100) + the reasons. Pure signal scoring;
 * callers decide what to do with it (we only store + display it).
 */
export function scoreBotSignals(s: BotSignalInput): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const add = (pts: number, why: string) => { score += pts; reasons.push(`${why} (+${pts})`); };
  const ua = s.ua || "";

  // 1. No referer at all — direct hits to /go are common for AI/cited links,
  //    so weak on its own, but a real on-site click usually has one.
  if (!s.refererHost) add(8, "no referer");
  // 2. Suspect datacenter-leaning country (only meaningful with #1).
  if (s.country && SUSPECT_COUNTRIES.has(s.country.toUpperCase())) add(18, `country ${s.country}`);
  // 3. Implausible send currency (not a real human's chosen corridor).
  // 4. Implausible receive currency.
  if (s.corridor) {
    const m = s.corridor.toUpperCase().match(/^([A-Z]{3})-([A-Z]{3})$/);
    if (m) {
      if (!COMMON_SEND.has(m[1])) add(14, `odd send ccy ${m[1]}`);
      if (!COMMON_RECV.has(m[2])) add(14, `odd recv ccy ${m[2]}`);
    }
  }
  // 5. No smc_vid cookie AND no cid — first-touch with zero session continuity.
  if (!s.hadVidCookie && !s.hadCid) add(6, "no prior session");
  // 6. Missing Accept-Language — real browsers nearly always send it.
  if (!s.acceptLanguage) add(12, "no accept-language");
  // 7. Accept header doesn't want HTML — automated fetchers often omit it.
  if (s.accept && !/text\/html|\*\/\*/i.test(s.accept)) add(10, "no html accept");
  // 8. Forged Chrome (claims Chrome but no Safari token — real Chrome always has it).
  if (/chrome\//i.test(ua) && !/safari\//i.test(ua)) add(20, "forged chrome UA");
  // 9. Very short UA — truncated/synthetic.
  if (ua && ua.length < 40) add(10, "short UA");
  // 10. Headless / automation fingerprints in UA.
  if (/headless|phantom|selenium|puppeteer|playwright|electron/i.test(ua)) add(30, "headless UA");
  // 11. Old/unusual engine markers common in scraping stacks.
  if (/python|java|go-http|okhttp|libwww|httpclient|axios|node-fetch/i.test(ua)) add(30, "http-lib UA");
  // 12. No UA at all.
  if (!ua) add(25, "empty UA");

  return { score: Math.min(100, score), reasons };
}

/**
 * Resolve the traffic source from request headers. `explicit` (the ?ai_src=
 * query param) always wins when present. Optional signal inputs feed the
 * additive bot score, which is returned alongside (never used to drop data).
 */
export function classifyTrafficSource(
  userAgent: string | null | undefined,
  referer: string | null | undefined,
  explicit?: string,
  country?: string | null,
  corridor?: string | null,
  signals?: Partial<BotSignalInput>,
): SourceClass {
  const ua = userAgent || "";
  let refererHost = "";
  try {
    refererHost = referer ? new URL(referer).host : "";
  } catch {
    refererHost = "";
  }

  // Compute the additive score ONCE. It's attached to every result but never
  // flips isBot or drops anyone — it's a soft signal for the dashboard so we
  // can see what looks automated without ever blocking a real user (incl. CN).
  const { score: botScore, reasons: botReasons } = scoreBotSignals({
    ua, refererHost, country, corridor,
    hadCid: signals?.hadCid,
    hadAiSrc: signals?.hadAiSrc,
    hadVidCookie: signals?.hadVidCookie,
    accept: signals?.accept,
    acceptLanguage: signals?.acceptLanguage,
  });

  if (explicit) {
    return { source: explicit, isBot: false, refererHost, botScore, botReasons };
  }
  for (const [re, label, human] of AI_UA_PATTERNS) {
    if (re.test(ua)) return { source: label, isBot: !human, refererHost, botScore, botReasons };
  }
  // A referer from an AI assistant / search host means a real person clicked
  // through from that platform — real traffic (unless the UA is a crawler).
  for (const [re, label] of REFERER_HOST_PATTERNS) {
    if (re.test(refererHost)) {
      return { source: label, isBot: /bot|crawler|spider|preview/i.test(ua), refererHost, botScore, botReasons };
    }
  }
  if (GENERIC_BOT_RE.test(ua)) {
    return { source: "bot", isBot: true, refererHost, botScore, botReasons };
  }
  // A real browser referral, or a direct hit with no referer. isBot stays
  // conservative (false) — the score above is the soft signal, not this.
  return { source: refererHost ? "web" : "direct", isBot: false, refererHost, botScore, botReasons };
}
