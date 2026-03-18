/**
 * MoneyGram Scraper
 *
 * Strategy (in order):
 *  1. API-in-browser — load moneygram.com to get session cookies, then
 *     call consumerapi.moneygram.com/nonauth/estimator from page.evaluate().
 *  2. Calculator interception — navigate to the send-money calculator,
 *     interact with the UI, capture any consumerapi response on the wire.
 *  3. DOM fallback — parse rate / fee text from the rendered page.
 *
 * Why the old scraper returned 0 quotes:
 *  - corridor page URLs (/mgo/us/en/) were deprecated
 *  - hardcoded Basic auth key had expired
 *  - rate-widget never rendered on CI (too slow)
 */
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  MAX_RETRIES,
  SEND_AMOUNTS,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  humanClick,
  withRetry,
  writeOutput,
  parseNumber,
  extractPaymentMethod,
  extractDeliveryMethod,
  extractDeliveryTime,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext, Page } from "playwright";

// ---------------------------------------------------------------------------
// Corridor definitions
// ---------------------------------------------------------------------------
interface Corridor {
  from: string;
  to: string;
  sendCountry: string;   // ISO-3 code used by MoneyGram API
  receiveCountry: string; // ISO-3 code
  destName: string;       // Human name for calculator UI
  sendPath: string;       // e.g. "us/en"
}

const CORRIDORS: Corridor[] = [
  { from: "USD", to: "INR", sendCountry: "USA", receiveCountry: "IND", destName: "India", sendPath: "us/en" },
  { from: "USD", to: "PHP", sendCountry: "USA", receiveCountry: "PHL", destName: "Philippines", sendPath: "us/en" },
  { from: "USD", to: "MXN", sendCountry: "USA", receiveCountry: "MEX", destName: "Mexico", sendPath: "us/en" },
  { from: "USD", to: "NGN", sendCountry: "USA", receiveCountry: "NGA", destName: "Nigeria", sendPath: "us/en" },
  { from: "USD", to: "PKR", sendCountry: "USA", receiveCountry: "PAK", destName: "Pakistan", sendPath: "us/en" },
  { from: "USD", to: "BDT", sendCountry: "USA", receiveCountry: "BGD", destName: "Bangladesh", sendPath: "us/en" },
  { from: "USD", to: "GHS", sendCountry: "USA", receiveCountry: "GHA", destName: "Ghana", sendPath: "us/en" },
  { from: "USD", to: "KES", sendCountry: "USA", receiveCountry: "KEN", destName: "Kenya", sendPath: "us/en" },
  { from: "USD", to: "BRL", sendCountry: "USA", receiveCountry: "BRA", destName: "Brazil", sendPath: "us/en" },
  { from: "USD", to: "COP", sendCountry: "USA", receiveCountry: "COL", destName: "Colombia", sendPath: "us/en" },
  { from: "USD", to: "GTQ", sendCountry: "USA", receiveCountry: "GTM", destName: "Guatemala", sendPath: "us/en" },
  { from: "USD", to: "EUR", sendCountry: "USA", receiveCountry: "DEU", destName: "Germany", sendPath: "us/en" },
  { from: "USD", to: "IDR", sendCountry: "USA", receiveCountry: "IDN", destName: "Indonesia", sendPath: "us/en" },
  { from: "USD", to: "TRY", sendCountry: "USA", receiveCountry: "TUR", destName: "Turkey", sendPath: "us/en" },
  { from: "USD", to: "THB", sendCountry: "USA", receiveCountry: "THA", destName: "Thailand", sendPath: "us/en" },
  { from: "USD", to: "NPR", sendCountry: "USA", receiveCountry: "NPL", destName: "Nepal", sendPath: "us/en" },
  { from: "USD", to: "EGP", sendCountry: "USA", receiveCountry: "EGY", destName: "Egypt", sendPath: "us/en" },
  { from: "USD", to: "PEN", sendCountry: "USA", receiveCountry: "PER", destName: "Peru", sendPath: "us/en" },
  { from: "USD", to: "VND", sendCountry: "USA", receiveCountry: "VNM", destName: "Vietnam", sendPath: "us/en" },
  { from: "GBP", to: "INR", sendCountry: "GBR", receiveCountry: "IND", destName: "India", sendPath: "gb/en" },
  { from: "GBP", to: "NGN", sendCountry: "GBR", receiveCountry: "NGA", destName: "Nigeria", sendPath: "gb/en" },
  { from: "GBP", to: "PKR", sendCountry: "GBR", receiveCountry: "PAK", destName: "Pakistan", sendPath: "gb/en" },
  { from: "GBP", to: "PHP", sendCountry: "GBR", receiveCountry: "PHL", destName: "Philippines", sendPath: "gb/en" },
  { from: "GBP", to: "GHS", sendCountry: "GBR", receiveCountry: "GHA", destName: "Ghana", sendPath: "gb/en" },
  { from: "EUR", to: "INR", sendCountry: "DEU", receiveCountry: "IND", destName: "India", sendPath: "de/en" },
  { from: "EUR", to: "NGN", sendCountry: "DEU", receiveCountry: "NGA", destName: "Nigeria", sendPath: "de/en" },
  { from: "EUR", to: "PKR", sendCountry: "DEU", receiveCountry: "PAK", destName: "Pakistan", sendPath: "de/en" },
  { from: "CAD", to: "INR", sendCountry: "CAN", receiveCountry: "IND", destName: "India", sendPath: "ca/en" },
  { from: "CAD", to: "PHP", sendCountry: "CAN", receiveCountry: "PHL", destName: "Philippines", sendPath: "ca/en" },
  { from: "AUD", to: "INR", sendCountry: "AUS", receiveCountry: "IND", destName: "India", sendPath: "au/en" },
  { from: "AUD", to: "PHP", sendCountry: "AUS", receiveCountry: "PHL", destName: "Philippines", sendPath: "au/en" },
  { from: "AED", to: "INR", sendCountry: "ARE", receiveCountry: "IND", destName: "India", sendPath: "ae/en" },
  { from: "AED", to: "PKR", sendCountry: "ARE", receiveCountry: "PAK", destName: "Pakistan", sendPath: "ae/en" },
  { from: "SAR", to: "INR", sendCountry: "SAU", receiveCountry: "IND", destName: "India", sendPath: "sa/en" },
  { from: "SAR", to: "PKR", sendCountry: "SAU", receiveCountry: "PAK", destName: "Pakistan", sendPath: "sa/en" },
  { from: "SGD", to: "INR", sendCountry: "SGP", receiveCountry: "IND", destName: "India", sendPath: "sg/en" },
  { from: "SGD", to: "PHP", sendCountry: "SGP", receiveCountry: "PHL", destName: "Philippines", sendPath: "sg/en" },
];

