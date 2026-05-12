import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 5000; // be very polite with Trustpilot

// Map provider slug to Trustpilot domain
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
];

interface TrustpilotRating {
  slug: string;
  name: string;
  trustpilotDomain: string;
  score: number | null;
  totalReviews: number | null;
  ratingLabel: string | null;
  stars: number | null; // 1-5
  dateCollected: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scoreToLabel(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 4.0) return "Great";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Average";
  if (score >= 1.5) return "Poor";
  return "Bad";
}

async function fetchTrustpilotRating(
  domain: string
): Promise<{ score: number | null; totalReviews: number | null; stars: number | null }> {
  const url = `https://www.trustpilot.com/review/${domain}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      console.log(`    ⚠ HTTP ${res.status}`);
      return { score: null, totalReviews: null, stars: null };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Try to extract from JSON-LD structured data
    let score: number | null = null;
    let totalReviews: number | null = null;
    let stars: number | null = null;

    // Look for JSON-LD schema
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "");
        if (data.aggregateRating) {
          score = parseFloat(data.aggregateRating.ratingValue);
          totalReviews = parseInt(data.aggregateRating.reviewCount);
          stars = Math.round(score);
        }
        // Handle @graph format
        if (data["@graph"]) {
          for (const item of data["@graph"]) {
            if (item.aggregateRating) {
              score = parseFloat(item.aggregateRating.ratingValue);
              totalReviews = parseInt(item.aggregateRating.reviewCount);
              stars = Math.round(score);
            }
          }
        }
      } catch {
        // skip malformed JSON
      }
    });

    // Fallback: parse from meta tags
    if (score === null) {
      const ratingContent = $('meta[property="og:description"]').attr("content") || "";
      const ratingMatch = ratingContent.match(/([\d.]+)\s*(?:out of|\/)\s*5/);
      if (ratingMatch) score = parseFloat(ratingMatch[1]);

      const reviewMatch = ratingContent.match(/([\d,]+)\s*reviews?/i);
      if (reviewMatch) totalReviews = parseInt(reviewMatch[1].replace(/,/g, ""));
    }

    // Fallback: parse from page content
    if (score === null) {
      const scoreEl = $('[data-rating-typography="true"]').first().text();
      if (scoreEl) score = parseFloat(scoreEl);

      const reviewEl = $('span[data-reviews-count-typography="true"]').first().text();
      if (reviewEl) totalReviews = parseInt(reviewEl.replace(/[^0-9]/g, ""));
    }

    if (score) stars = Math.round(score);

    return { score, totalReviews, stars };
  } catch (err) {
    console.log(`    ⚠ Failed: ${err}`);
    return { score: null, totalReviews: null, stars: null };
  }
}

async function main() {
  console.log("=== Trustpilot Review Scraper ===\n");
  console.log(`Providers: ${PROVIDERS.length}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const ratings: TrustpilotRating[] = [];

  for (const provider of PROVIDERS) {
    console.log(`  Fetching: ${provider.name} (${provider.trustpilotDomain})...`);

    const { score, totalReviews, stars } = await fetchTrustpilotRating(
      provider.trustpilotDomain
    );

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
        `    ✓ Score: ${score}/5 (${totalReviews?.toLocaleString()} reviews) — ${rating.ratingLabel}`
      );
    } else {
      console.log(`    ✗ Could not extract rating`);
    }

    await delay(DELAY_MS);
  }

  // Write output
  const outputPath = path.join(OUTPUT_DIR, "trustpilot-ratings.json");
  fs.writeFileSync(outputPath, JSON.stringify(ratings, null, 2));
  console.log(`\nWrote ${outputPath} (${ratings.length} providers)`);

  // Print summary table
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
