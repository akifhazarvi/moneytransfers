/**
 * App Store Ratings Scraper (API + JSON-LD)
 *
 * Collects iOS App Store and Google Play ratings for every provider we rank,
 * so app-store scores can be shown on a like-for-like basis instead of
 * quoting whichever provider happens to send us their own figures.
 *
 * Two sources, both keyless:
 * - Apple: the public iTunes Lookup API returns averageUserRating and
 *   userRatingCount as clean JSON. No scraping needed.
 * - Google Play: no public API, so we parse the aggregateRating out of the
 *   JSON-LD block embedded in the store page. Play's DOM changes often; the
 *   JSON-LD has been stable and is what we key on. If Google drops it, this
 *   returns null rather than a wrong number.
 *
 * IMPORTANT — ratings are per storefront. We pin both stores to the US
 * storefront so providers are compared on the same basis. A provider's own
 * marketing usually quotes a *global* total, which is a larger number than
 * anything a single storefront reports; do not reconcile the two.
 */
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 600;
const STOREFRONT = "us";

// Chrome UA — Play Store serves a stripped page to unknown agents.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// App IDs resolved via the iTunes Search API and Play Store search, then
// pinned here so a search-ranking change can never silently swap in the
// wrong app. Verified against each app's published title.
const PROVIDERS: {
  slug: string;
  name: string;
  appleId: string;
  playPackage: string;
}[] = [
  { slug: "wise", name: "Wise", appleId: "612261027", playPackage: "com.transferwise.android" },
  { slug: "remitly", name: "Remitly", appleId: "674258465", playPackage: "com.remitly.androidapp" },
  { slug: "ofx", name: "OFX", appleId: "499457234", playPackage: "au.com.ozforex" },
  { slug: "xe", name: "XE", appleId: "315241195", playPackage: "com.xe.currency" },
  { slug: "western-union", name: "Western Union", appleId: "424716908", playPackage: "com.westernunion.android.mtapp" },
  { slug: "worldremit", name: "WorldRemit", appleId: "875855935", playPackage: "com.worldremit.android" },
  { slug: "revolut", name: "Revolut", appleId: "932493382", playPackage: "com.revolut.revolut" },
  { slug: "paypal", name: "PayPal", appleId: "283646709", playPackage: "com.paypal.android.p2pmobile" },
  { slug: "moneygram", name: "MoneyGram", appleId: "867619606", playPackage: "com.gpshopper.moneygram" },
  { slug: "xoom", name: "Xoom", appleId: "529615515", playPackage: "com.xoom.android.app" },
  { slug: "torfx", name: "TorFX", appleId: "1135444387", playPackage: "com.bnt.torfx" },
  { slug: "instarem", name: "Instarem", appleId: "1190075959", playPackage: "com.instarem.mobileapp" },
  { slug: "currencies-direct", name: "Currencies Direct", appleId: "1094746471", playPackage: "com.bnt.currencydirect" },
  { slug: "taptap-send", name: "TapTap Send", appleId: "1413346006", playPackage: "com.taptapsend" },
  { slug: "paysend", name: "Paysend", appleId: "1140130413", playPackage: "com.paysend.app" },
  { slug: "ria", name: "Ria", appleId: "1065921908", playPackage: "com.ria.moneytransfer" },
];

interface StoreRating {
  score: number | null;
  ratingCount: number | null;
  appName: string | null;
}

