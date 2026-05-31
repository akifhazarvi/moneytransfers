import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getGeoDefaults } from "./data/geo-corridors";
import { shouldNoindexPath } from "./lib/seo-indexing";
import { GTAG_INLINE_SHA256, THEME_INLINE_SHA256 } from "./lib/inline-scripts";
import { getCompareCanonicalSlug } from "./lib/compare-canonical";

const intlMiddleware = createMiddleware(routing);

// Known spam bot user-agent fragments (NOT legitimate crawlers)
const SPAM_UA_PATTERNS = [
  "semrushbot", "ahrefsbot", "dotbot", "mj12bot", "blexbot",
  "megaindex", "serpstatbot", "zoominfobot", "dataforseo",
  "bomborabot", "clickagy", "neevabot",
  "headlesschrome", "phantomjs", "selenium", "puppeteer", "playwright",
  "python-requests", "python-urllib", "go-http-client", "java/",
  "wget/", "curl/", "libwww-perl",
];

// Legitimate bots to ALLOW (search engines + AI crawlers + social preview crawlers)
const ALLOWED_BOTS = [
  "googlebot", "bingbot", "yandexbot", "duckduckbot", "baiduspider",
  "applebot", "chatgpt-user", "gptbot", "oai-searchbot",
  "perplexitybot", "claudebot", "anthropic-ai",
  "bytespider", "facebookexternalhit", "facebookcatalog", "meta-externalagent",
  "twitterbot", "linkedinbot", "whatsapp", "telegrambot", "discordbot",
  "slackbot", "slack-imgproxy", "redditbot", "pinterest",
  "skypeuripreview", "viber", "line-poker",
  "slurp", "ia_archiver", "archive.org_bot",
  "vercel-edge-functions", "vercel",
];

// Countries where we have 0 real users (GSC: 0-1 clicks) but heavy bot traffic.
// Blocking at edge saves compute and cleans GA4 data.
// IMPORTANT: only block countries where GA4 + GSC together confirm zero real
// human traffic. Removing a country here is cheap; adding one risks killing
// a real diaspora audience.
const BOT_HEAVY_COUNTRIES = new Set([
  "SG", // Singapore: 86 GA4 sessions, 1.2% engagement rate, 1:1 user:session ratio (no return visits) — verified bot farm (GSC: 1 click lifetime)
]);

// Country+city pairs where we see bot patterns in GA4 (low engagement, no
// search referrer, anonymous geo) but where the country itself has real users
// elsewhere. Block these specific combinations only — do NOT block the whole
// country.
//
// Format: "CC|city" (Vercel reports city in `x-vercel-ip-city`).
// Verified against 28-day GA4 data 2026-03-28..2026-04-24.
const BOT_HEAVY_COUNTRY_CITIES = new Set([
  "CN|Hangzhou", // Alibaba Cloud HQ, 0% engagement, 4 sessions
  "CN|Hefei",    // Cloud DC region, 0% engagement
  "CN|Zhuhai",   // Cloud DC region, 0% engagement
  // NOT blocking CN|Guangzhou (10 sessions, 60% engagement — real users)
  // NOT blocking CN|Shanghai (7 sessions, 29% engagement — borderline real)
  // NOT blocking CN|Beijing (6 sessions, 17% engagement — borderline real)
]);

// Pure data-center cities (US-side) where Vercel reports the city as a known
// cloud region. These are exclusively bot hosts — no real user lives in
// "The Dalles, OR" (Google Cloud us-west1).
const DATA_CENTER_CITIES = new Set([
  "The Dalles",      // Google Cloud us-west1
  "Boardman",        // AWS us-west-2
  "Council Bluffs",  // Google Cloud us-central1
  // NOT blocking Ashburn — it's AWS us-east-1 BUT also Loudoun County, VA
  // (real residents). 13 sessions, 23% engagement is suspicious but mixed,
  // so we let UA/header heuristics handle it instead of blanket-blocking.
]);

