import sitemap from "../sitemap";
import { googleIndexable } from "@/lib/seo-indexing";

/**
 * sitemap-google.xml — the Google-only sitemap (round-3 freelance plan,
 * 2026-09-27). sitemap.xml now carries Bing earners that are served
 * `googlebot: noindex`; submitting those to Google would be the
 * "sitemap says index, page says noindex" contradiction behind the May 8 2026
 * deindex. This is the same list filtered by googleIndexable(), and it is the
 * sitemap submitted in Search Console. check:indexing asserts every URL here
 * is indexable for Googlebot and self-canonical.
 */
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET(): Response {
  const entries = sitemap().filter((e) => googleIndexable(new URL(e.url).pathname));
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => {
        const lastmod = e.lastModified
          ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`
          : "";
        return `<url>\n<loc>${escapeXml(e.url)}</loc>\n${lastmod}\n</url>`;
      })
      .join("\n") +
    "\n</urlset>\n";
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
