/**
 * Trustpilot Review Scraper (Playwright)
 *
 * Trustpilot put up an AWS WAF challenge in May 2026 that returns HTTP 403
 * to plain fetch() requests — the old cheerio-based scraper started writing
 * all-null scores. Playwright executes the JS challenge so the real page
 * loads, and we extract the aggregateRating from JSON-LD as before.
 */
import * as fs from "fs";
import * as path from "path";
import { setupBrowserContext, delay, NAV_TIMEOUT } from "./lib/browser";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 2500;

const PROVIDERS: { slug: string; name: string; trustpilotDomain: string }[] = [
  { slug: "wise", name: "Wise", trustpilotDomain: "wise.com" },
  { slug: "remitly", name: "Remitly", trustpilotDomain: "remitly.com" },
  { slug: "ofx", name: "OFX", trustpilotDomain: "ofx.com" },
  { slug: "xe", name: "XE", trustpilotDomain: "xe.com" },
  { slug: "western-union", name: "Western Union", trustpilotDomain: "westernunion.com" },
  { slug: "worldremit", name: "WorldRemit", trustpilotDomain: "worldremit.com" },
  { slug: "revolut", name: "Revolut", trustpilotDomain: "revolut.com" },
  { slug: "paypal", name: "PayPal", trustpilotDomain: "paypal.com" },
  { slug: "moneygram", name: "MoneyGram", trustpilotDomain: "moneygram.com" },
  { slug: "xoom", name: "Xoom", trustpilotDomain: "xoom.com" },
  { slug: "torfx", name: "TorFX", trustpilotDomain: "torfx.com" },
  { slug: "instarem", name: "Instarem", trustpilotDomain: "instarem.com" },
  { slug: "regencyfx", name: "Regency FX", trustpilotDomain: "regencyfx.com" },
  { slug: "unplex", name: "Unplex", trustpilotDomain: "unplex.money" },
];

interface TrustpilotRating {
  slug: string;
  name: string;
  trustpilotDomain: string;
  score: number | null;
  totalReviews: number | null;
  ratingLabel: string | null;
  stars: number | null;
  dateCollected: string;
}

function scoreToLabel(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 4.0) return "Great";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Average";
  if (score >= 1.5) return "Poor";
  return "Bad";
}

async function main() {
  console.log("=== Trustpilot Review Scraper (Playwright) ===\n");
  console.log(`Providers: ${PROVIDERS.length}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const page = await context.newPage();
  const ratings: TrustpilotRating[] = [];

  try {
    for (const provider of PROVIDERS) {
      console.log(`  Fetching: ${provider.name} (${provider.trustpilotDomain})...`);

      let score: number | null = null;
      let totalReviews: number | null = null;
      let stars: number | null = null;

      try {
        const url = `https://www.trustpilot.com/review/${provider.trustpilotDomain}`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
        // <script> tags are never visible — wait for the element to attach.
        await page.waitForSelector('script[type="application/ld+json"]', {
          state: "attached",
          timeout: 15000,
        });

        const jsonLdBlocks = await page.$$eval(
          'script[type="application/ld+json"]',
          (els) => els.map((el) => el.textContent || "")
        );

        for (const raw of jsonLdBlocks) {
          try {
            const data = JSON.parse(raw);
            const items = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
            for (const item of items) {
              if (item?.aggregateRating?.ratingValue) {
                score = parseFloat(item.aggregateRating.ratingValue);
                totalReviews = parseInt(item.aggregateRating.reviewCount, 10);
                stars = Math.round(score);
                break;
              }
            }
            if (score !== null) break;
          } catch {
            // skip malformed JSON
          }
        }

        if (score === null) {
          // Last-resort DOM fallback (in case the JSON-LD selector changed)
          const scoreText = await page.$eval(
            '[data-rating-typography="true"]',
            (el) => el.textContent || ""
          ).catch(() => "");
          const parsed = parseFloat(scoreText);
          if (!Number.isNaN(parsed)) {
            score = parsed;
            stars = Math.round(parsed);
          }
        }
      } catch (err) {
        console.log(`    ⚠ Failed: ${(err as Error).message}`);
      }

      const rating: TrustpilotRating = {
        slug: provider.slug,
        name: provider.name,
        trustpilotDomain: provider.trustpilotDomain,
        score,
        totalReviews,
        ratingLabel: score ? scoreToLabel(score) : null,
        stars,
        dateCollected: new Date().toISOString(),
      };

      ratings.push(rating);

      if (score !== null) {
        console.log(
          `    ✓ Score: ${score}/5 (${totalReviews?.toLocaleString() || "?"} reviews) — ${rating.ratingLabel}`
        );
      } else {
        console.log(`    ✗ Could not extract rating`);
      }

      await delay(DELAY_MS);
    }
  } finally {
    await context.browser()?.close();
  }

  const outputPath = path.join(OUTPUT_DIR, "trustpilot-ratings.json");
  fs.writeFileSync(outputPath, JSON.stringify(ratings, null, 2));
  console.log(`\nWrote ${outputPath} (${ratings.length} providers)`);

  console.log("\n=== Summary ===");
  console.log(`${"Provider".padEnd(20)} ${"Score".padStart(6)} ${"Reviews".padStart(10)} Label`);
  console.log("-".repeat(55));
  for (const r of ratings.sort((a, b) => (b.score || 0) - (a.score || 0))) {
    console.log(
      `${r.name.padEnd(20)} ${(r.score?.toFixed(1) || "N/A").padStart(6)} ${(r.totalReviews?.toLocaleString() || "N/A").padStart(10)} ${r.ratingLabel || "N/A"}`
    );
  }
}

main().catch((err) => {
  console.error("Trustpilot scraper failed:", err);
  process.exit(1);
});
