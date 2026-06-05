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
      // HTML pages are CDN-cacheable. The old `private, max-age=0` here was a
      // defense against a per-request CSP nonce (cached HTML for user A could
      // carry user A's nonce while user B got user B's CSP header, breaking
      // inline scripts). That nonce is GONE — the CSP now uses static SHA-256
      // hashes + 'unsafe-inline' (see src/middleware.ts and
      // src/lib/inline-scripts.ts), so the response is identical for every
      // user and safe to share-cache. Leaving `private, max-age=0` in place
      // made every page CDN-uncacheable for Googlebot — `private` tells
      // shared caches not to store, which starved crawl budget and was the
      // structural cause of `indexed: 0` in GSC (Jun 2026).
      //
      // public + s-maxage lets Vercel's edge AND Google cache the HTML;
      // stale-while-revalidate keeps it fresh via background revalidation.
      {
        source: "/((?!_next/|api/|go/|out/|logos/).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
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
