import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  turbopack: {
    // Stub out Next.js's unconditional client polyfills. They are Baseline in
    // every browser our browserslist targets, so shipping them is dead weight
    // (Lighthouse "legacy JavaScript", ~14 KiB). See src/lib/modern-polyfill.js.
    resolveAlias: {
      // The polyfill-module chunk is loaded by MODERN browsers (the ESM build).
      // Aliasing it to an empty stub removes the Baseline-supported polyfills
      // that Lighthouse flags as "legacy JavaScript" from the bundle real users
      // download. (The separate polyfill-nomodule/core-js chunk is injected by
      // the build pipeline outside module resolution, so resolveAlias can't
      // touch it — but it ships as <script noModule>, which modern browsers
      // never fetch or run, so it costs real users nothing.)
      "../build/polyfills/polyfill-module": "./src/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./src/lib/modern-polyfill.js",
    },
  },
  outputFileTracingExcludes: {
    "*": ["./src/data/scraped/history/**"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "hatscripts.github.io" },
      { protocol: "https", hostname: "cdn.brandfetch.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // CSP is now set per-request in middleware.ts with nonce support
        ],
      },
      {
        source: "/logos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/flags/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // HTML pages MUST NOT be CDN-cached because middleware.ts generates a
      // per-request CSP nonce. If Vercel's edge cache serves cached HTML to
      // user A while sending user B's response headers, the page's inline
      // <script nonce="..."> tags carry user A's nonce but the CSP header
      // declares user B's nonce — silently blocking gtag, theme-init, and
      // every JSON-LD block. This was observed as intermittent GA blackouts
      // and zero EU traffic in GA4 despite Vercel logs showing EU requests.
      //
      // private = browser may cache, but no shared/CDN caching.
      // max-age=0, stale-while-revalidate=300 lets the browser/Googlebot
      // serve the response while revalidating in the background — softer
      // than no-cache, must-revalidate which signals "do not trust this
      // response" to crawlers and contributed to the May 2026 deindex.
      {
        source: "/((?!_next/|api/|go/|out/|logos/).*)",
        headers: [
          { key: "Cache-Control", value: "private, max-age=0, stale-while-revalidate=300" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/comparison",
        destination: "/compare",
        permanent: true,
      },
      {
        source: "/comparison/:slug",
        destination: "/compare/:slug",
        permanent: true,
      },
      {
        source: "/.well-known/llms.txt",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/.well-known/openapi.json",
        destination: "/openapi.json",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
