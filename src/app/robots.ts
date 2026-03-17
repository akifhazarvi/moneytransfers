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
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/go/", "/out/"],
      },
      // Block training-only crawlers
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
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
