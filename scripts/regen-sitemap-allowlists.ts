/**
 * Regenerate src/lib/sitemap-allowlists.ts from a fresh 90-day GSC pull.
 *
 * The sitemap allowlist is intentionally pinned to a snapshot — it should not
 * recompute on every build, because GSC data drifts day-to-day and we don't
 * want sitemap churn for accidental impression bursts. Instead, run this
 * script periodically (~monthly) when you want to recalibrate which URLs
 * have proven their slot.
 *
 * Usage:
 *   npx tsx scripts/regen-sitemap-allowlists.ts
 *
 * Reads the Composio GSC MCP endpoint (no credentials file needed — the API
 * key is set via COMPOSIO_API_KEY env var, falling back to a hardcoded
 * default for local convenience).
 *
 * Writes src/lib/sitemap-allowlists.ts. Diff it before committing — the
 * intent is for the reviewer to *see* which URLs are being added or dropped
 * from the sitemap, not have it change silently in a deploy.
 *
 * Threshold: ≥10 impressions in the 90-day window ending 3 days before
 * "today" (GSC has a ~3-day data-finalization lag).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { allCorridors } from "../src/data/corridors";
import { blogPosts } from "../src/data/blog-posts";
import { newsItems } from "../src/data/news";
import { providerReviews } from "../src/data/provider-reviews";
import { businessPages } from "../src/data/business-pages";

const COMPOSIO_URL =
  "https://backend.composio.dev/v3/mcp/32cbc144-6996-4203-990a-f89a56725fd4/mcp?user_id=pg-test-f38494df-a052-4e5f-9198-10c1545451de";
const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY || "ak_1BMlHH3JeBYMcUsORRTJ";
const GSC_SITE = "sc-domain:sendmoneycompare.com";
const IMPRESSION_THRESHOLD = 10;

const SITE_HOST = "https://sendmoneycompare.com";
const OUTPUT_PATH = join(import.meta.dirname || __dirname, "..", "src", "lib", "sitemap-allowlists.ts");

interface GSCRow {
  keys: string[];
  clicks: number;
  ctr: number;
  impressions: number;
  position: number;
}

/** Calls the Composio MCP and returns the GSC rows. SSE-format response. */
async function fetchGSCPages(startDate: string, endDate: string): Promise<GSCRow[]> {
  const res = await fetch(COMPOSIO_URL, {
    method: "POST",
    headers: {
      "x-api-key": COMPOSIO_API_KEY,
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY",
        arguments: {
          site_url: GSC_SITE,
          start_date: startDate,
          end_date: endDate,
          dimensions: ["page"],
          row_limit: 1000,
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Composio HTTP ${res.status}: ${await res.text()}`);
  const body = await res.text();
  // SSE: pick the last "data: {...}" line
  const match = body.match(/data: ({[\s\S]*})/);
  if (!match) throw new Error(`Could not parse SSE body: ${body.slice(0, 400)}`);
  const envelope = JSON.parse(match[1]);
  const inner = JSON.parse(envelope.result.content[0].text);
  const data = inner.data ?? inner;
  return (data.rows as GSCRow[]) ?? [];
}

function ninetyDayWindow(): { startDate: string; endDate: string } {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3); // GSC has ~3 day finalization lag
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 90);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

interface AllowlistBuckets {
  corridor: Set<string>;
  guide: Set<string>;
  iban: Set<string>;
  comparison: Set<string>;
  provider: Set<string>;
  news: Set<string>;
  ratePair: Set<string>;
  rateHistory: Set<string>;
  swift: Set<string>;
  business: Set<string>;
}

/**
 * Drop slugs that GSC has impressions on but that don't correspond to a real
 * data entry (e.g. /send-money/send-money-to-morocco was a legacy duplicate of
 * /send-money/morocco — both pages render, but the duplicate isn't in
 * corridors.ts and shouldn't be in the sitemap).
 *
 * For sets where there's no canonical data file (rate-pair, iban country slugs
 * via wise-iban, swift via swift-codes data), this is a no-op pass-through.
 */
function dropUnknownSlugs(b: AllowlistBuckets): AllowlistBuckets {
  const validCorridors = new Set(allCorridors.map((c) => c.slug));
  const validGuides = new Set(blogPosts.map((p) => p.slug));
  const validNews = new Set(newsItems.map((n) => n.slug));
  const validProviders = new Set(providerReviews.map((r) => r.slug));
  const validBusiness = new Set(businessPages.map((p) => p.slug));

  const filter = (set: Set<string>, valid: Set<string>, label: string): Set<string> => {
    const dropped: string[] = [];
    const kept = new Set<string>();
    for (const s of set) {
      if (valid.has(s)) kept.add(s);
      else dropped.push(s);
    }
    if (dropped.length > 0) {
      console.log(`  ${label}: dropping ${dropped.length} unknown slug(s): ${dropped.join(", ")}`);
    }
    return kept;
  };

  return {
    ...b,
    corridor: filter(b.corridor, validCorridors, "corridor"),
    guide: filter(b.guide, validGuides, "guide"),
    news: filter(b.news, validNews, "news"),
    provider: filter(b.provider, validProviders, "provider"),
    business: filter(b.business, validBusiness, "business"),
    // iban / swift / ratePair / rateHistory: no canonical data file; trust GSC
  };
}

function bucketize(rows: GSCRow[]): AllowlistBuckets {
  const b: AllowlistBuckets = {
    corridor: new Set(),
    guide: new Set(),
    iban: new Set(),
    comparison: new Set(),
    provider: new Set(),
    news: new Set(),
    ratePair: new Set(),
    rateHistory: new Set(),
    swift: new Set(),
    business: new Set(),
  };
  for (const row of rows) {
    if (row.impressions < IMPRESSION_THRESHOLD) continue;
    const path = row.keys[0].replace(SITE_HOST, "");
    // Skip retired locale prefixes — they're 301'd to English
    if (/^\/(es|fr|pt)(\/|$)/.test(path)) continue;
    const parts = path.split("/").filter(Boolean);
    if (parts.length < 2) continue;

    const [top, p1, p2] = parts;
    if (top === "send-money") b.corridor.add(p1);
    else if (top === "guides") b.guide.add(p1);
    else if (top === "iban") b.iban.add(p1);
    else if (top === "compare") b.comparison.add(p1);
    else if (top === "companies") b.provider.add(p1);
    else if (top === "news") b.news.add(p1);
    else if (top === "swift-codes") b.swift.add(p1);
    else if (top === "business") b.business.add(p1);
    else if (top === "exchange-rates" && p1 === "history" && p2) b.rateHistory.add(p2);
    else if (top === "exchange-rates" && p1 && p1 !== "history") b.ratePair.add(p1);
  }
  return b;
}

function renderSet(varName: string, slugs: Set<string>): string {
  const sorted = [...slugs].sort();
  const lines = sorted.map((s) => `  "${s}",`).join("\n");
  return `export const SITEMAP_${varName} = new Set<string>([\n${lines}\n]); // ${sorted.length} URLs`;
}

function renderModule(buckets: AllowlistBuckets, window: { startDate: string; endDate: string }): string {
  const header = `/**
 * GSC-validated slugs that earned ≥${IMPRESSION_THRESHOLD} impressions in the 90-day window
 * ${window.startDate} – ${window.endDate}. These are the URLs the sitemap submits.
 *
 * Regenerate via: npx tsx scripts/regen-sitemap-allowlists.ts
 *
 * The script overwrites this file; diff it before committing so reviewers can
 * see which URLs are joining or leaving the sitemap instead of the change
 * being silent.
 */`;

  const sections = [
    renderSet("CORRIDOR_SLUGS", buckets.corridor),
    renderSet("GUIDE_SLUGS", buckets.guide),
    renderSet("IBAN_SLUGS", buckets.iban),
    renderSet("COMPARISON_SLUGS", buckets.comparison),
    renderSet("PROVIDER_SLUGS", buckets.provider),
    renderSet("NEWS_SLUGS", buckets.news),
    renderSet("RATE_PAIR_SLUGS", buckets.ratePair),
    renderSet("RATE_HISTORY_SLUGS", buckets.rateHistory),
    renderSet("SWIFT_SLUGS", buckets.swift),
    renderSet("BUSINESS_SLUGS", buckets.business),
  ];

  return `${header}\n\n${sections.join("\n\n")}\n`;
}

async function main() {
  const window = ninetyDayWindow();
  console.log(`Fetching GSC pages for ${window.startDate} → ${window.endDate}…`);
  const rows = await fetchGSCPages(window.startDate, window.endDate);
  console.log(`  ${rows.length} pages returned (any impressions)`);

  const raw = bucketize(rows);
  const rawTotal = Object.values(raw).reduce((acc, s) => acc + s.size, 0);
  console.log(`  ${rawTotal} pages survived ≥${IMPRESSION_THRESHOLD} impressions cutoff`);

  console.log(`\nDropping slugs not found in src/data/* (legacy/dup URLs):`);
  const buckets = dropUnknownSlugs(raw);
  const total = Object.values(buckets).reduce((acc, s) => acc + s.size, 0);
  console.log(`\n${total} final pages:`);
  for (const [name, set] of Object.entries(buckets)) {
    console.log(`    ${name.padEnd(14)} ${set.size}`);
  }

  const out = renderModule(buckets, window);
  writeFileSync(OUTPUT_PATH, out, "utf8");
  console.log(`\nWrote ${OUTPUT_PATH}`);
  console.log("Diff the file and commit when the changes look right.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
