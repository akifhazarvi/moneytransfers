import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  outputFileTracingIncludes: {
    "/[locale]/send-money/[corridor]": ["./src/data/scraped/history/**/*.json"],
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
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
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // HTML pages: cache for 5 minutes, serve stale for up to 1 hour while revalidating
      // Balances freshness (live rate data updated every 6hrs) with repeat-visit performance
      {
        source: "/((?!_next/|api/|go/|out/).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=3600" },
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
    ];
  },
};

export default withNextIntl(nextConfig);
