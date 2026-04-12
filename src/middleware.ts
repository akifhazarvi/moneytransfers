import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { COUNTRY_TO_CURRENCY } from "./data/geo-corridors";

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

// Legitimate bots to ALLOW (search engines + AI crawlers)
const ALLOWED_BOTS = [
  "googlebot", "bingbot", "yandexbot", "duckduckbot", "baiduspider",
  "applebot", "chatgpt-user", "gptbot", "oai-searchbot",
  "perplexitybot", "claudebot", "anthropic-ai",
  "bytespider", "facebookexternalhit", "twitterbot", "linkedinbot",
  "slurp", "ia_archiver", "archive.org_bot",
  "vercel-edge-functions", "vercel",
];

function isSpamBot(request: NextRequest): boolean {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  // Empty user agent = bot
  if (!ua || ua.length < 10) return true;

  // Allow known legitimate bots
  if (ALLOWED_BOTS.some((bot) => ua.includes(bot))) return false;

  // Block known spam bots
  if (SPAM_UA_PATTERNS.some((pattern) => ua.includes(pattern))) return true;

  // Block requests with no Accept-Language header (real browsers always send it)
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang && !ua.includes("bot")) {
    // Headless browsers often omit Accept-Language
    const acceptHeader = request.headers.get("accept") || "";
    if (!acceptHeader.includes("text/html")) return true;
  }

  return false;
}

export default function middleware(request: NextRequest) {
  // Redirect www to non-www (canonical domain)
  const host = request.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // Block spam bots at the edge — return 403 before any processing
  if (isSpamBot(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const response = intlMiddleware(request);

  // CSP nonce — generate per request for strict CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://widget.trustpilot.com`,
    // 'unsafe-inline' required for style-src: React/Next.js uses inline style props
    // for dynamic values (colors, positions, backgrounds). This is the standard for
    // React apps — Next.js App Router does not support nonce-based inline styles.
    // See: https://csp.withgoogle.com/ and https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#content-security-policy
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://logo.clearbit.com https://flagcdn.com https://cdn.brandfetch.io https://hatscripts.github.io https://www.google.com https://*.trustpilot.com`,
    `connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://open.er-api.com https://cdn.jsdelivr.net https://www.floatrates.com https://latest.currency-api.pages.dev https://widget.trustpilot.com`,
    `font-src 'self'`,
    `frame-src https://widget.trustpilot.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
    `report-uri /api/csp-report`,
    `report-to csp-endpoint`,
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  // CSP violation reporting — violations are logged to /api/csp-report for visibility
  response.headers.set(
    "Report-To",
    JSON.stringify({ group: "csp-endpoint", max_age: 86400, endpoints: [{ url: "/api/csp-report" }] }),
  );

  // Set geo-currency cookie from Vercel's IP country header
  const country = request.headers.get("x-vercel-ip-country") || "";
  const currency = COUNTRY_TO_CURRENCY[country] || "USD";
  if (!request.cookies.get("geo-currency")) {
    response.cookies.set("geo-currency", currency, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
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
