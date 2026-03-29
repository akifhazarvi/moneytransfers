/**
 * GSC Data Fetcher — Pulls Search Console data via Google API
 *
 * Setup (one-time):
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client ID (Desktop app type)
 * 3. Download JSON → save as scripts/gsc-credentials.json
 * 4. Enable "Google Search Console API" in your project
 *
 * Usage:
 *   npx tsx scripts/gsc-fetch.ts
 *
 * First run opens browser for auth. Token is cached in scripts/.gsc-token.json
 */

import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { createServer } from "http";
import { parse } from "url";
import { join } from "path";

const SCRIPTS_DIR = join(import.meta.dirname || __dirname);
const CREDENTIALS_PATH = join(SCRIPTS_DIR, "gsc-credentials.json");
const TOKEN_PATH = join(SCRIPTS_DIR, ".gsc-token.json");
const OUTPUT_PATH = join(SCRIPTS_DIR, "..", "src", "data", "scraped", "gsc-data.json");

const SITE_URL = "sc-domain:sendmoneycompare.com";
const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

// Date range: last 14 days (GSC data has ~3 day lag)
function getDateRange() {
  const end = new Date();
  end.setDate(end.getDate() - 3); // 3-day lag
  const start = new Date(end);
  start.setDate(start.getDate() - 14);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

async function getAuthClient() {
  if (!existsSync(CREDENTIALS_PATH)) {
    console.error(
      "\n❌ Missing credentials file!\n\n" +
        "1. Go to https://console.cloud.google.com/apis/credentials\n" +
        "2. Create OAuth 2.0 Client ID (Desktop app)\n" +
        "3. Download JSON → save as:\n" +
        `   ${CREDENTIALS_PATH}\n` +
        "4. Enable 'Google Search Console API' in your GCP project\n"
    );
    process.exit(1);
  }

  const creds = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_id, client_secret } =
    creds.installed || creds.web || creds;

  const oauth2 = new google.auth.OAuth2(
    client_id,
    client_secret,
    "http://localhost:3847/oauth2callback"
  );

  // Check for cached token
  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
    oauth2.setCredentials(token);

    // Refresh if expired
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log("🔄 Refreshing expired token...");
      const { credentials } = await oauth2.refreshAccessToken();
      oauth2.setCredentials(credentials);
      writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
    }

    return oauth2;
  }

  // First-time auth flow
  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n🔐 Opening browser for Google auth...\n");
  console.log(`If it doesn't open, visit:\n${authUrl}\n`);

  // Open browser
  const { exec } = await import("child_process");
  exec(`open "${authUrl}"`);

  // Wait for callback
  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((req, res) => {
      const query = parse(req.url || "", true).query;
      if (query.code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h2>✅ Authenticated! You can close this tab.</h2><script>window.close()</script>"
        );
        server.close();
        resolve(query.code as string);
      } else if (query.error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h2>❌ Error: ${query.error}</h2>`);
        server.close();
        reject(new Error(query.error as string));
      }
    });
    server.listen(3847, () => {
      console.log("Waiting for auth callback on port 3847...");
    });
    setTimeout(() => {
      server.close();
      reject(new Error("Auth timeout after 120s"));
    }, 120_000);
  });

  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log("✅ Token saved!\n");

  return oauth2;
}

interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function queryGSC(
  searchconsole: ReturnType<typeof google.searchconsole>,
  dimensions: string[],
  rowLimit = 100,
  extraParams: Record<string, unknown> = {}
) {
  const { startDate, endDate } = getDateRange();
  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions,
      rowLimit,
      ...extraParams,
    },
  });
  return (res.data.rows || []) as GSCRow[];
}

async function main() {
  console.log("🔍 GSC Data Fetcher for sendmoneycompare.com\n");

  const auth = await getAuthClient();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const { startDate, endDate } = getDateRange();

  console.log(`📅 Date range: ${startDate} → ${endDate}\n`);

  // Run all queries in parallel
  console.log("Fetching data across 6 dimensions...\n");

  const [daily, queries, pages, countries, devices, queryPage] =
    await Promise.all([
      // 1. Daily trend
      queryGSC(searchconsole, ["date"], 500),
      // 2. Top queries (expanded)
      queryGSC(searchconsole, ["query"], 500),
      // 3. Top pages
      queryGSC(searchconsole, ["page"], 250),
      // 4. Countries
      queryGSC(searchconsole, ["country"], 50),
      // 5. Devices
      queryGSC(searchconsole, ["device"], 10),
      // 6. Query + Page combos (which queries land on which pages)
      queryGSC(searchconsole, ["query", "page"], 500),
    ]);

  // Build report
  const report = {
    fetchedAt: new Date().toISOString(),
    dateRange: { startDate, endDate },
    summary: {
      totalClicks: daily.reduce((s, r) => s + r.clicks, 0),
      totalImpressions: daily.reduce((s, r) => s + r.impressions, 0),
      avgCTR:
        daily.reduce((s, r) => s + r.ctr, 0) / Math.max(daily.length, 1),
      avgPosition:
        daily.reduce((s, r) => s + r.position, 0) /
        Math.max(daily.length, 1),
    },
    daily: daily.map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    queries: queries.map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    pages: pages.map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    countries: countries.map((r) => ({
      country: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    devices: devices.map((r) => ({
      device: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    queryPageCombos: queryPage.map((r) => ({
      query: r.keys[0],
      page: r.keys[1],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));
  console.log(`📊 Data saved to ${OUTPUT_PATH}\n`);

  // Print summary
  console.log("═══════════════════════════════════════════");
  console.log("                 SUMMARY                   ");
  console.log("═══════════════════════════════════════════");
  console.log(`Clicks:      ${report.summary.totalClicks}`);
  console.log(`Impressions: ${report.summary.totalImpressions}`);
  console.log(`Avg CTR:     ${(report.summary.avgCTR * 100).toFixed(2)}%`);
  console.log(`Avg Position: ${report.summary.avgPosition.toFixed(1)}`);
  console.log(`Queries:     ${queries.length}`);
  console.log(`Pages:       ${pages.length}`);
  console.log(`Countries:   ${countries.length}`);
  console.log("");

  // Top queries with clicks
  const clickQueries = queries.filter((r) => r.clicks > 0);
  if (clickQueries.length > 0) {
    console.log("🏆 QUERIES WITH CLICKS:");
    clickQueries
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20)
      .forEach((r) => {
        console.log(
          `  ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position.toFixed(1)} | "${r.keys[0]}"`
        );
      });
    console.log("");
  }

  // Top pages with clicks
  const clickPages = pages.filter((r) => r.clicks > 0);
  if (clickPages.length > 0) {
    console.log("📄 PAGES WITH CLICKS:");
    clickPages
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20)
      .forEach((r) => {
        const url = r.keys[0].replace("https://sendmoneycompare.com", "");
        console.log(
          `  ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position.toFixed(1)} | ${url}`
        );
      });
    console.log("");
  }

  // Striking distance queries (position 5-20, good impressions)
  const strikingDistance = queries
    .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 3)
    .sort((a, b) => a.position - b.position);

  if (strikingDistance.length > 0) {
    console.log("🎯 STRIKING DISTANCE (pos 5-20, 3+ impressions):");
    strikingDistance.slice(0, 25).forEach((r) => {
      console.log(
        `  pos ${r.position.toFixed(1)} | ${r.impressions} imp | ${r.clicks} clicks | "${r.keys[0]}"`
      );
    });
    console.log("");
  }

  // Opportunity queries (position 10-30, high impressions but 0 clicks)
  const opportunities = queries
    .filter(
      (r) =>
        r.position >= 10 && r.position <= 30 && r.impressions >= 5 && r.clicks === 0
    )
    .sort((a, b) => b.impressions - a.impressions);

  if (opportunities.length > 0) {
    console.log("💡 OPPORTUNITIES (pos 10-30, 5+ imp, 0 clicks):");
    opportunities.slice(0, 20).forEach((r) => {
      console.log(
        `  pos ${r.position.toFixed(1)} | ${r.impressions} imp | "${r.keys[0]}"`
      );
    });
    console.log("");
  }

  // Daily trend
  console.log("📈 DAILY TREND:");
  daily
    .sort((a, b) => a.keys[0].localeCompare(b.keys[0]))
    .forEach((r) => {
      const bar = "█".repeat(Math.ceil(r.impressions / 50));
      console.log(
        `  ${r.keys[0]} | ${String(r.clicks).padStart(2)} clicks | ${String(r.impressions).padStart(5)} imp | pos ${r.position.toFixed(1)} | ${bar}`
      );
    });
  console.log("");

  // Top countries
  console.log("🌍 TOP COUNTRIES:");
  countries
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15)
    .forEach((r) => {
      console.log(
        `  ${r.keys[0]} | ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position.toFixed(1)}`
      );
    });
  console.log("");

  // Devices
  console.log("📱 DEVICES:");
  devices.forEach((r) => {
    console.log(
      `  ${r.keys[0].padEnd(10)} | ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position.toFixed(1)}`
    );
  });
  console.log("");

  console.log("✅ Full data saved to src/data/scraped/gsc-data.json");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
