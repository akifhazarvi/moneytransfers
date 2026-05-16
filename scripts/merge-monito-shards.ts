/**
 * Merge sharded Monito scraper outputs into monito-quotes.json.
 *
 * Sharded runs write monito-quotes.shard-0.json … shard-N.json. This script
 * concatenates them into the canonical monito-quotes.json that the app reads.
 *
 * Missing shard files are tolerated (one failed CI job shouldn't lose the
 * other 3 shards' data) and warned about.
 */
import * as fs from "fs";
import * as path from "path";
import { OUTPUT_DIR } from "./lib/browser";

function main() {
  const merged: unknown[] = [];
  const shards: string[] = [];
  const missing: string[] = [];

  const files = fs.readdirSync(OUTPUT_DIR);
  const shardFiles = files
    .filter((f) => /^monito-quotes\.shard-\d+\.json$/.test(f))
    .sort();

  if (shardFiles.length === 0) {
    console.error("No shard files found in", OUTPUT_DIR);
    process.exit(1);
  }

  for (const f of shardFiles) {
    const p = path.join(OUTPUT_DIR, f);
    try {
      const data = JSON.parse(fs.readFileSync(p, "utf-8"));
      if (Array.isArray(data)) {
        merged.push(...data);
        shards.push(`${f} (${data.length} quotes)`);
      } else {
        missing.push(`${f} (not an array)`);
      }
    } catch (err) {
      missing.push(`${f} (${(err as Error).message})`);
    }
  }

  const outputPath = path.join(OUTPUT_DIR, "monito-quotes.json");
  const tmp = `${outputPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(merged, null, 2));
  fs.renameSync(tmp, outputPath);

  console.log("=== Monito Shard Merge ===");
  for (const s of shards) console.log(`  ✓ ${s}`);
  for (const m of missing) console.log(`  ✗ ${m}`);
  console.log(`\nMerged ${merged.length} quotes from ${shards.length} shards → ${outputPath}`);

  // Clean up shard files so they don't get committed alongside the merged output.
  for (const f of shardFiles) {
    fs.unlinkSync(path.join(OUTPUT_DIR, f));
  }
}

main();
