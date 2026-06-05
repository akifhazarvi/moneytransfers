import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow AI search crawlers (these power search features, not just training)
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Claude.ai user-triggered fetches (when a user asks Claude about a URL)
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Perplexity user-initiated fetches (ignores robots but documenting intent)
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Allow Google-Extended — powers Google AI Overviews and Gemini (important for AI search visibility)
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Bing search crawler — powers Bing, Copilot, ChatGPT Search (via Bing API), DuckDuckGo, Yahoo
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Allow Apple Intelligence / Siri search
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // DuckDuckGo's AI assistant (DuckAssist)
      {
        userAgent: "DuckAssistBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Meta AI (powers Meta AI search, WhatsApp assistant)
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Amazon's AI assistant (Rufus)
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Mistral AI search
      {
        userAgent: "MistralAI-User",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Previously training-only crawlers — now allowed full content access so
      // nothing blocks AI/search ingestion. Still excludes /api/, /go/, /out/
      // (affiliate redirects + internal endpoints) like every other bot.
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // General crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
    ],
    sitemap: "https://sendmoneycompare.com/sitemap.xml",
  };
}
