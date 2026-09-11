/**
 * Verifies that the external sources we cite actually resolve.
 *
 * WHY THIS EXISTS
 * `check:links` validates internal links only, so nothing had ever checked the
 * outbound citations — the links that carry the E-E-A-T weight on YMYL finance
 * content. A sweep on 2026-09-07 found 11 of 254 pointing at dead pages,
 * including four on a provider review that had just been promoted into the
 * index and two on the money-transfer-safety guide, where the PSR's
 * authorised-push-payment page is the source for the entire argument. A dead
 * citation is worse than none: it looks like evidence and supplies none.
 *
 * WHY THIS IS NOT A BUILD GATE
 * It is deliberately NOT wired into prebuild/postbuild. Many legitimate sources
 * refuse automated requests — Revolut answers 403 to every path including ones
 * that do not exist, and swift.com, canada.ca and austrac.gov.au all fail to
 * connect from CI while being perfectly alive in a browser. Gating deploys on
 * that would fail the build for reasons unrelated to our content, which is how
 * guards get disabled. Run it periodically and read the output instead.
 *
 * Only 404/400/410 from a host that answers normally is treated as broken.
 * 403s and connection errors are reported separately as UNVERIFIABLE, because
 * that status tells us nothing either way.
 *
 * Run: npm run check:sources        (add --all to list every URL checked)
 */
import { blogPosts } from "../src/data/blog-posts";
import { businessPages } from "../src/data/business-pages";
import { newsItems } from "../src/data/news";
import { corridors } from "../src/data/corridors";
import { getCountryDetails } from "../src/data/corridor-details";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const SITE = /^https?:\/\/(?:www\.)?sendmoneycompare\.com/;
const CONCURRENCY = 8;
const TIMEOUT_MS = 15_000;

const sources = new Map<string, Set<string>>();
function recordSource(url: string, where: string) {
  if (!/^https?:\/\//.test(url) || SITE.test(url)) return;
  const set = sources.get(url) ?? new Set<string>();
  set.add(where);
  sources.set(url, set);
}
function scan(html: string | undefined, where: string) {
  if (!html) return;
  for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) recordSource(m[1], where);
}

for (const corridor of corridors) {
  for (const faq of corridor.faqs) {
    for (const source of faq.sources ?? []) recordSource(source.url, `corridor:${corridor.slug}`);
  }
  const details = getCountryDetails(corridor.toCountry, corridor.toCurrency);
  for (const source of details?.sources ?? []) recordSource(source.url, `destination:${details!.countryName}`);
}

for (const p of blogPosts) {
  p.sections.forEach((s) => scan(s.content, `guide:${p.slug}`));
  (p.faqs ?? []).forEach((f) => scan(f.answer, `guide:${p.slug}`));
}
for (const p of businessPages) {
  scan(p.intro, `business:${p.slug}`);
  p.sections.forEach((s) => scan(s.content, `business:${p.slug}`));
  (p.faqs ?? []).forEach((f) => scan(f.answer, `business:${p.slug}`));
}
for (const n of newsItems as { slug: string; content?: string; sections?: { content: string }[] }[]) {
  scan(n.content, `news:${n.slug}`);
  (n.sections ?? []).forEach((s) => scan(s.content, `news:${n.slug}`));
}

type Result = { url: string; status: number | string; where: string[] };

async function head(url: string): Promise<number | string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // Some hosts reject HEAD but answer GET, so a 405 retries as GET.
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": UA },
    });
    // Retry as GET on anything that looks like a rejection rather than a real
    // answer. Several hosts reply to HEAD with 400/403/404 while serving the
    // same URL perfectly over GET — help.gcash.com and nts.go.kr both do, and
    // trusting HEAD alone reported two live, correct citations as dead. A guard
    // that cries wolf is a guard someone turns off.
    if ([400, 401, 403, 404, 405, 501].includes(res.status)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "user-agent": UA },
      });
    }
    return res.status;
  } catch (e) {
    return e instanceof Error && e.name === "AbortError" ? "TIMEOUT" : "UNREACHABLE";
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const urls = [...sources.keys()];
  const results: Result[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
      while (cursor < urls.length) {
        const url = urls[cursor++];
        results.push({ url, status: await head(url), where: [...(sources.get(url) ?? [])] });
      }
    }),
  );

  const broken = results.filter((r) => typeof r.status === "number" && [400, 404, 410].includes(r.status));
  const unverifiable = results.filter(
    (r) => typeof r.status !== "number" || (r.status >= 400 && ![400, 404, 410].includes(r.status)),
  );
  const ok = results.length - broken.length - unverifiable.length;

  if (process.argv.includes("--all")) {
    for (const r of results.sort((a, b) => a.url.localeCompare(b.url))) {
      console.log(`${String(r.status).padEnd(11)} ${r.url}`);
    }
    console.log("");
  }

  if (unverifiable.length) {
    console.log(`check:sources — ${unverifiable.length} unverifiable (host blocks automated requests; not necessarily broken)`);
    for (const r of unverifiable.slice(0, 10)) console.log(`  ${String(r.status).padEnd(11)} ${r.url}`);
    if (unverifiable.length > 10) console.log(`  … and ${unverifiable.length - 10} more`);
    console.log("");
  }

  if (broken.length) {
    console.error(`check:sources — ${broken.length} DEAD citation(s) of ${results.length} checked:\n`);
    for (const r of broken.sort((a, b) => a.where[0].localeCompare(b.where[0]))) {
      console.error(`  ${r.status}  ${r.url}`);
      console.error(`        cited on: ${r.where.join(", ")}`);
    }
    console.error(`\nReplace each with a page that resolves, or drop the link and keep the attribution.`);
    process.exit(1);
  }

  console.log(`check:sources ok — ${ok} of ${results.length} external citations resolve, 0 dead`);
}

main();
