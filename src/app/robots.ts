import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Bing-recommended format: a single wildcard group instead of ~18 identical
  // per-bot blocks. Bing matches the most-specific applicable group, so when
  // every bot shares the same rules, one `User-agent: *` group is the canonical
  // form — fewer parsing edge cases, easier to audit, and exactly what Bing
  // Webmaster Tools recommends (avoid redundant duplicate groups). All search
  // + AI crawlers (Googlebot, bingbot, GPTBot, ClaudeBot, PerplexityBot, CCBot,
  // etc.) are covered by `*` with full content access; only the affiliate
  // redirect routes and internal API stay disallowed.
  //
  // No `Host` directive: it's a non-standard Yandex-only extension that Google
  // never supported and Bing ignores — robots.txt validators flag it as an
  // error. Canonical domain is enforced via the www→non-www 301 in middleware
  // and <link rel="canonical">, which is the correct mechanism.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
    ],
    sitemap: "https://sendmoneycompare.com/sitemap.xml",
  };
}
