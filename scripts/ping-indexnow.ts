/**
 * IndexNow Ping Script
 *
 * Submits all data-driven URLs to IndexNow (Bing, Yandex, Naver, Seznam)
 * after scraper runs. Reads scraped quote files to determine which corridors
 * have data, then generates the full URL list.
 *
 * Run: npx tsx scripts/ping-indexnow.ts
 * Env: INDEXNOW_KEY (optional override, defaults to key in public/)
 */
import sitemap from "../src/app/sitemap";

const SITE_URL = "https://sendmoneycompare.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "504f73e915dcbe38e02c363c31409cad";

// The hardcoded allowlists and scraped-file readers that used to live here are
// gone — generateUrls() now derives every URL from src/app/sitemap.ts, so there is
// no second copy to keep in sync. See the note on generateUrls below.

/**
 * URLs to submit, derived from the sitemap.
 *
 * This used to rebuild the list from its own hardcoded copies of the allowlists —
 * a fourth source of truth alongside sitemap-allowlists.ts, seo-indexing.ts and the
 * page files. It had already drifted: it submitted /iban/united-kingdom while the
 * route slug is /iban/uk, so every run pushed a 404 to Bing. Submitting URLs that
 * do not resolve is the opposite of the signal this script exists to send.
 *
 * Importing the sitemap makes the two agree by construction — IndexNow submits
 * exactly what we claim is indexable, with nothing left to keep in sync.
 */
function generateUrls(): string[] {
  const entries = sitemap() as unknown as { url: string }[];
  return entries.map((e) => e.url).filter((u, i, arr) => arr.indexOf(u) === i);
}

/**
 * Submit URLs to IndexNow via batched POST. Spec allows up to 10,000 URLs per
 * request; we chunk at 10,000 to stay well under any soft limit and keep
 * payloads under typical CDN body caps. A handful of POSTs replaces ~1,700
 * sequential GETs and finishes in under 10 seconds vs. ~15 minutes.
 *
 * Spec: https://www.indexnow.org/documentation
 */
async function submitToIndexNow(urls: string[]): Promise<void> {
  const HOST = new URL(SITE_URL).host;
  const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  const BATCH_SIZE = 10_000;
  const ENDPOINT = "https://api.indexnow.org/indexnow";
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const body = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": "SendMoneyCompare-IndexNow/1.0 (+https://sendmoneycompare.com)",
        },
        body: JSON.stringify(body),
      });
      if (res.ok || res.status === 202) {
        succeeded += batch.length;
        console.log(`  ✓ Batch of ${batch.length} URLs accepted (HTTP ${res.status})`);
      } else {
        failed += batch.length;
        const text = await res.text().catch(() => "");
        console.error(`  ✗ Batch failed — HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
      }
    } catch (err) {
      failed += batch.length;
      console.error(`  ✗ Batch failed — network error:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\n✓ Done: ${succeeded}/${urls.length} URLs accepted, ${failed} failed`);
}

async function main() {
  const urls = generateUrls();
  console.log(`IndexNow: ${urls.length} URLs derived from sitemap.ts`);

  if (urls.length === 0) {
    console.log("No URLs to submit — check that scraped data exists in src/data/scraped/");
    process.exit(0);
  }

  // Log a sample for debugging
  console.log(`Sample URLs (first 5):`);
  urls.slice(0, 5).forEach((u) => console.log(`  ${u}`));
  console.log(`  ... and ${urls.length - 5} more\n`);

  await submitToIndexNow(urls);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
