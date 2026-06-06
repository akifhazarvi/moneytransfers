import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Explicit per-bot groups (Bing-preferred): each major search + AI crawler is
  // named so intent is unambiguous and individually auditable. Every group
  // shares the same policy — full content access, only /api/, /go/, /out/
  // disallowed (internal endpoints + affiliate redirects).
  //
  // No `Host` directive: it's a non-standard Yandex-only extension that Google
  // never supported and Bing ignores — robots.txt validators flag it as an
  // error. Canonical domain is enforced via the www→non-www 301 in middleware
  // and <link rel="canonical">, which is the correct mechanism.
  const standardRules = { allow: "/", disallow: ["/api/", "/go/", "/out/"] };

  return {
    rules: [
      // ── AI search crawlers (power search features, not just training) ──
      { userAgent: "GPTBot", ...standardRules },
      { userAgent: "OAI-SearchBot", ...standardRules },
      { userAgent: "ChatGPT-User", ...standardRules },
      { userAgent: "ClaudeBot", ...standardRules },
      { userAgent: "Claude-Web", ...standardRules },
      { userAgent: "PerplexityBot", ...standardRules },
      { userAgent: "Perplexity-User", ...standardRules },
      { userAgent: "Google-Extended", ...standardRules },
      // ── Bing crawler — powers Bing, Copilot, ChatGPT Search, DDG, Yahoo ──
      { userAgent: "bingbot", ...standardRules },
      { userAgent: "Applebot-Extended", ...standardRules },
      { userAgent: "DuckAssistBot", ...standardRules },
      { userAgent: "Meta-ExternalAgent", ...standardRules },
      { userAgent: "Amazonbot", ...standardRules },
      { userAgent: "MistralAI-User", ...standardRules },
      { userAgent: "CCBot", ...standardRules },
      { userAgent: "anthropic-ai", ...standardRules },
      { userAgent: "cohere-ai", ...standardRules },
      { userAgent: "Bytespider", ...standardRules },
      // ── All other crawlers ──
      { userAgent: "*", ...standardRules },
    ],
    sitemap: "https://sendmoneycompare.com/sitemap.xml",
  };
}
