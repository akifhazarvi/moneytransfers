/**
 * RemitRoutes Bridge Scraper
 *
 * RemitRoutes (remitroutes.com) is a React SPA whose data comes from an open,
 * unauthenticated JSON API at vector-scraper-production.up.railway.app:
 *   - GET /api/corridors                          → full corridor catalog (367)
 *   - GET /api/compare?from=USD&to=INR&amount=N   → crypto + traditional quotes
 *   - GET /api/health                             → freshness
 *
 * We consume it as a BRIDGE source for two things our own scrapers don't yet
 * cover well:
 *   1. Extra traditional providers on thin corridors (banks: SBI, ICICI, HSBC,
 *      Barclays, Lloyds, Santander, BMO, TD, …) — gap-fill only (low priority).
 *   2. The crypto / stablecoin / Bitcoin-Lightning rail (Coinbase, Binance P2P,
 *      Luno, Bitso, CoinDCX, Coins.ph, Mercado Bitcoin, OKX, BitcoinVN) with
 *      full on-ramp → chain → off-ramp path metadata.
 *
 * Their underlying sources are disclosed (Wise API, CCXT exchanges, exchange
 * REST APIs, CoinGecko). This is a bridge until we run our own CCXT feed.
 *
 * Output:
 *   src/data/scraped/remitroutes-quotes.json   (traditional, standard shape)
 *   src/data/scraped/remitroutes-crypto.json   (crypto rails, extended shape)
 *
 * Run:  npx tsx scripts/scrape-remitroutes.ts
 */
import * as fs from "fs";
import * as path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { carryForward, createDeadline } from "./lib/scrape-budget";

const execFileAsync = promisify(execFile);

const API_BASE = "https://vector-scraper-production.up.railway.app";
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const UA = "Mozilla/5.0 (compatible; SendMoneyCompare/1.0)";
const SEND_AMOUNTS = [200, 1000, 5000];
const DELAY_MS = 250;
const MAX_RETRIES = 3;
// Requests in flight at once. Serially the 825 corridor-amounts took 10m+ on CI
// once the upstream slowed to ~0.9s/request, so the step hit its timeout on
// every run from 2026-09-25 and nothing was committed.
const CONCURRENCY = 3;
// Stop starting requests here and write what we have; CI's hard timeout is above.
const deadline = createDeadline("REMITROUTES_BUDGET_SEC", 480);
// `meta.scrapedAt` is THEIR scrape time, and some corridors come back days old
// (up to 213h seen). A bridge row older than this is not a current quote.
const MAX_UPSTREAM_AGE_HOURS = 72;
// Corridor-amounts not refreshed this run keep their previous rows this long.
const CARRY_FORWARD_HOURS = 72;

// Only ingest corridors whose send currency we actually build pages for.
// (RemitRoutes tracks 14 send currencies; we mirror the ones our site uses.)
const SEND_CURRENCIES = new Set([
  "USD", "GBP", "EUR", "CAD", "AUD", "AED", "SGD", "HKD", "CHF", "SAR",
]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface RRCorridor {
  key: string; // e.g. "USD-PHP"
  fromCurrency: string;
  toCurrency: string;
}

interface RRProvider {
  slug: string;
  name: string;
  type: "traditional" | "crypto";
  recipientGets: string;
  totalFeePercent: number;
  totalFeeAmount: string;
  exchangeRate: number;
  deliveryTime: string | null;
  deliveryHours: number | null;
  deliveryMethod: string | null;
  dataSource: string | null;
  chain: unknown;
  path: unknown;
  availableChains: unknown;
  breakdown: unknown;
}

interface RRCompareResponse {
  meta: {
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    fxRate: number;
    scrapedAt: string;
  };
  providers: RRProvider[];
  error?: { message: string };
}

// --- Standard shape (matches instarem-quotes.json etc.) for traditional rows ---
interface TraditionalQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  /** Always 0: the cost is inside the all-in `exchangeRate` (see worker()). */
  fee: number;
  /** RemitRoutes' total cost vs mid-market, in percent. Informational only. */
  totalCostPct: number;
  exchangeRate: number;
  midMarketRate: number;
  markup: number;
  receiveAmount: number;
  deliveryEstimate: string | null;
  dateCollected: string;
  source: string;
}

// --- Extended shape for crypto rails (path/chain preserved) ---
interface CryptoRailQuote {
  provider: string;
  providerSlug: string;
  railType: "crypto";
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  feePercent: number;
  feeAmount: number;
  exchangeRate: number;
  midMarketRate: number;
  receiveAmount: number;
  deliveryTime: string | null;
  deliveryHours: number | null;
  /** Human on-ramp → chain → off-ramp path, e.g. Coinbase → Solana (USDC) → Coins.ph */
  onRamp: string | null;
  chainName: string | null;
  token: string | null;
  offRamp: string | null;
  networkFee: number | null;
  /** step1..step4 breakdown strings, kept verbatim for the "See how" expander */
  steps: string[];
  /** All chains RemitRoutes priced for this rail (Solana/Tron/Polygon/Lightning…) */
  chains: { name: string; token: string; networkFee: number | null; deliveryTime: string | null }[];
  dataSource: string | null;
  dateCollected: string;
  source: string;
}