// ---------------------------------------------------------------------------
// Parse any MoneyGram API response shape into a ProviderQuote
// ---------------------------------------------------------------------------
function parseMgResponse(
  body: string,
  from: string,
  to: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);
    const root = data?.estimateResponse ?? data?.feeEstimate ?? data?.data ?? data?.result ?? data;

    // Array of delivery options — prefer bank deposit, fall back to first
    const pick = (arr: Record<string, unknown>[]) =>
      arr.find(r =>
        String(r.deliveryOption ?? r.receiveMethod ?? r.serviceOption ?? "").toLowerCase().includes("bank") ||
        String(r.deliveryOption ?? r.receiveMethod ?? r.serviceOption ?? "").toLowerCase().includes("account") ||
        String(r.deliveryOption ?? r.receiveMethod ?? r.serviceOption ?? "").toLowerCase().includes("deposit")
      ) ?? arr[0];

    let obj: Record<string, unknown> = root;
    if (Array.isArray(root) && root.length) obj = pick(root);
    else if (Array.isArray(root?.receiveAmounts) && root.receiveAmounts.length) {
      const chosen = pick(root.receiveAmounts as Record<string, unknown>[]);
      obj = { ...chosen, exchangeRate: root.exchangeRate ?? root.rate };
    }

    const rate = parseFloat(String(obj?.exchangeRate ?? obj?.rate ?? obj?.fx_rate ?? obj?.fxRate ?? "0"));
    const fee = parseFloat(String(obj?.fee ?? obj?.transferFee ?? obj?.totalFee ?? obj?.sendFee ?? "0"));
    const sendAmt = parseFloat(String(obj?.sendAmount ?? obj?.principalAmount ?? "0")) || expectedAmount;
    const receiveAmt = parseFloat(String(obj?.receiveAmount ?? obj?.destinationAmount ?? obj?.estimatedReceiveAmount ?? "0"));
    const delivery = String(obj?.deliveryOption ?? obj?.deliveryEstimate ?? obj?.serviceOption ?? "") || null;

    if (!receiveAmt && !rate) return null;
    const effRate = rate || (receiveAmt > 0 ? receiveAmt / (sendAmt - fee || sendAmt) : 0);
    const effReceive = receiveAmt || (sendAmt - fee) * rate;
    if (effReceive <= 0) return null;

    return {
      provider: "MoneyGram",
      providerSlug: "moneygram",
      providerType: "moneyTransferProvider",
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount: sendAmt,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effRate * 10000) / 10000,
      receiveAmount: Math.round(effReceive * 100) / 100,
      paymentMethod: extractPaymentMethod(obj),
      deliveryMethod: extractDeliveryMethod(obj) ?? delivery ?? null,
      deliveryEstimate: extractDeliveryTime(obj) ?? delivery ?? null,
      dateCollected: new Date().toISOString(),
      source: "moneygram-api",
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Strategy 1 — direct consumer API call from within page context
// Loads moneygram.com first to acquire session cookies, then fetches
// consumerapi.moneygram.com from the browser's JS context (same-site trust).
// ---------------------------------------------------------------------------
async function tryApiInBrowser(
  context: BrowserContext,
  c: Corridor,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  try {
    // Acquire session cookies / headers by loading the site once
    await page.goto(`https://www.moneygram.com/${c.sendPath}/`, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(1500);

    // Try multiple API endpoint patterns (v1 / v2 / legacy feeEstimate)
    const endpoints = [
      `https://consumerapi.moneygram.com/services/capi/api/v2/nonauth/estimator?sendCountry=${c.sendCountry}&receiveCountry=${c.receiveCountry}&sendCurrency=${c.from}&receiveCurrency=${c.to}&sendAmount=${amount}&deliveryOption=BANK_DEPOSIT`,
      `https://consumerapi.moneygram.com/services/capi/api/v1/nonauth/estimator?sendCountry=${c.sendCountry}&receiveCountry=${c.receiveCountry}&sendCurrency=${c.from}&receiveCurrency=${c.to}&sendAmount=${amount}`,
      `https://consumerapi.moneygram.com/services/capi/api/v2/nonauth/feeEstimate?sendCountry=${c.sendCountry}&receiveCountry=${c.receiveCountry}&sendCurrency=${c.from}&receiveCurrency=${c.to}&sendAmount=${amount}`,
      `https://www.moneygram.com/${c.sendPath}/api/fx?sendCountry=${c.sendCountry}&receiveCountry=${c.receiveCountry}&sendCurrency=${c.from}&receiveCurrency=${c.to}&amount=${amount}`,
    ];

    for (const url of endpoints) {
      const text = await page.evaluate(async (fetchUrl: string) => {
        try {
          const res = await fetch(fetchUrl, {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            credentials: "include",
          });
          if (res.ok) return await res.text();
          return null;
        } catch { return null; }
      }, url);

      if (text) {
        const q = parseMgResponse(text, c.from, c.to, amount);
        if (q) return q;
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Strategy 2 — navigate calculator, intercept responses on the wire
// ---------------------------------------------------------------------------
async function tryCalculatorInterception(
  context: BrowserContext,
  c: Corridor,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let captured: ProviderQuote | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (captured) return;
    if (
      (url.includes("consumerapi.moneygram.com") || url.includes("moneygram.com")) &&
      response.status() === 200
    ) {
      try {
        const ct = response.headers()["content-type"] ?? "";
        if (!ct.includes("json")) return;
        const body = await response.text();
        if (!body.includes("exchangeRate") && !body.includes("receiveAmount") && !body.includes("fxRate")) return;
        const q = parseMgResponse(body, c.from, c.to, amount);
        if (q && q.receiveAmount > 0) captured = q;
      } catch { /* ignore */ }
    }
  });

  try {
    // Try the new unified calculator URL pattern
    const urls = [
      `https://www.moneygram.com/${c.sendPath}/send-money/online`,
      `https://www.moneygram.com/${c.sendPath}/`,
      `https://www.moneygram.com/${c.sendPath}/send-money`,
    ];

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
        break;
      } catch { continue; }
    }

    await delay(2500);
    await dismissOverlays(page);

    // Try to select destination country
    const countrySelectors = [
      'input[placeholder*="country" i]',
      'input[aria-label*="country" i]',
      'input[aria-label*="destination" i]',
      '[data-testid*="country"]',
      'button:has-text("Select a country")',
      'div[role="combobox"]',
    ];

    for (const sel of countrySelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          await delay(600);
          await page.keyboard.type(c.destName, { delay: 80 });
          await delay(800);
          const opt = page.locator(`[role="option"]:has-text("${c.destName}"), li:has-text("${c.destName}")`).first();
          if (await opt.isVisible({ timeout: 2000 })) {
            await opt.click();
            await delay(1500);
          }
          break;
        }
      } catch { continue; }
    }

    // Fill send amount
    await fillAmountInput(page, amount, [
      'input[data-testid*="amount"]', 'input[name*="amount"]',
      'input[aria-label*="amount" i]', 'input[aria-label*="send" i]',
      'input[inputmode="decimal"]', 'input[inputmode="numeric"]',
      'input[type="number"]', 'input[type="tel"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(4000);

    if (captured) return captured;

    // DOM fallback
    return await scrapeDom(page, c.from, c.to, amount);
  } catch {
    return null;
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// DOM fallback
// ---------------------------------------------------------------------------
async function scrapeDom(
  page: Page,
  from: string,
  to: string,
  amount: number
): Promise<ProviderQuote | null> {
  try {
    const body = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateRe = new RegExp(`(?:1\\s*)?${from}\\s*=\\s*([\\d,.]+)\\s*${to}`, "i");
    const rateMatch = body.match(rateRe) ?? body.match(/(?:Exchange\s*Rate|Rate)[:\s]*([\d,.]+)/i);
    const feeMatch = body.match(/(?:Fee|Transfer fee|Service fee)[:\s$]*([\d,.]+)/i);
    const receiveRe = new RegExp(`([\\d,]+(?:\\.\\d{1,4})?)\\s*${to}`, "g");
    let receiveAmount = 0;
    let m;
    while ((m = receiveRe.exec(body)) !== null) {
      const n = parseNumber(m[1]);
      if (n > amount * 0.01 && n > receiveAmount) receiveAmount = n;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;
    if (!rate && !receiveAmount) return null;

    const effReceive = receiveAmount || (rate > 0 ? amount * rate : 0);
    if (effReceive <= 0) return null;

    return {
      provider: "MoneyGram",
      providerSlug: "moneygram",
      providerType: "moneyTransferProvider",
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: rate ? Math.round(rate * 10000) / 10000 : Math.round((effReceive / amount) * 10000) / 10000,
      receiveAmount: Math.round(effReceive * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "moneygram-dom",
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------
async function scrapeOne(
  context: BrowserContext,
  c: Corridor,
  amount: number
): Promise<ProviderQuote | null> {
  const q = await tryApiInBrowser(context, c, amount);
  if (q) return q;
  return tryCalculatorInterception(context, c, amount);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== MoneyGram Scraper ===\n");
  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0, failCount = 0;
  const startTime = Date.now();

  // Rate cache: one corridor page load gives us the rate for all amounts
  const rateCache = new Map<string, number>();

  try {
    for (const c of CORRIDORS) {
      console.log(`\n${c.from} → ${c.to}`);

      for (const amount of SEND_AMOUNTS) {
        // Reuse cached rate when possible
        const cacheKey = `${c.sendCountry}:${c.receiveCountry}:${c.to}`;
        const cachedRate = rateCache.get(cacheKey);

        let quote: ProviderQuote | null = null;

        if (cachedRate && cachedRate > 0) {
          // Synthesise quote from cached rate (fee unknown without API call)
          quote = {
            provider: "MoneyGram",
            providerSlug: "moneygram",
            providerType: "moneyTransferProvider",
            sendCurrency: c.from,
            receiveCurrency: c.to,
            sendAmount: amount,
            fee: 0,
            exchangeRate: cachedRate,
            receiveAmount: Math.round(amount * cachedRate * 100) / 100,
            paymentMethod: null,
            deliveryEstimate: null,
            deliveryMethod: null,
            dateCollected: new Date().toISOString(),
            source: "moneygram-rate-cache",
          };
        } else {
          quote = await withRetry(() => scrapeOne(context, c, amount), MAX_RETRIES, `${c.from}→${c.to} $${amount}`);
          if (quote?.exchangeRate) rateCache.set(cacheKey, quote.exchangeRate);
        }

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(`  ✓ $${amount} → fee=${quote.fee} rate=${quote.exchangeRate} recv=${quote.receiveAmount} [${quote.source}]`);
        } else {
          failCount++;
          console.log(`  ✗ $${amount} failed`);
        }

        if (!cachedRate) await jitteredDelay(2000);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("MoneyGram", "moneygram", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("MoneyGram scraper failed:", err); process.exit(1); });
