/**
 * Data Validation: Our Direct Scrapers vs Monito
 *
 * For each provider+corridor+amount where we have both a direct scrape AND
 * a Monito quote, compare fee and receiveAmount. Flag large discrepancies.
 *
 * Usage: npx tsx scripts/validate-vs-monito.ts
 * Usage: npx tsx scripts/validate-vs-monito.ts --provider wise
 * Usage: npx tsx scripts/validate-vs-monito.ts --threshold 5
 */

import * as fs from "fs";
import * as path from "path";

const SCRAPED_DIR = path.join(process.cwd(), "src/data/scraped");

// Threshold % difference in receiveAmount to flag as an issue
const thresholdIdx = process.argv.indexOf("--threshold");
const THRESHOLD_PCT = parseFloat(thresholdIdx !== -1 ? process.argv[thresholdIdx + 1] : "3");
const providerIdx = process.argv.indexOf("--provider");
const FILTER_PROVIDER = providerIdx !== -1 ? process.argv[providerIdx + 1] : null;

// Our direct scraper files (first-party only, no aggregators)
const DIRECT_FILES: Record<string, string> = {
  wise: "wise-direct-quotes.json",
  remitly: "remitly-quotes.json",
  worldremit: "worldremit-quotes.json",
  "western-union": "western-union-quotes.json",
  revolut: "revolut-quotes.json",
  ofx: "ofx-quotes.json",
  instarem: "instarem-quotes.json",
  xoom: "xoom-quotes.json",
  ria: "ria-quotes.json",
  moneygram: "moneygram-quotes.json",
  skrill: "skrill-quotes.json",
  paysend: "paysend-quotes.json",
  sendwave: "sendwave-quotes.json",
  taptapsend: "taptapsend-quotes.json",
  profee: "profee-quotes.json",
  currencyfair: "currencyfair-quotes.json",
  xe: "xe-transfer-quotes.json",
};

// Monito uses different slugs for some providers
const MONITO_TO_OUR_SLUG: Record<string, string> = {
  "revolut-money-transfer": "revolut",
  "xe-money-transfer": "xe",
  "xe-money-transfer-fx": "xe",
};

interface Quote {
  providerSlug: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  source?: string;
  deliveryEstimate?: string | null;
}

interface Discrepancy {
  provider: string;
  corridor: string;
  amount: number;
  ourFee: number;
  monitoFee: number;
  feeDiff: number;
  ourReceive: number;
  monitoReceive: number;
  receiveDiffPct: number;
  ourSource: string;
  monitoDelivery: string | null;
}

