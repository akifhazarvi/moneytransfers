/**
 * Server-side bot-likelihood scoring for the /go and /out affiliate redirects.
 *
 * Design (researched Jun 2026, validated against live data — CN showed 33 hits /
 * 33 unique visitors / 14 providers = textbook enumeration):
 *
 *  • SCORE, never block. A redirect costs nothing to serve; the score gates
 *    affiliate-credit + analytics, it does not break anyone.
 *  • Gate every "missing header" penalty behind the UA browser FAMILY. Safari
 *    never sends Sec-CH-UA / Sec-Fetch-User; Firefox/Safari send no Client
 *    Hints; webviews (FB/IG/WhatsApp) and transcoding proxies omit headers.
 *    Penalizing absence unconditionally would nuke real diaspora/mobile users.
 *  • Datacenter IP + cookieless + no-referer are EXPECTED for AI-assistant
 *    referrals (our #2 channel) — weighted low and/or gated, never standalone.
 *  • Value-coherence + behavioral model (Vercel exposes header values + geo,
 *    NOT header order / JA3 / ASN). Behavioral axis is scored separately by the
 *    caller from Postgres; this module is the stateless per-request half.
 *
 * Returns 0–100 with the contributing reasons. The caller stores both and the
 * dashboard shows them per row — humans cluster <30, bots >60.
 */

export type BotScoreInput = {
  ua: string;
  refererHost: string;
  country?: string | null;
  corridor?: string | null;
  hadCid?: boolean;
  hadVidCookie?: boolean;
  accept?: string | null;
  acceptLanguage?: string | null;
  acceptEncoding?: string | null;
  secFetchMode?: string | null;
  secFetchDest?: string | null;
  secFetchSite?: string | null;
  secChUa?: string | null;
  secChUaMobile?: string | null;
  secChUaPlatform?: string | null;
  priority?: string | null;
  /** Behavioral score (0–100) computed by the caller from the event store. */
  behavioralScore?: number;
  behavioralReasons?: string[];
};

export type BotScoreResult = {
  score: number;
  reasons: string[];
  /** Coarse band for quick filtering. */
  band: "human" | "suspect" | "bot" | "certain";
  /** Convenience: treat >=60 as bot for analytics exclusion. */
  isBot: boolean;
};

// ── UA family detection (gates almost everything) ───────────────────────────
const RE_CHROMIUM = /\b(Chrome|Chromium|CriOS|Edg|EdgA|OPR|SamsungBrowser)\/(\d+)/i;
const RE_FIREFOX = /\bFirefox\/(\d+)/i;
const RE_SAFARI = /\bVersion\/(\d+)[\d.]*\s+(Mobile\/\S+\s+)?Safari\//i;
// Real-human webviews / emerging-market browsers — trust, skip header anomalies.
const RE_WEBVIEW = /\b(FBAN|FB_IAB|FBAV|Instagram|Line\/|WhatsApp|SamsungBrowser|UCBrowser|OPR\/|Opera Mini|OPiOS|MiuiBrowser|YaBrowser|HuaweiBrowser|VivoBrowser|HeyTapBrowser|GSA\/)\b/i;

// Self-identifying automation — smoking guns.
const RE_LIB_UA = /\b(python-requests|python-urllib|curl\/|wget|Go-http-client|okhttp|node-fetch|axios|Java\/|libwww|PostmanRuntime|Scrapy|httpx|aiohttp|Apache-HttpClient|Guzzle|http_request|lua-resty)\b/i;
const RE_HEADLESS = /\b(HeadlessChrome|PhantomJS|SlimerJS|Selenium|puppeteer|playwright|electron)\b/i;
// Generic crawler markers (non-AI, non-self-identified-lib).
const RE_GENERIC_BOT = /\b(bot|crawler|spider|crawl|fetch|scraper|monitor|preview|probe|检查|spider)\b/i;

type UaFamily = "chromium" | "firefox" | "safari" | "webview" | "other";

function uaFamily(ua: string): UaFamily {
  if (RE_WEBVIEW.test(ua)) return "webview";
  if (RE_CHROMIUM.test(ua)) return "chromium";
  if (RE_FIREFOX.test(ua)) return "firefox";
  if (RE_SAFARI.test(ua)) return "safari";
  return "other";
}

// Plausible mid-2026 version ceilings (near-zero FP; "too old" is NOT scored —
// emerging-market users run ancient devices).
const MAX_CHROME = 155;
const MAX_FIREFOX = 158;
const MAX_SAFARI = 27;

