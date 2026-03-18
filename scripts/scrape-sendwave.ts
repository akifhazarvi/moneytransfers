/**
 * SendWave Scraper
 *
 * SendWave (now part of WorldRemit Group) specialises in mobile money
 * transfers to Africa, South Asia, and Southeast Asia. Zero-fee model.
 *
 * Strategy:
 *  1. Public API — sendwave.com/api/... rate endpoints
 *  2. Browser interception — load calculator, capture API response
 *  3. DOM fallback
 */
import {
  NAV_TIMEOUT,
  SEND_AMOUNTS,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  withRetry,
  writeOutput,
  parseNumber,
  extractReceiveAmount,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext } from "playwright";

// SendWave corridors — Africa, South Asia, Southeast Asia focus
const CORRIDORS = [
  // USD sends
  { from: "USD", to: "GHS", destCountry: "GH", destName: "Ghana" },
  { from: "USD", to: "KES", destCountry: "KE", destName: "Kenya" },
  { from: "USD", to: "UGX", destCountry: "UG", destName: "Uganda" },
  { from: "USD", to: "TZS", destCountry: "TZ", destName: "Tanzania" },
  { from: "USD", to: "ETB", destCountry: "ET", destName: "Ethiopia" },
  { from: "USD", to: "RWF", destCountry: "RW", destName: "Rwanda" },
  { from: "USD", to: "NGN", destCountry: "NG", destName: "Nigeria" },
  { from: "USD", to: "SEN", destCountry: "SN", destName: "Senegal" },
  { from: "USD", to: "PKR", destCountry: "PK", destName: "Pakistan" },
  { from: "USD", to: "INR", destCountry: "IN", destName: "India" },
  { from: "USD", to: "PHP", destCountry: "PH", destName: "Philippines" },
  { from: "USD", to: "BDT", destCountry: "BD", destName: "Bangladesh" },
  // GBP sends
  { from: "GBP", to: "GHS", destCountry: "GH", destName: "Ghana" },
  { from: "GBP", to: "KES", destCountry: "KE", destName: "Kenya" },
  { from: "GBP", to: "NGN", destCountry: "NG", destName: "Nigeria" },
  { from: "GBP", to: "PKR", destCountry: "PK", destName: "Pakistan" },
  { from: "GBP", to: "INR", destCountry: "IN", destName: "India" },
  { from: "GBP", to: "PHP", destCountry: "PH", destName: "Philippines" },
  { from: "GBP", to: "BDT", destCountry: "BD", destName: "Bangladesh" },
  // EUR sends
  { from: "EUR", to: "GHS", destCountry: "GH", destName: "Ghana" },
  { from: "EUR", to: "NGN", destCountry: "NG", destName: "Nigeria" },
  { from: "EUR", to: "KES", destCountry: "KE", destName: "Kenya" },
  { from: "EUR", to: "INR", destCountry: "IN", destName: "India" },
  // CAD sends
  { from: "CAD", to: "GHS", destCountry: "GH", destName: "Ghana" },
  { from: "CAD", to: "NGN", destCountry: "NG", destName: "Nigeria" },
  { from: "CAD", to: "INR", destCountry: "IN", destName: "India" },
  // AUD sends
  { from: "AUD", to: "PHP", destCountry: "PH", destName: "Philippines" },
  { from: "AUD", to: "INR", destCountry: "IN", destName: "India" },
];

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US", GBP: "GB", EUR: "DE", CAD: "CA", AUD: "AU",
};

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, source: string,
  apiRecv = 0
): ProviderQuote {
  // SendWave is typically zero-fee
  return {
    provider: "SendWave",
    providerSlug: "sendwave",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: apiRecv > 0 ? Math.round(apiRecv * 100) / 100 : Math.round((amount - fee) * rate * 100) / 100,
    paymentMethod: null,
    deliveryEstimate: "Minutes",
    deliveryMethod: "Mobile Money",
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — public API
// ---------------------------------------------------------------------------
async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const sendCountry = CURRENCY_TO_COUNTRY[from] ?? "US";
  const endpoints = [
    `https://www.sendwave.com/api/v1/rates?sendCurrency=${from}&receiveCurrency=${to}&sendAmount=${amount}&sendCountry=${sendCountry}`,
    `https://api.sendwave.com/rates?from=${from}&to=${to}&amount=${amount}`,
    `https://www.sendwave.com/api/rates?sendingCurrency=${from}&receivingCurrency=${to}&amount=${amount}`,
    `https://www.sendwave.com/api/v2/quote?sendCurrency=${from}&receiveCurrency=${to}&sendAmount=${amount}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://www.sendwave.com/",
        },
      });
      if (!res.ok) continue;
      const data: Record<string, unknown> = await res.json();
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.fxRate ?? data.conversionRate ?? "0"));
      const fee = parseFloat(String(data.fee ?? data.transferFee ?? "0"));
      if (rate <= 0) continue;
      return buildQuote(from, to, amount, rate, fee, "sendwave-api", extractReceiveAmount(data));
    } catch { continue; }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Strategy 2 — browser interception
// ---------------------------------------------------------------------------
async function tryBrowser(
  context: BrowserContext,
  from: string, to: string,
  destCountry: string, destName: string,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let captured: ProviderQuote | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (captured) return;
    if (!url.includes("sendwave.com") && !url.includes("wave.com")) return;
    if (response.status() !== 200) return;
    if (!url.includes("rate") && !url.includes("quote") && !url.includes("fee") && !url.includes("calc") && !url.includes("price")) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      const data: Record<string, unknown> = JSON.parse(body);
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.fxRate ?? data.conversionRate ?? "0"));
      const fee = parseFloat(String(data.fee ?? data.transferFee ?? "0"));
      if (rate <= 0) return;
      captured = buildQuote(from, to, amount, rate, fee, "sendwave-browser");
    } catch { /* ignore */ }
  });

  try {
    const sendCountry = CURRENCY_TO_COUNTRY[from] ?? "us";
    const url = `https://www.sendwave.com/${sendCountry.toLowerCase()}/send-to-${destName.toLowerCase().replace(/\s/g, "-")}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    } catch {
      await page.goto("https://www.sendwave.com/", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    }

    await delay(2500);
    await dismissOverlays(page);

    await fillAmountInput(page, amount, [
      'input[name*="amount"]', 'input[id*="amount"]',
      'input[aria-label*="amount" i]', 'input[aria-label*="send" i]',
      'input[data-testid*="amount"]', 'input[inputmode="decimal"]',
      'input[type="number"]', 'input[type="tel"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(3500);

    if (captured) return captured;

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const receiveRe = new RegExp(`([\\d,]+(?:\\.\\d{1,4})?)\\s*${to}`, "g");
    let receiveAmount = 0, m;
    while ((m = receiveRe.exec(bodyText)) !== null) {
      const n = parseNumber(m[1]);
      if (n > amount * 0.1 && n > receiveAmount) receiveAmount = n;
    }
    if (receiveAmount > 0) {
      return buildQuote(from, to, amount, Math.round((receiveAmount / amount) * 10000) / 10000, 0, "sendwave-dom");
    }
    return null;
  } catch {
    return null;
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== SendWave Scraper ===\n");
  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0, failCount = 0;
  const startTime = Date.now();

  try {
    for (const c of CORRIDORS) {
      console.log(`\n${c.from} → ${c.to}`);
      for (const amount of SEND_AMOUNTS) {
        const quote = await withRetry(async () => {
          const api = await tryPublicApi(c.from, c.to, amount);
          if (api) return api;
          return tryBrowser(context, c.from, c.to, c.destCountry, c.destName, amount);
        }, 2, `${c.from}→${c.to} $${amount}`);

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(`  ✓ $${amount} rate=${quote.exchangeRate} recv=${quote.receiveAmount} [${quote.source}]`);
        } else {
          failCount++;
          console.log(`  ✗ $${amount} failed`);
        }
        await jitteredDelay(800);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("SendWave", "sendwave", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("SendWave scraper failed:", err); process.exit(1); });
