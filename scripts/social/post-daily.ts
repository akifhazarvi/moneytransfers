import { generateDigest } from "./generate-digest";
import { postToX } from "./post-to-x";
import { postToLinkedIn } from "./post-to-linkedin";

const DRY_RUN = process.env.DRY_RUN === "1" || process.argv.includes("--dry-run");

async function main() {
  const digest = generateDigest();
  if (!digest) {
    console.error("❌ Not enough quotes for today's corridor. Skipping.");
    process.exit(0);
  }

  console.log(`📊 Corridor: ${digest.corridor.from} → ${digest.corridor.to}`);
  console.log(`🕒 Latest data: ${digest.latestCollected?.toISOString() ?? "unknown"}`);

  if (digest.isStale) {
    console.error(`❌ Data is stale (> 24h old). Skipping post.`);
    process.exit(0);
  }

  console.log("\n--- X POST ---\n" + digest.x);
  console.log("\n--- LINKEDIN POST ---\n" + digest.linkedin);

  if (DRY_RUN) {
    console.log("\n🧪 DRY RUN — no posts sent.");
    return;
  }

  const results: { platform: string; ok: boolean; detail: string }[] = [];

  try {
    const x = await postToX(digest.x);
    results.push({ platform: "X", ok: true, detail: x.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ platform: "X", ok: false, detail: msg });
  }

  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    try {
      const li = await postToLinkedIn(digest.linkedin);
      results.push({ platform: "LinkedIn", ok: true, detail: li.url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ platform: "LinkedIn", ok: false, detail: msg });
    }
  } else {
    results.push({ platform: "LinkedIn", ok: false, detail: "No LINKEDIN_ACCESS_TOKEN — skipped" });
  }

  console.log("\n--- RESULTS ---");
  for (const r of results) {
    console.log(`${r.ok ? "✅" : "❌"} ${r.platform}: ${r.detail}`);
  }

  const anyFailed = results.some((r) => !r.ok && !r.detail.includes("skipped"));
  if (anyFailed) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