const COMMON_SEND = new Set(["USD", "GBP", "EUR", "AUD", "CAD", "AED", "SAR", "SGD", "NZD", "CHF", "HKD", "QAR", "KWD", "NOK", "SEK", "DKK"]);
const COMMON_RECV = new Set(["INR", "PHP", "PKR", "NGN", "BDT", "MXN", "NPR", "LKR", "EUR", "GBP", "USD", "VND", "KES", "GHS", "EGP", "CNY", "IDR", "BRL", "COP", "ZAR"]);

export function scoreBotRequest(s: BotScoreInput): BotScoreResult {
  const ua = (s.ua || "").trim();
  const fam = uaFamily(ua);
  const reasons: string[] = [];

  // Cluster accumulators — MAX within a cluster (decorrelate), then sum clusters.
  let cShape = 0;   // headers / fetch-metadata / client-hints coherence
  let cUa = 0;      // UA self-identification + plausibility
  let cAccept = 0;  // accept-* anomalies
  let cIntent = 0;  // implausible corridor / source shape

  // --- A3. UA self-identification (strongest, cap 30) -----------------------
  if (RE_HEADLESS.test(ua)) { cUa = Math.max(cUa, 30); reasons.push("headless UA (+30)"); }
  if (RE_LIB_UA.test(ua)) { cUa = Math.max(cUa, 30); reasons.push("http-library UA (+30)"); }
  if (!ua) { cUa = Math.max(cUa, 18); reasons.push("empty UA (+18)"); }
  // Forged Chrome: claims Chrome but lacks the Safari token real Chrome always has.
  if (/chrome\//i.test(ua) && !/safari\//i.test(ua) && !RE_WEBVIEW.test(ua)) {
    cUa = Math.max(cUa, 25); reasons.push("forged chrome UA — no safari token (+25)");
  }
  // Future/impossible version (near-zero FP).
  const chromeV = ua.match(/chrome\/(\d+)/i);
  if (chromeV && Number(chromeV[1]) > MAX_CHROME) { cUa = Math.max(cUa, 20); reasons.push(`impossible chrome v${chromeV[1]} (+20)`); }
  const ffV = ua.match(/firefox\/(\d+)/i);
  if (ffV && Number(ffV[1]) > MAX_FIREFOX) { cUa = Math.max(cUa, 20); reasons.push(`impossible firefox v${ffV[1]} (+20)`); }
  const safV = ua.match(/version\/(\d+)[\d.]*\s+(?:mobile\/\S+\s+)?safari/i);
  if (safV && Number(safV[1]) > MAX_SAFARI) { cUa = Math.max(cUa, 20); reasons.push(`impossible safari v${safV[1]} (+20)`); }
  // Chrome with non-zero minor segment (real reduced UA is always X.0.0.0).
  const chromeFull = ua.match(/chrome\/(\d+)\.(\d+)\./i);
  if (chromeFull && chromeFull[2] !== "0") { cUa = Math.max(cUa, 10); reasons.push("chrome non-zero minor (+10)"); }
  // Generic crawler word in UA but not self-identified lib/AI (AI handled by caller).
  if (RE_GENERIC_BOT.test(ua) && !RE_LIB_UA.test(ua)) { cUa = Math.max(cUa, 16); reasons.push("crawler marker in UA (+16)"); }

  // --- A1. Sec-Fetch coherence (Chromium/Firefox only; cap 30) --------------
  // Safari <16.4 and webviews legitimately omit Sec-Fetch → gate on family.
  if (fam === "chromium" || fam === "firefox") {
    if (!s.secFetchMode) { cShape = Math.max(cShape, 20); reasons.push("browser UA but no sec-fetch (+20)"); }
    else if (s.secFetchMode !== "navigate") { cShape = Math.max(cShape, 12); reasons.push(`sec-fetch-mode=${s.secFetchMode} not navigate (+12)`); }
    if (s.secFetchDest && s.secFetchDest !== "document" && s.secFetchDest !== "empty") {
      cShape = Math.max(cShape, 10); reasons.push(`sec-fetch-dest=${s.secFetchDest} (+10)`);
    }
    if (s.secFetchMode === "navigate" && s.secFetchDest === "empty") {
      cShape = Math.max(cShape, 15); reasons.push("incoherent navigate+dest:empty (+15)");
    }
  }

  // --- A2. Sec-CH-UA consistency (Chromium ONLY; cap 25) --------------------
  // Safari/Firefox NOT sending these is 100% normal — must score 0.
  if (fam === "chromium" && !RE_WEBVIEW.test(ua)) {
    if (!s.secChUa) { cShape = Math.max(cShape, 18); reasons.push("chromium UA but no sec-ch-ua (+18)"); }
    else {
      // brand major vs UA chrome major
      const chMajor = chromeV ? Number(chromeV[1]) : 0;
      const brandMajors = [...s.secChUa.matchAll(/v="(\d+)"/g)].map((m) => Number(m[1]));
      if (chMajor && brandMajors.length && !brandMajors.includes(chMajor)) {
        cShape = Math.max(cShape, 15); reasons.push("sec-ch-ua brand != UA chrome major (+15)");
      }
      if (!/not.?a.?brand/i.test(s.secChUa)) { cShape = Math.max(cShape, 6); reasons.push("sec-ch-ua missing GREASE (+6)"); }
    }
    // platform / mobile coherence
    if (s.secChUaPlatform) {
      const plat = s.secChUaPlatform.replace(/"/g, "").toLowerCase();
      const uaPlat = /windows/i.test(ua) ? "windows" : /android/i.test(ua) ? "android" : /mac os|macintosh/i.test(ua) ? "macos" : /iphone|ipad/i.test(ua) ? "ios" : /linux/i.test(ua) ? "linux" : "";
      if (uaPlat && plat && plat !== uaPlat && !(plat === "macos" && uaPlat === "ios")) {
        cShape = Math.max(cShape, 12); reasons.push(`sec-ch-ua-platform ${plat} != UA ${uaPlat} (+12)`);
      }
    }
    if (s.secChUaMobile) {
      const mob = s.secChUaMobile === "?1";
      const uaMob = /mobile|android|iphone/i.test(ua);
      if (mob !== uaMob) { cShape = Math.max(cShape, 8); reasons.push("sec-ch-ua-mobile mismatch (+8)"); }
    }
  }

  // --- A4. Accept-* anomalies (gate on browser family; cap 20) --------------
  if (fam === "chromium" || fam === "firefox" || fam === "safari") {
    if (!s.accept) { cAccept = Math.max(cAccept, 8); reasons.push("no accept header (+8)"); }
    else if (/^\*\/\*$/.test(s.accept.trim())) { cAccept = Math.max(cAccept, 10); reasons.push("accept=*/* on browser UA (+10)"); }
    if (!s.acceptLanguage) { cAccept = Math.max(cAccept, 8); reasons.push("no accept-language (+8)"); }
    // NOTE: non-English accept-language is NORMAL for our audience — never scored.
    if (s.acceptEncoding && (fam === "chromium" || fam === "firefox") && !/br/i.test(s.acceptEncoding)) {
      cAccept = Math.max(cAccept, 4); reasons.push("no brotli encoding (+4)");
    }
  }

  // --- Intent: implausible corridor (scraper enumerating combos; cap 24) ----
  if (s.corridor) {
    const m = s.corridor.toUpperCase().match(/^([A-Z]{3})-([A-Z]{3})$/);
    if (m) {
      let intent = 0;
      if (!COMMON_SEND.has(m[1])) { intent += 12; reasons.push(`odd send ccy ${m[1]} (+12)`); }
      if (!COMMON_RECV.has(m[2])) { intent += 12; reasons.push(`odd recv ccy ${m[2]} (+12)`); }
      cIntent = Math.min(24, intent);
    }
  }

  // --- Positive signal: well-formed Priority on Chromium → confidence -3 ----
  let bonus = 0;
  if (fam === "chromium" && s.priority && /u=\d/.test(s.priority)) { bonus -= 3; }

  // Behavioral axis (computed by caller from Postgres). Capped contribution.
  const behavioral = Math.max(0, Math.min(100, s.behavioralScore ?? 0));
  if (behavioral > 0 && s.behavioralReasons?.length) reasons.push(...s.behavioralReasons);

  let score = cShape + cUa + cAccept + cIntent + behavioral + bonus;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const band: BotScoreResult["band"] =
    score >= 85 ? "certain" : score >= 60 ? "bot" : score >= 30 ? "suspect" : "human";

  return { score, reasons, band, isBot: score >= 60 };
}
