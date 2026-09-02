/**
 * Guards the failure modes found in the 2026-09-01 GSC audit and the
 * 2026-09-02 Semrush crawl:
 *
 *   1. A URL that Google/Bing ranks returns 404 or 410.
 *   2. A redirect resolves to a URL that 404s (the /fr/* → English → 404 chain,
 *      which silently swallowed 43 impressions and a click on
 *      /fr/send-money/send-money-to-algeria).
 *   3. A ranking URL answers 200 with no page content — a soft 404. Status
 *      alone was not enough: three Tier-3 ranking corridors sat outside
 *      generateStaticParams with dynamicParams=false, so they served the
 *      framework shell ("Loading…" plus header/footer, no <h1>) at HTTP 200.
 *      This check passed them for a day while they ranked at positions 3-8.
 *   4. A ranking URL serves `noindex`. The same three were listed in
 *      sitemap.xml (which consults shouldNoindex, where the ranking carve-out
 *      lives) while generateMetadata's earlier Tier-3 return said noindex.
 *
 * Run against production or a preview deploy:
 *   npx tsx scripts/check-ranking-urls.ts [baseUrl]
 *
 * Exits non-zero on any failure so CI can block the deploy.
 */
import { RANKING_CORRIDOR_SLUGS } from "../src/lib/ranking-corridors";

const BASE = process.argv[2]?.replace(/\/$/, "") || "https://sendmoneycompare.com";

// The site's bot scorer 403s clients that omit these; a bare fetch looks
// automated and the check would fail for the wrong reason.
const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
};

/**
 * Non-corridor URLs that rank (position ≤ 30 or ≥1 click in the trailing 90d).
 * /swift-codes/serbia is deliberately absent: 340 words at position 46 with no
 * clicks is thin, and it was correctly retired in the SWIFT cleanup.
 */
const RANKING_PATHS = [
  "/",
  "/exchange-rates/history/usd-to-hnl",
  "/guides/send-money-to-bangladesh-guide",
];

/** Redirects whose targets must resolve — locale prefixes are the risky ones. */
const REDIRECT_PATHS = [
  "/fr/send-money/send-money-to-algeria",
  "/fr/send-money/uk-to-guatemala",
  "/fr/send-money/germany-to-pakistan",
  "/fr/send-money/usa-to-japan",
  "/es/exchange-rates/history/usd-to-hnl",
  "/es",
  "/fr",
];

type Result = { path: string; status: number; via?: string; ok: boolean; why: string };

/** Shortest real page body we ship; below this the response is a shell. */
const MIN_BODY_CHARS = 2000;

/**
 * A 200 is necessary but not sufficient. Assert the response actually contains
 * a page: an <h1>, enough text to not be chrome-only, and no noindex.
 */
function inspectHtml(html: string): string | null {
  if (!/<h1[\s>]/i.test(html)) return "200 but no <h1> (soft 404 / shell response)";
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] ?? "";
  if (/noindex/i.test(robots)) return `200 but serves robots "${robots}"`;
  const body = html
    .replace(/<(script|style|svg|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (body.length < MIN_BODY_CHARS) return `200 but only ${body.length} chars of text`;
  return null;
}

async function hop(path: string): Promise<Result> {
  let url = BASE + path;
  let via: string | undefined;
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers: HEADERS, redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { path, status: res.status, via, ok: false, why: "redirect with no Location" };
      url = loc.startsWith("http") ? loc : BASE + loc;
      via = url.replace(BASE, "");
      continue;
    }
    if (res.status !== 200) {
      return {
        path, status: res.status, via, ok: false,
        why: via ? `redirect target returns ${res.status}` : `returns ${res.status}`,
      };
    }
    const contentIssue = inspectHtml(await res.text());
    return {
      path, status: res.status, via,
      ok: !contentIssue,
      why: contentIssue ?? "ok",
    };
  }
  return { path, status: 0, via, ok: false, why: "too many redirect hops" };
}

async function main() {
  const paths = [
    ...RANKING_PATHS,
    ...[...RANKING_CORRIDOR_SLUGS].map((s) => `/send-money/${s}`),
    ...REDIRECT_PATHS,
  ];
  console.log(`Checking ${paths.length} ranking / redirect URLs against ${BASE}\n`);

  const results: Result[] = [];
  for (const p of paths) {
    results.push(await hop(p));
    await new Promise((r) => setTimeout(r, 150));
  }

  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    const mark = r.ok ? "  ok  " : " FAIL ";
    const arrow = r.via ? ` → ${r.via}` : "";
    console.log(`${mark} ${String(r.status).padEnd(4)} ${r.path}${arrow}${r.ok ? "" : `   (${r.why})`}`);
  }

  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.error(
      `\n${failed.length} URL(s) that search engines rank are broken.\n` +
        `A ranking page must never 404, 410, redirect into one, serve noindex, or\n` +
        `answer 200 with an empty shell — see src/lib/ranking-corridors.ts.`,
    );
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
