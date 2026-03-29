/**
 * aggregate-history.ts
 *
 * 1. Creates a new snapshot by merging all live *-quotes.json files into
 *    history/quotes-{timestamp}.json (skipped if one already exists for this hour).
 * 2. Reads all history/quotes-*.json snapshots and produces compact per-corridor
 *    time series files at history/corridors/{FROM}-{TO}.json.
 *
 * Output shape per corridor file:
 * [
 *   {
 *     "date": "2026-03-16",
 *     "providers": {
 *       "wise":    { "rate": 92.23, "fee": 7.66, "markup": 0.016, "receiveAmount": 8516 },
 *       "remitly": { "rate": 91.80, "fee": 2.99, "markup": 0.048, "receiveAmount": 8878 },
 *       ...
 *     }
 *   },
 *   ...
 * ]
 *
 * When multiple snapshots exist for the same day, the latest one wins.
 * Only the $100 send-amount quote is kept (the most common reference amount).
 */

import fs from "fs";
import path from "path";

const SCRAPED_DIR = path.join("src/data/scraped");
const HISTORY_DIR = path.join(SCRAPED_DIR, "history");
const CORRIDORS_DIR = path.join(HISTORY_DIR, "corridors");
const INDEX_PATH = path.join(HISTORY_DIR, "index.json");

interface Quote {
  providerSlug: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  midMarketRate: number;
  markup: number;
  receiveAmount: number;
  dateCollected: string;
}

interface ProviderEntry {
  rate: number;
  fee: number;
  markup: number;
  receiveAmount: number;
}

interface DayEntry {
  date: string;
  providers: Record<string, ProviderEntry>;
}

function isoToDate(iso: string): string {
  return iso.slice(0, 10); // "2026-03-16"
}

/**
 * Merge all live *-quotes.json files into a single snapshot.
 * Skips if a snapshot for the current hour already exists (avoids duplicates
 * when both API and browser workflows run close together).
 */
function createSnapshot(): string | null {
  const now = new Date();
  const tag = now.toISOString().replace(/:/g, "-").slice(0, 16); // "2026-03-28T18-27"
  const filename = `quotes-${tag}.json`;
  const outPath = path.join(HISTORY_DIR, filename);

  // Skip if a snapshot for this hour already exists
  const hourPrefix = `quotes-${tag.slice(0, 13)}`; // "quotes-2026-03-28T18"
  const existing = fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.startsWith(hourPrefix) && f.endsWith(".json"));
  if (existing.length > 0) {
    console.log(`Snapshot already exists for this hour (${existing[0]}) — skipping`);
    return null;
  }

  // Collect all live quote files
  const quoteFiles = fs
    .readdirSync(SCRAPED_DIR)
    .filter((f) => f.endsWith("-quotes.json"));

  const allQuotes: Quote[] = [];
  for (const file of quoteFiles) {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(SCRAPED_DIR, file), "utf-8")
      );
      if (Array.isArray(data)) allQuotes.push(...data);
    } catch {
      console.warn(`Warning: failed to parse ${file}, skipping`);
    }
  }

  if (allQuotes.length === 0) {
    console.log("No quotes found in live files — skipping snapshot");
    return null;
  }

  fs.writeFileSync(outPath, JSON.stringify(allQuotes));
  console.log(
    `Created snapshot ${filename} (${allQuotes.length} quotes from ${quoteFiles.length} files)`
  );
  return filename;
}

function loadSnapshotFiles(): string[] {
  return fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.startsWith("quotes-") && f.endsWith(".json"))
    .sort(); // lexicographic sort = chronological (ISO timestamps)
}

function rebuildIndex(files: string[]): void {
  const snapshots = files.map((file) => {
    const filePath = path.join(HISTORY_DIR, file);
    const quotes: Quote[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const corridors = new Set(
      quotes.map((q) => `${q.sendCurrency}-${q.receiveCurrency}`)
    ).size;
    // Extract timestamp from filename: quotes-2026-03-16T19-13.json → 2026-03-16T19:13:00.000Z
    const ts = file
      .replace("quotes-", "")
      .replace(".json", "")
      .replace(/T(\d{2})-(\d{2})$/, "T$1:$2:00.000Z");
    return { timestamp: ts, file, corridors, quotes: quotes.length };
  });
  fs.writeFileSync(INDEX_PATH, JSON.stringify({ snapshots }, null, 2));
  console.log(`Rebuilt index.json with ${snapshots.length} snapshots`);
}

function aggregateCorridors(files: string[]): void {
  fs.mkdirSync(CORRIDORS_DIR, { recursive: true });

  // Map: corridor → date → providers
  const data: Record<string, Record<string, Record<string, ProviderEntry>>> =
    {};

  for (const file of files) {
    const filePath = path.join(HISTORY_DIR, file);
    const quotes: Quote[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Extract date from filename (more reliable than dateCollected field)
    const dateMatch = file.match(/quotes-(\d{4}-\d{2}-\d{2})/);
    const fileDate = dateMatch ? dateMatch[1] : isoToDate(new Date().toISOString());

    for (const q of quotes) {
      // Only keep the $100 reference amount
      if (q.sendAmount !== 100) continue;

      const corridor = `${q.sendCurrency}-${q.receiveCurrency}`;
      if (!data[corridor]) data[corridor] = {};
      if (!data[corridor][fileDate]) data[corridor][fileDate] = {};

      // Latest snapshot for this day wins (files are sorted chronologically)
      data[corridor][fileDate][q.providerSlug] = {
        rate: Math.round(q.exchangeRate * 10000) / 10000,
        fee: q.fee,
        markup: Math.round(q.markup * 10000) / 10000,
        receiveAmount: Math.round(q.receiveAmount * 100) / 100,
      };
    }
  }

  let corridorCount = 0;
  for (const [corridor, dateMap] of Object.entries(data)) {
    const series: DayEntry[] = Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, providers]) => ({ date, providers }));

    const outPath = path.join(CORRIDORS_DIR, `${corridor}.json`);
    fs.writeFileSync(outPath, JSON.stringify(series, null, 2));
    corridorCount++;
  }

  console.log(
    `Wrote ${corridorCount} corridor files to history/corridors/`
  );
}

function main() {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });

  // Step 1: Create a new snapshot from live quote files
  createSnapshot();

  // Step 2: Aggregate all snapshots into corridor time series
  const files = loadSnapshotFiles();
  if (files.length === 0) {
    console.log("No snapshot files found — nothing to aggregate.");
    return;
  }

  console.log(`Found ${files.length} snapshot files`);

  rebuildIndex(files);
  aggregateCorridors(files);

  console.log("Done.");
}

main();