interface AppRating {
  slug: string;
  name: string;
  storefront: string;
  apple: StoreRating & { appleId: string };
  googlePlay: StoreRating & { playPackage: string };
  dateCollected: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchApple(appleId: string): Promise<StoreRating> {
  const empty: StoreRating = { score: null, ratingCount: null, appName: null };
  try {
    const url = `https://itunes.apple.com/lookup?id=${appleId}&country=${STOREFRONT}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return empty;

    const json = (await res.json()) as {
      results?: { averageUserRating?: number; userRatingCount?: number; trackName?: string }[];
    };
    const app = json.results?.[0];
    if (!app || typeof app.averageUserRating !== "number") return empty;

    return {
      // Apple returns full float precision; one decimal is what the store shows.
      score: Math.round(app.averageUserRating * 10) / 10,
      ratingCount: app.userRatingCount ?? null,
      appName: app.trackName ?? null,
    };
  } catch {
    return empty;
  }
}

async function fetchGooglePlay(playPackage: string): Promise<StoreRating> {
  const empty: StoreRating = { score: null, ratingCount: null, appName: null };
  try {
    const url = `https://play.google.com/store/apps/details?id=${playPackage}&hl=en&gl=US`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return empty;

    const html = await res.text();
    const rating = html.match(
      /"aggregateRating"\s*:\s*\{[^}]*"ratingValue"\s*:\s*"?([0-9.]+)"?[^}]*"ratingCount"\s*:\s*"?([0-9]+)"?/
    );
    if (!rating) return empty;

    const score = parseFloat(rating[1]);
    if (Number.isNaN(score)) return empty;

    const nameMatch = html.match(/<title>([^<]*)<\/title>/);
    const appName = nameMatch
      ? nameMatch[1].replace(/\s*[-–]\s*Apps on Google Play\s*$/i, "").trim() || null
      : null;

    return {
      score: Math.round(score * 10) / 10,
      ratingCount: parseInt(rating[2], 10),
      appName,
    };
  } catch {
    return empty;
  }
}

async function main() {
  console.log("=== App Store Ratings Scraper ===\n");
  console.log(`Providers: ${PROVIDERS.length} | storefront: ${STOREFRONT.toUpperCase()}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const ratings: AppRating[] = [];

  for (const provider of PROVIDERS) {
    console.log(`  Fetching: ${provider.name}...`);

    const apple = await fetchApple(provider.appleId);
    await delay(DELAY_MS);
    const googlePlay = await fetchGooglePlay(provider.playPackage);

    ratings.push({
      slug: provider.slug,
      name: provider.name,
      storefront: STOREFRONT,
      apple: { ...apple, appleId: provider.appleId },
      googlePlay: { ...googlePlay, playPackage: provider.playPackage },
      dateCollected: new Date().toISOString(),
    });

    const a = apple.score !== null ? `${apple.score} (${apple.ratingCount?.toLocaleString()})` : "✗";
    const g =
      googlePlay.score !== null
        ? `${googlePlay.score} (${googlePlay.ratingCount?.toLocaleString()})`
        : "✗";
    console.log(`    Apple: ${a}  |  Play: ${g}`);

    await delay(DELAY_MS);
  }

  const outputPath = path.join(OUTPUT_DIR, "app-store-ratings.json");
  fs.writeFileSync(outputPath, JSON.stringify(ratings, null, 2));
  console.log(`\nWrote ${outputPath} (${ratings.length} providers)`);

  const missing = ratings.filter((r) => r.apple.score === null || r.googlePlay.score === null);

  console.log("\n=== Summary ===");
  console.log(`${"Provider".padEnd(20)} ${"Apple".padStart(6)} ${"Ratings".padStart(11)} ${"Play".padStart(6)} ${"Ratings".padStart(11)}`);
  console.log("-".repeat(60));
  for (const r of ratings) {
    console.log(
      `${r.name.padEnd(20)} ${(r.apple.score?.toFixed(1) ?? "N/A").padStart(6)} ${(r.apple.ratingCount?.toLocaleString() ?? "N/A").padStart(11)} ${(r.googlePlay.score?.toFixed(1) ?? "N/A").padStart(6)} ${(r.googlePlay.ratingCount?.toLocaleString() ?? "N/A").padStart(11)}`
    );
  }

  if (missing.length > 0) {
    console.log(
      `\n⚠ ${missing.length} provider(s) missing a store score: ${missing.map((m) => m.slug).join(", ")}`
    );
    console.log("  An app ID may have changed, or Play dropped its JSON-LD block.");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