// HTTP transport via curl. This CI/sandbox environment routes outbound traffic
// in a way Node's global fetch (undici) can't use, but curl reaches it fine.
// curl also gives us a clean HTTP-status separator so we can treat 404/422 as
// "no data" rather than a hard failure.
async function fetchJson<T>(url: string): Promise<T | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { stdout } = await execFileAsync(
        "curl",
        [
          "-s", "-m", "20",
          "-A", UA,
          "-H", "Origin: https://remitroutes.com",
          "-w", "\n__HTTP__%{http_code}",
          url,
        ],
        { maxBuffer: 32 * 1024 * 1024 }
      );
      const sep = stdout.lastIndexOf("\n__HTTP__");
      if (sep === -1) throw new Error("no status marker");
      const body = stdout.slice(0, sep);
      const status = parseInt(stdout.slice(sep + "\n__HTTP__".length), 10);
      if (status === 404 || status === 422) return null;
      if (status < 200 || status >= 300) throw new Error(`HTTP ${status}`);
      return JSON.parse(body) as T;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.warn(`  ✗ ${url} failed after ${MAX_RETRIES} tries: ${(err as Error).message}`);
        return null;
      }
      await sleep(DELAY_MS * attempt * 2);
    }
  }
  return null;
}

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
}

function extractChains(available: unknown): CryptoRailQuote["chains"] {
  if (!Array.isArray(available)) return [];
  return available.map((c: Record<string, unknown>) => ({
    name: (c.name as string) || "",
    token: (c.token as string) || "",
    networkFee: c.networkFee != null ? num(c.networkFee) : null,
    deliveryTime: (c.deliveryTime as string) || null,
  }));
}

function extractSteps(breakdown: unknown): string[] {
  if (!breakdown || typeof breakdown !== "object") return [];
  const b = breakdown as Record<string, unknown>;
  return ["step1", "step2", "step3", "step4"]
    .map((k) => b[k])
    .filter((s): s is string => typeof s === "string");
}

