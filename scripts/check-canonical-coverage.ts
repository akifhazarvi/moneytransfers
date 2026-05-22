/**
 * Verify that every URL in the production sitemap:
 *   1. Returns HTTP 200 (not a 301 — that means it's not the canonical itself)
 *   2. Returns an HTML `<link rel="canonical">` pointing at itself
 *   3. Has no `noindex` meta tag (sitemap inclusion + noindex is a contradiction
 *      Google's guide warns about)
 *
 * Sampling: by default checks 30 URLs (a representative slice across the
 * sitemap's URL groups). Pass --all to check every URL in the sitemap. Pass
 * --url=<path> to check a single path.
 *
 * Run after a deploy stabilizes (~2 minutes) or any change to canonical/redirect
 * logic. Designed to be cheap enough to run in CI as a smoke test.
 *
 *   npx tsx scripts/check-canonical-coverage.ts
 *   npx tsx scripts/check-canonical-coverage.ts --all
 *   npx tsx scripts/check-canonical-coverage.ts --url=/compare/wise-vs-remitly
 */

const SITE_URL = process.env.SITE_URL || "https://sendmoneycompare.com";
const SAMPLE_SIZE = 30;
const UA = "SMC-Canonical-Checker/1.0 (+akifhazarvi@yahoo.com)";

interface Finding {
  url: string;
  status: number;
  finalUrl: string;
  canonical: string | null;
  noindex: boolean;
  issue: string;
}

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap.xml had no <loc> entries");
  return urls;
}

function sampleUrls(urls: string[], n: number): string[] {
  if (urls.length <= n) return urls;
  // Evenly-spaced sample across the (sorted) sitemap so we hit different
  // route prefixes (/send-money, /compare, /companies, /guides, ...).
  const step = Math.floor(urls.length / n);
  return Array.from({ length: n }, (_, i) => urls[i * step]);
}

async function checkOne(url: string): Promise<Finding | null> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    redirect: "manual",
  });
  const finding: Finding = {
    url,
    status: res.status,
    finalUrl: url,
    canonical: null,
    noindex: false,
    issue: "",
  };

  // Sitemap URLs should return 200. A 301/302 from a sitemap URL means we're
  // submitting a non-canonical (Google's guide: don't do this).
  if (res.status >= 300 && res.status < 400) {
    finding.finalUrl = res.headers.get("location") || "";
    finding.issue = `sitemap URL ${res.status}-redirects to ${finding.finalUrl}`;
    return finding;
  }
  if (res.status !== 200) {
    finding.issue = `HTTP ${res.status}`;
    return finding;
  }

  const html = await res.text();
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  finding.canonical = canonicalMatch?.[1] ?? null;
  finding.noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);

  const issues: string[] = [];
  if (!finding.canonical) {
    issues.push("missing <link rel=\"canonical\">");
  } else if (finding.canonical !== url) {
    issues.push(`canonical mismatch: page=${url}, tag=${finding.canonical}`);
  }
  if (finding.noindex) {
    issues.push("noindex meta on a sitemap URL");
  }
  if (issues.length) {
    finding.issue = issues.join("; ");
    return finding;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const singleUrl = args.find((a) => a.startsWith("--url="))?.slice(6);
  const checkAll = args.includes("--all");

  let urls: string[];
  if (singleUrl) {
    urls = [singleUrl.startsWith("http") ? singleUrl : `${SITE_URL}${singleUrl}`];
  } else {
    const all = await fetchSitemapUrls();
    urls = checkAll ? all : sampleUrls(all, SAMPLE_SIZE);
    console.log(`Checking ${urls.length} URL${urls.length === 1 ? "" : "s"} of ${all.length} in sitemap...\n`);
  }

  const findings: Finding[] = [];
  for (const url of urls) {
    const result = await checkOne(url).catch((e) => ({
      url, status: 0, finalUrl: url, canonical: null, noindex: false,
      issue: `fetch failed: ${e.message}`,
    } as Finding));
    if (result) findings.push(result);
  }

  if (findings.length === 0) {
    console.log(`✅ All ${urls.length} URLs pass: 200, self-canonical, no noindex.`);
    return;
  }

  console.log(`⚠️  ${findings.length} issue${findings.length === 1 ? "" : "s"} found:\n`);
  for (const f of findings) {
    console.log(`  ${f.url}`);
    console.log(`    ${f.issue}`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