function isSpamBot(request: NextRequest): boolean {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  // Allow known legitimate bots FIRST — before any length/heuristic check.
  // Short UAs like "WhatsApp/2.x" would otherwise be blocked as "too short".
  if (ua && ALLOWED_BOTS.some((bot) => ua.includes(bot))) return false;

  // Empty or suspiciously short user agent = bot
  if (!ua || ua.length < 10) return true;

  // Block known spam bots
  if (SPAM_UA_PATTERNS.some((pattern) => ua.includes(pattern))) return true;

  // Block traffic from countries with confirmed bot farm activity
  const country = request.headers.get("x-vercel-ip-country") || "";
  if (country && BOT_HEAVY_COUNTRIES.has(country)) return true;

  // Block specific country+city pairs that are bot-only while the rest of the
  // country has real users (e.g. China cloud regions vs Chinese diaspora users)
  const city = request.headers.get("x-vercel-ip-city") || "";
  if (country && city && BOT_HEAVY_COUNTRY_CITIES.has(`${country}|${city}`)) return true;

  // Block known US-side data center cities (cloud-hosted bots)
  if (city && DATA_CENTER_CITIES.has(city)) return true;

  // Block requests where Vercel resolved no city at all in a high-traffic
  // bot-host country (anonymous proxy / Tor exit / cloud anycast). This
  // catches the "China/(not set)" pattern (35 GA4 sessions, 11% engagement)
  // without affecting real Chinese users who resolve to a city.
  if (country === "CN" && !city) return true;

  // Hard-signal bot detection ONLY. Earlier we used soft heuristics (missing
  // sec-ch-ua, missing accept-language, etc) and false-positive-blocked EU
  // privacy users (Brave/Firefox/Chrome with strict shields) — Vercel logs
  // showed steady EU traffic that GA4 never recorded because middleware
  // returned 403 before the HTML rendered.
  //
  // Now we only block on:
  //  (a) UA strings that are obviously forged (e.g. Chrome without Safari
  //      fragment — no real Chrome ships without that), AND
  //  (b) the request lacks ANY Accept header pointing at HTML (real browsers
  //      always send one).
  // Both must be true together. A privacy browser stripping sec-ch-ua is
  // not enough to block.
  const acceptHeader = request.headers.get("accept") || "";
  const isForgedChrome = ua.includes("chrome/") && !ua.includes("safari/");
  const noHtmlIntent = !acceptHeader.includes("text/html") && !acceptHeader.includes("*/*");

  if (isForgedChrome && noHtmlIntent) return true;

  return false;
}

// Locale prefixes we used to support but have since killed. 90 days of GSC
// data (Jan 28 → Apr 24, 2026) showed 0 clicks across /es/ + /pt/ and 2 clicks
// from /fr/ across 390 URLs and 3,182 impressions — Google was burying them at
// position 50–90 because the chrome was translated but the body stayed in
// English.
//
// We initially returned 410 Gone (retired 2026-04-27), but 3 weeks later GSC
// still showed ~100 impressions/28d on these URLs with several ranking at
// position 1–10. The 410 text body ("see English version at /iban/austria")
// was giving Google a redirect hint without the redirect's strength, so the
// URLs persisted. Switched to 301 — a definitive "URL moved" signal that
// Google processes in 1–2 weeks and consolidates ranking equity onto the
// English URL.
const KILLED_LOCALE_PREFIXES = /^\/(es|fr|pt)(\/|$)/;

