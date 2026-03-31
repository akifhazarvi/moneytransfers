import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { COUNTRY_TO_CURRENCY } from "./data/geo-corridors";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Redirect www to non-www (canonical domain)
  const host = request.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const response = intlMiddleware(request);

  // CSP nonce — generate per request for strict CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://widget.trustpilot.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://logo.clearbit.com https://flagcdn.com https://cdn.brandfetch.io https://hatscripts.github.io https://www.google.com https://*.trustpilot.com`,
    `connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://open.er-api.com https://cdn.jsdelivr.net https://www.floatrates.com https://latest.currency-api.pages.dev https://widget.trustpilot.com`,
    `font-src 'self'`,
    `frame-src https://widget.trustpilot.com`,
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

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
