import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Single wildcard group — the canonical form per Google's own robots.txt
  // docs. Per-bot groups only add value when bots get DIFFERENT rules; ours
  // all share one policy, so ~18 identical groups were pure redundancy. A
  // crawler obeys only the most-specific matching group, so `*` covers every
  // search + AI bot (Googlebot, bingbot, GPTBot, ClaudeBot, PerplexityBot,
  // CCBot, etc.) identically.
  //
  // Disallow rationale (this site is SERVER-RENDERED, so Google never needs
  // /api/ to render a page — blocking it costs zero SEO):
  //   /api/   — data/search/cron endpoints; crawling them burns serverless
  //             compute for no ranking value. Blocked.
  //   /api/ai — EXCEPTION: the public, CORS-enabled live-quotes endpoint built
  //             for AI assistants (see /for-ai). Allow listed above the /api/
  //             block so AI crawlers can reach it (Allow beats Disallow on the
  //             more-specific path).
  //   /go/, /out/ — affiliate redirect routes (302s, not content).
  //
  // No `Host` directive: non-standard Yandex-only extension that Google never
  // supported and Bing ignores; validators flag it as an error. Canonical
  // domain is enforced via the www→non-www 301 in middleware + rel=canonical.
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/ai"],
        disallow: ["/api/", "/go/", "/out/"],
      },
    ],
    sitemap: "https://sendmoneycompare.com/sitemap.xml",
  };
}