async function main() {
  console.log("RemitRoutes bridge scrape — checking API health…");
  const health = await fetchJson<{ status: string; timestamp: string }>(`${API_BASE}/api/health`);
  if (!health || health.status !== "healthy") {
    console.error("API health check failed — aborting.");
    process.exit(1);
  }
  console.log(`  ✓ healthy @ ${health.timestamp}`);

  const corridorsResp = await fetchJson<{ corridors: RRCorridor[] }>(`${API_BASE}/api/corridors`);
  const corridors = (corridorsResp?.corridors || []).filter((c) =>
    SEND_CURRENCIES.has(c.fromCurrency)
  );
  console.log(`  ✓ ${corridors.length} corridors in scope\n`);

  // The catalog lists some pairs several times (GBP-EUR three times — one per
  // destination country); /api/compare is keyed by currency only, so those
  // repeats fetched identical data and wrote 201 duplicate rows.
  const seenPairs = new Set<string>();
  const uniqueCorridors = corridors.filter((c) => {
    const k = `${c.fromCurrency}-${c.toCurrency}`;
    if (seenPairs.has(k)) return false;
    seenPairs.add(k);
    return true;
  });
  const tasks = uniqueCorridors.flatMap((c) =>
    SEND_AMOUNTS.map((amount) => ({ from: c.fromCurrency, to: c.toCurrency, amount }))
  );
  console.log(`  ✓ ${uniqueCorridors.length} unique pairs → ${tasks.length} requests · concurrency ${CONCURRENCY} · budget ${deadline.budgetSec}s\n`);

  const traditional: TraditionalQuote[] = [];
  const crypto: CryptoRailQuote[] = [];
  let ok = 0;
  let empty = 0;
  let stale = 0;
  let notAttempted = 0;
  let next = 0;
  const upstreamCutoff = Date.now() - MAX_UPSTREAM_AGE_HOURS * 3600_000;

  async function worker() {
    while (next < tasks.length) {
      const { from, to, amount } = tasks[next++];
      if (deadline.expired()) {
        notAttempted++;
        continue;
      }
      const url = `${API_BASE}/api/compare?from=${from}&to=${to}&amount=${amount}`;
      const data = await fetchJson<RRCompareResponse>(url);
      await sleep(DELAY_MS);

      if (!data || data.error || !Array.isArray(data.providers) || data.providers.length === 0) {
        empty++;
        continue;
      }
      const scrapedAt = data.meta.scrapedAt || new Date().toISOString();
      if (Date.parse(scrapedAt) < upstreamCutoff) {
        stale++;
        continue;
      }
      ok++;
      const midMarket = num(data.meta.fxRate);

      for (const p of data.providers) {
        const receiveAmount = num(p.recipientGets);
        const exchangeRate = num(p.exchangeRate);
        if (receiveAmount <= 0 && exchangeRate <= 0) continue;

        if (p.type === "crypto") {
          const pathObj = (p.path || {}) as Record<string, Record<string, unknown>>;
          crypto.push({
            provider: p.name,
            providerSlug: p.slug,
            railType: "crypto",
            sendCurrency: from,
            receiveCurrency: to,
            sendAmount: amount,
            feePercent: num(p.totalFeePercent),
            feeAmount: num(p.totalFeeAmount),
            exchangeRate,
            midMarketRate: midMarket,
            receiveAmount,
            deliveryTime: p.deliveryTime,
            deliveryHours: p.deliveryHours,
            onRamp: (pathObj.onramp?.provider as string) || null,
            chainName: (pathObj.network?.chain as string) || null,
            token: (pathObj.network?.token as string) || null,
            offRamp: (pathObj.offramp?.provider as string) || null,
            networkFee: pathObj.network?.fee != null ? num(pathObj.network.fee) : null,
            steps: extractSteps(p.breakdown),
            chains: extractChains(p.availableChains),
            dataSource: p.dataSource,
            dateCollected: scrapedAt,
            source: "remitroutes-bridge",
          });
        } else {
          // Traditional rows: `exchangeRate` is an ALL-IN effective rate
          // (recipientGets / sendAmount — true of all 4,263 rows checked
          // 2026-09-26) and `totalFeePercent` is that same cost measured against
          // mid-market (it equals the markup to the basis point). It is not a
          // separate transfer fee. We used to store it as `fee`, and the merge
          // layer then deducted it from the send amount AND priced at the
          // already-discounted rate — showing every bank and provider on this
          // feed at roughly twice its real cost. The cost lives in the rate, so
          // fee is 0; the percentage is kept as `totalCostPct` for reference.
          const totalCostPct = num(p.totalFeePercent);
          const markup = midMarket > 0 && exchangeRate > 0
            ? Math.round(((midMarket - exchangeRate) / midMarket) * 10000) / 100
            : totalCostPct;
          traditional.push({
            provider: p.name,
            providerSlug: p.slug,
            providerType: "moneyTransferProvider",
            sendCurrency: from,
            receiveCurrency: to,
            sendAmount: amount,
            fee: 0,
            totalCostPct,
            exchangeRate,
            midMarketRate: midMarket,
            markup,
            receiveAmount,
            deliveryEstimate: p.deliveryTime && p.deliveryTime !== "Unknown" ? p.deliveryTime : null,
            dateCollected: scrapedAt,
            source: "remitroutes-bridge",
          });
        }
      }
      process.stdout.write(`\r  ${ok} OK · ${empty} empty · ${stale} stale · ${traditional.length} trad · ${crypto.length} crypto · ${deadline.elapsedSec()}s`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log("\n");
  if (notAttempted > 0) {
    console.log(`⏱ Budget of ${deadline.budgetSec}s reached — ${notAttempted} corridor-amounts not attempted.`);
  }
  if (stale > 0) {
    console.log(`Skipped ${stale} corridor-amounts whose upstream data was older than ${MAX_UPSTREAM_AGE_HOURS}h.`);
  }

  const keyOf = (r: { sendCurrency: string; receiveCurrency: string; sendAmount: number }) =>
    `${r.sendCurrency}_${r.receiveCurrency}_${r.sendAmount}`;
  const tradOut = carryForward<TraditionalQuote>(path.join(OUTPUT_DIR, "remitroutes-quotes.json"), traditional, keyOf, CARRY_FORWARD_HOURS);
  const cryptoOut = carryForward<CryptoRailQuote>(path.join(OUTPUT_DIR, "remitroutes-crypto.json"), crypto, keyOf, CARRY_FORWARD_HOURS);
  // Carried rows written before 2026-09-26 still hold the old cost-as-fee.
  for (const r of tradOut.rows) r.fee = 0;
  if (tradOut.carried || cryptoOut.carried) {
    console.log(`Carried forward ${tradOut.carried} trad + ${cryptoOut.carried} crypto rows (< ${CARRY_FORWARD_HOURS}h old) not refreshed this run.`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "remitroutes-quotes.json"),
    JSON.stringify(tradOut.rows, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "remitroutes-crypto.json"),
    JSON.stringify(cryptoOut.rows, null, 2)
  );

  const cryptoProviders = [...new Set(cryptoOut.rows.map((c) => c.provider))];
  const tradProviders = [...new Set(tradOut.rows.map((t) => t.provider))];
  console.log(`✓ Wrote remitroutes-quotes.json  (${tradOut.rows.length} rows, ${tradProviders.length} providers)`);
  console.log(`✓ Wrote remitroutes-crypto.json  (${cryptoOut.rows.length} rows, ${cryptoProviders.length} rails)`);
  console.log(`  Crypto rails: ${cryptoProviders.join(", ")}`);
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