export default function middleware(request: NextRequest) {
  // Redirect www to non-www (canonical domain)
  const host = request.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // 301 retired-locale URLs to their English equivalent. Must run BEFORE
  // intlMiddleware so next-intl never sees the locale prefix.
  if (KILLED_LOCALE_PREFIXES.test(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.replace(KILLED_LOCALE_PREFIXES, "/");
    return NextResponse.redirect(url, 301);
  }

  // 301 non-canonical /compare/X-vs-Y directions to the canonical direction.
  // Previously both directions rendered 200 with a <link rel="canonical">
  // pointing at the winner; that works for Google but is fragile for Bing
  // and AI crawlers (Copilot, ChatGPT, Perplexity). Per Bing Webmaster Blog
  // Dec 2025, "Use 301 redirects to consolidate URL variants" — a 301 is
  // an unambiguous dedup signal that LLMs honor when picking grounding URLs.
  const compareMatch = request.nextUrl.pathname.match(/^\/compare\/([a-z0-9-]+)$/);
  if (compareMatch) {
    const slug = compareMatch[1];
    const canonicalSlug = getCompareCanonicalSlug(slug);
    if (canonicalSlug !== slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/compare/${canonicalSlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // Block spam bots at the edge — return 403 before any processing
  if (isSpamBot(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const response = intlMiddleware(request);

  // X-Robots-Tag for routes we noindex in page metadata. Sending this as an
  // HTTP header lets Googlebot drop the URL from indexing without rendering
  // the full HTML — recovers crawl budget that was being burned on ~3k
  // noindex'd locale variants and non-priority IBAN/SWIFT pages.
  // Mirrors the metadata logic in:
  //   - [locale]/{compare,news,guides,exchange-rates,business,companies,compare-money-transfer}/...
  //   - non-allowlisted iban/[slug] and swift-codes/[country]
  const path = request.nextUrl.pathname;
  if (shouldNoindexPath(path)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // CSP uses SHA-256 hashes for the two inline scripts in [locale]/layout.tsx
  // (gtag init + theme init). Hashes are static, so the layout no longer
  // needs to read `headers()` for a per-request nonce — and that removal is
  // what lets every page render statically and pick up the
  // `stale-while-revalidate=300` Cache-Control from next.config.ts. Per-
  // request nonces forced dynamic rendering, which auto-injected
  // `no-store, must-revalidate` and contributed to the May 2026 deindex.
  //
  // The hash list MUST stay in sync with the inline script bodies in
  // src/lib/inline-scripts.ts — scripts/check-inline-script-hashes.ts
  // enforces this at build time.
  const csp = [
    `default-src 'self'`,
    // Next.js App Router emits per-page inline streaming RSC hydration
    // scripts (<script>self.__next_f.push(...)) whose content varies per
    // page and per render. Static SHA-256 hashes cannot cover them, and
    // per-request nonces would force dynamic rendering (Cache-Control:
    // no-store), which contributed to the May 2026 deindex.
    //
    // 'strict-dynamic' + hashes was attempted but contradictory: per the
    // CSP3 spec, the presence of hashes/nonces makes the browser ignore
    // 'unsafe-inline', re-blocking the dynamic RSC scripts. The only
    // working policy that keeps static rendering is 'unsafe-inline'
    // alone (no hashes, no 'strict-dynamic').
    //
    // Crawlers don't execute scripts under CSP, so 'unsafe-inline' has
    // no SEO impact. The remaining XSS risk is mitigated by React's
    // default escaping (we only use dangerouslySetInnerHTML for known
    // static content) and by the rest of the CSP (no inline event
    // handlers via attribute, no eval, strict frame-ancestors, etc).
    `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://widget.trustpilot.com`,
    // 'unsafe-inline' required for style-src: React/Next.js uses inline style props
    // for dynamic values (colors, positions, backgrounds). This is the standard for
    // React apps — Next.js App Router does not support nonce-based inline styles.
    // See: https://csp.withgoogle.com/ and https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#content-security-policy
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://logo.clearbit.com https://flagcdn.com https://cdn.brandfetch.io https://hatscripts.github.io https://www.google.com https://*.trustpilot.com https://img.youtube.com https://i.ytimg.com`,
    `connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://open.er-api.com https://cdn.jsdelivr.net https://www.floatrates.com https://latest.currency-api.pages.dev https://widget.trustpilot.com`,
    `font-src 'self'`,
    `frame-src https://widget.trustpilot.com https://www.youtube-nocookie.com https://www.youtube.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
    `report-uri /api/csp-report`,
    `report-to csp-endpoint`,
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);
  // CSP violation reporting — violations are logged to /api/csp-report for visibility
  response.headers.set(
    "Report-To",
    JSON.stringify({ group: "csp-endpoint", max_age: 86400, endpoints: [{ url: "/api/csp-report" }] }),
  );

  // Set geo widget cookies from Vercel's IP country header.
  // geo-currency    — "from" currency for the comparison widget
  // geo-default-to  — "to" currency (diaspora-aware for receiver countries)
  // geo-default-amount — default transfer amount in fromCurrency
  // All three are set together on first visit so the widget hydrates correctly.
  const country = request.headers.get("x-vercel-ip-country") || "";
  // Write all three geo cookies atomically — always together so the widget
  // never hydrates with a partial set (e.g. geo-currency present but
  // geo-default-to missing due to selective cookie clearing).
  const hasAllGeoCookies =
    request.cookies.get("geo-currency") &&
    request.cookies.get("geo-default-to") &&
    request.cookies.get("geo-default-amount");
  if (!hasAllGeoCookies) {
    const { fromCurrency, toCurrency, defaultAmount } = getGeoDefaults(country);
    const cookieOpts = { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" as const };
    response.cookies.set("geo-currency",       fromCurrency,          cookieOpts);
    response.cookies.set("geo-default-to",     toCurrency,            cookieOpts);
    response.cookies.set("geo-default-amount", String(defaultAmount),  cookieOpts);
  }

  // Refresh geo-country cookie on every request so consent logic
  // always reflects the user's current location (not where they
  // were 30 days ago).
  response.cookies.set("geo-country", country || "US", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Match all pathnames except those starting with:
  // - api (API routes)
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - files with extensions (static files like .ico, .svg, .png, etc.)
  matcher: ["/((?!api|_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)"],
};
