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

const execFileAsync = promisify(execFile);

const API_BASE = "https://vector-scraper-production.up.railway.app";
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const UA = "Mozilla/5.0 (compatible; SendMoneyCompare/1.0)";
const SEND_AMOUNTS = [200, 1000, 5000];
const DELAY_MS = 250;
const MAX_RETRIES = 3;

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
  fee: number;
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

  const traditional: TraditionalQuote[] = [];
  const crypto: CryptoRailQuote[] = [];
  let ok = 0;
  let empty = 0;

  for (const corridor of corridors) {
    const { fromCurrency: from, toCurrency: to } = corridor;
    for (const amount of SEND_AMOUNTS) {
      const url = `${API_BASE}/api/compare?from=${from}&to=${to}&amount=${amount}`;
      const data = await fetchJson<RRCompareResponse>(url);
      await sleep(DELAY_MS);

      if (!data || data.error || !Array.isArray(data.providers) || data.providers.length === 0) {
        empty++;
        continue;
      }
      ok++;
      const midMarket = num(data.meta.fxRate);
      const scrapedAt = data.meta.scrapedAt || new Date().toISOString();

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
          // Traditional: convert their signed fee-% into an absolute fee in send
          // currency. Negative % means recipient beats mid-market (a rebate);
          // we keep the sign so the merge layer computes markup consistently.
          const feePercent = num(p.totalFeePercent);
          const fee = Math.round((feePercent / 100) * amount * 100) / 100;
          const markup = midMarket > 0 && exchangeRate > 0
            ? Math.round(((midMarket - exchangeRate) / midMarket) * 10000) / 100
            : feePercent;
          traditional.push({
            provider: p.name,
            providerSlug: p.slug,
            providerType: "moneyTransferProvider",
            sendCurrency: from,
            receiveCurrency: to,
            sendAmount: amount,
            fee,
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
    }
    process.stdout.write(`\r  ${ok} corridor-amounts OK · ${empty} empty · ${traditional.length} trad · ${crypto.length} crypto`);
  }

  console.log("\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "remitroutes-quotes.json"),
    JSON.stringify(traditional, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "remitroutes-crypto.json"),
    JSON.stringify(crypto, null, 2)
  );

  const cryptoProviders = [...new Set(crypto.map((c) => c.provider))];
  const tradProviders = [...new Set(traditional.map((t) => t.provider))];
  console.log(`✓ Wrote remitroutes-quotes.json  (${traditional.length} rows, ${tradProviders.length} providers)`);
  console.log(`✓ Wrote remitroutes-crypto.json  (${crypto.length} rows, ${cryptoProviders.length} rails)`);
  console.log(`  Crypto rails: ${cryptoProviders.join(", ")}`);
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