function loadQuotes(file: string): Quote[] {
  const fp = path.join(SCRAPED_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function pct(a: number, b: number): number {
  if (!b) return 0;
  return Math.round(((a - b) / b) * 1000) / 10;
}

function colorPct(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 10) return `\x1b[31m${val > 0 ? "+" : ""}${val}%\x1b[0m`; // red
  if (abs >= 5)  return `\x1b[33m${val > 0 ? "+" : ""}${val}%\x1b[0m`; // yellow
  return `\x1b[32m${val > 0 ? "+" : ""}${val}%\x1b[0m`; // green
}

function main() {
  // Load Monito quotes
  const monitoAll = loadQuotes("monito-quotes.json");
  if (!monitoAll.length) {
    console.error("No monito-quotes.json found.");
    process.exit(1);
  }

  // Build Monito index: ourSlug_from_to_amount -> quote
  const monitoIndex = new Map<string, Quote>();
  for (const q of monitoAll) {
    const ourSlug = MONITO_TO_OUR_SLUG[q.providerSlug] ?? q.providerSlug;
    const key = `${ourSlug}_${q.sendCurrency}_${q.receiveCurrency}_${q.sendAmount}`;
    // Keep the one with higher receiveAmount (best quote)
    const existing = monitoIndex.get(key);
    if (!existing || q.receiveAmount > existing.receiveAmount) {
      monitoIndex.set(key, { ...q, providerSlug: ourSlug });
    }
  }

  const allDiscrepancies: Discrepancy[] = [];
  const providerSummary: Record<string, { matches: number; issues: number; avgDiff: number }> = {};

  const providers = FILTER_PROVIDER
    ? { [FILTER_PROVIDER]: DIRECT_FILES[FILTER_PROVIDER] }
    : DIRECT_FILES;

  for (const [slug, file] of Object.entries(providers)) {
    const directQuotes = loadQuotes(file);
    if (!directQuotes.length) continue;

    let matches = 0;
    let issues = 0;
    let totalDiff = 0;
    const discrepancies: Discrepancy[] = [];

    for (const dq of directQuotes) {
      const key = `${slug}_${dq.sendCurrency}_${dq.receiveCurrency}_${dq.sendAmount}`;
      const mq = monitoIndex.get(key);
      if (!mq) continue;

      matches++;
      const receiveDiffPct = pct(dq.receiveAmount, mq.receiveAmount);
      const feeDiff = Math.round((dq.fee - mq.fee) * 100) / 100;
      totalDiff += Math.abs(receiveDiffPct);

      if (Math.abs(receiveDiffPct) >= THRESHOLD_PCT) {
        issues++;
        discrepancies.push({
          provider: slug,
          corridor: `${dq.sendCurrency}→${dq.receiveCurrency}`,
          amount: dq.sendAmount,
          ourFee: dq.fee,
          monitoFee: mq.fee,
          feeDiff,
          ourReceive: dq.receiveAmount,
          monitoReceive: mq.receiveAmount,
          receiveDiffPct,
          ourSource: dq.source || file,
          monitoDelivery: mq.deliveryEstimate ?? null,
        });
      }
    }

    if (matches > 0) {
      providerSummary[slug] = {
        matches,
        issues,
        avgDiff: Math.round((totalDiff / matches) * 10) / 10,
      };
      allDiscrepancies.push(...discrepancies);
    }
  }

  // --- Print Report ---
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║         Data Validation: Our Scrapers vs Monito              ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  console.log(`Threshold: >${THRESHOLD_PCT}% difference in receiveAmount\n`);

  // Provider summary table
  console.log("┌─────────────────────┬─────────┬────────┬──────────┐");
  console.log("│ Provider            │ Matches │ Issues │ Avg Diff │");
  console.log("├─────────────────────┼─────────┼────────┼──────────┤");

  for (const [slug, s] of Object.entries(providerSummary).sort((a, b) => b[1].issues - a[1].issues)) {
    const issueStr = s.issues > 0 ? `\x1b[31m${s.issues}\x1b[0m` : `\x1b[32m0\x1b[0m`;
    const avgStr = s.avgDiff >= 5 ? `\x1b[33m${s.avgDiff}%\x1b[0m` : `${s.avgDiff}%`;
    console.log(
      `│ ${slug.padEnd(19)} │ ${String(s.matches).padStart(7)} │ ${issueStr.padStart(14)} │ ${avgStr.padStart(17)} │`
    );
  }
  console.log("└─────────────────────┴─────────┴────────┴──────────┘\n");

  if (!allDiscrepancies.length) {
    console.log("\x1b[32m✓ No discrepancies above threshold!\x1b[0m\n");
    return;
  }

  // Group by provider
  const byProvider = new Map<string, Discrepancy[]>();
  for (const d of allDiscrepancies.sort((a, b) => Math.abs(b.receiveDiffPct) - Math.abs(a.receiveDiffPct))) {
    if (!byProvider.has(d.provider)) byProvider.set(d.provider, []);
    byProvider.get(d.provider)!.push(d);
  }

  console.log(`\n⚠  ${allDiscrepancies.length} discrepancies found:\n`);

  for (const [provider, items] of byProvider) {
    console.log(`\x1b[1m${provider.toUpperCase()}\x1b[0m (${items.length} issues)`);
    console.log("  " + "─".repeat(80));
    console.log(
      "  " +
        "Corridor".padEnd(12) +
        "Amount".padStart(8) +
        "  Our Fee".padStart(10) +
        "  Mon Fee".padStart(10) +
        "  Our Recv".padStart(14) +
        "  Mon Recv".padStart(14) +
        "  Diff".padStart(8)
    );
    console.log("  " + "─".repeat(80));

    for (const d of items) {
      console.log(
        "  " +
          d.corridor.padEnd(12) +
          `$${d.amount}`.padStart(8) +
          `$${d.ourFee}`.padStart(10) +
          `$${d.monitoFee}`.padStart(10) +
          String(d.ourReceive.toLocaleString()).padStart(14) +
          String(d.monitoReceive.toLocaleString()).padStart(14) +
          "  " +
          colorPct(d.receiveDiffPct)
      );
    }
    console.log();
  }

  // Summary
  const totalMatches = Object.values(providerSummary).reduce((s, p) => s + p.matches, 0);
  const totalIssues = allDiscrepancies.length;
  console.log("─".repeat(60));
  console.log(`Total matches: ${totalMatches} | Issues: ${totalIssues} | Issue rate: ${Math.round(totalIssues / totalMatches * 100)}%`);
  console.log();
}

main();
