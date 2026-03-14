import * as fs from "fs";
import * as path from "path";
import { chromium, type Page, type BrowserContext } from "playwright";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 3000;
const NAV_TIMEOUT = 30000;
const MAX_RETRIES = 3;

// Remitly URL: /us/en/india, /gb/en/india, etc.
const CORRIDORS = [
  { from: "USD", to: "INR", urlPath: "us/en/india" },
  { from: "USD", to: "PHP", urlPath: "us/en/philippines" },
  { from: "USD", to: "MXN", urlPath: "us/en/mexico" },
  { from: "USD", to: "NGN", urlPath: "us/en/nigeria" },
  { from: "USD", to: "PKR", urlPath: "us/en/pakistan" },
  { from: "USD", to: "BDT", urlPath: "us/en/bangladesh" },
  { from: "USD", to: "GHS", urlPath: "us/en/ghana" },
  { from: "USD", to: "KES", urlPath: "us/en/kenya" },
  { from: "USD", to: "BRL", urlPath: "us/en/brazil" },
  { from: "USD", to: "GTQ", urlPath: "us/en/guatemala" },
  { from: "USD", to: "COP", urlPath: "us/en/colombia" },
  { from: "GBP", to: "INR", urlPath: "gb/en/india" },
  { from: "GBP", to: "NGN", urlPath: "gb/en/nigeria" },
  { from: "GBP", to: "PKR", urlPath: "gb/en/pakistan" },
  { from: "GBP", to: "GHS", urlPath: "gb/en/ghana" },
  { from: "GBP", to: "PHP", urlPath: "gb/en/philippines" },
  { from: "EUR", to: "INR", urlPath: "de/en/india" },
  { from: "EUR", to: "NGN", urlPath: "de/en/nigeria" },
  { from: "EUR", to: "PHP", urlPath: "de/en/philippines" },
  { from: "CAD", to: "INR", urlPath: "ca/en/india" },
  { from: "CAD", to: "PHP", urlPath: "ca/en/philippines" },
  { from: "AUD", to: "INR", urlPath: "au/en/india" },
  { from: "AUD", to: "PHP", urlPath: "au/en/philippines" },
];

const SEND_AMOUNTS = [100, 500, 1000, 5000];

interface RemitlyQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  deliveryEstimate: string | null;
  deliveryMethod: string | null;
  dateCollected: string;
  source: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitteredDelay(baseMs: number): Promise<void> {
  const jitter = Math.floor(Math.random() * baseMs * 0.5);
  return delay(baseMs + jitter);
}

async function dismissOverlays(page: Page): Promise<void> {
  const dismissSelectors = [
    "#onetrust-accept-btn-handler",
    '[data-testid="cookie-accept"]',
    'button:has-text("Accept All Cookies")',
    'button:has-text("Accept all")',
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    'button:has-text("OK")',
  ];

  for (const selector of dismissSelectors) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1000 });
        await delay(300);
      }
    } catch {
      // Not found
    }
  }
}

async function setupBrowserContext(): Promise<BrowserContext> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "America/New_York",
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    // @ts-expect-error -- overriding chrome detection
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
  });

  return context;
}

// Parse Remitly's /v3/calculator/estimate response
// Shape: { estimate: { exchange_rate: { base_rate, promotional_exchange_rate },
//          fee: { total_fee_amount }, receive_amount, send_amount, ... } }
function parseApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): RemitlyQuote | null {
  try {
    const json = JSON.parse(body);
    const est = json?.estimate;
    if (!est) return null;

    const sendAmount = parseFloat(est.send_amount) || expectedAmount;
    const receiveAmount = parseFloat(est.receive_amount);
    const fee = parseFloat(est.fee?.total_fee_amount) || 0;
    const baseRate = parseFloat(est.exchange_rate?.base_rate) || 0;
    const promoRate =
      parseFloat(est.exchange_rate?.promotional_exchange_rate) || 0;
    const payInMethod = est.pay_in_method || null;
    const payOutMethod = est.pay_out_method || null;

    // Use promo rate if available, otherwise base rate, otherwise calculate
    const exchangeRate =
      promoRate || baseRate || (receiveAmount ? receiveAmount / sendAmount : 0);

    if (!receiveAmount || receiveAmount <= 0) return null;

    // Extract discount info
    const discount = parseFloat(est.discount?.fee_discount_amount || "0");

    return {
      provider: "Remitly",
      providerSlug: "remitly",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round((fee - discount) * 100) / 100,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: payOutMethod || payInMethod,
      dateCollected: new Date().toISOString(),
      source: "remitly-browser-api",
    };
  } catch {
    return null;
  }
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<RemitlyQuote | null> {
  const page = await context.newPage();
  let capturedQuote: RemitlyQuote | null = null;

  try {
    // Intercept Remitly's calculator API
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("api.remitly.io") && url.includes("calculator")) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;

          const body = await response.text();
          const parsed = parseApiResponse(
            body,
            corridor.from,
            corridor.to,
            amount
          );
          if (parsed && parsed.receiveAmount > 0) {
            // Only accept if the send amount roughly matches what we requested
            // (Remitly may return the page's default amount first)
            if (
              Math.abs(parsed.sendAmount - amount) < 1 ||
              !capturedQuote
            ) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Response not readable
        }
      }
    });

    // Navigate to corridor page
    const url = `https://www.remitly.com/${corridor.urlPath}`;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(2000);
    await dismissOverlays(page);

    // Find the send amount input
    // Remitly uses input[id*="send"] based on our test
    const inputSelectors = [
      'input[id*="send"]',
      'input[data-testid="send-amount"]',
      'input[data-testid="calculator-input"]',
      'input[name="sendAmount"]',
      'input[name="amount"]',
      'input[id*="amount"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[type="tel"]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
    ];

    let filled = false;
    for (const sel of inputSelectors) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 2000 })) {
          // Triple-click to select all, then type new amount
          await input.click({ clickCount: 3 });
          await delay(200);

          // Type digit by digit for reactive updates
          for (const char of String(amount)) {
            await input.press(char);
            await delay(60);
          }
          filled = true;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!filled) {
      console.log(`    ⚠ Could not find amount input`);
    }

    // Wait for the calculator API to respond
    await delay(4000);

    // Check if we got an exact match for our amount
    const captured = capturedQuote as RemitlyQuote | null;
    if (captured && Math.abs(captured.sendAmount - amount) < 1) {
      return captured;
    }

    // If we got a response but for a different amount, still use it if it's close
    if (captured) return captured;

    // Fallback: scrape from DOM
    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(
      `    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`
    );
    return null;
  } finally {
    await page.close();
  }
}

async function scrapeDom(
  page: Page,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): Promise<RemitlyQuote | null> {
  try {
    const bodyText = await page
      .locator("body")
      .textContent({ timeout: 3000 });
    if (!bodyText) return null;

    // Remitly shows "1 USD = XX.XX INR" on the page
    const rateMatch = bodyText.match(
      /1\s*[A-Z]{3}\s*=\s*([\d,.]+)\s*[A-Z]{3}/
    );
    // Look for receive amount (large number near currency code)
    const receiveMatch = bodyText.match(
      /(?:[\d,]+(?:\.\d{2})?)\s*(?:INR|PHP|MXN|NGN|PKR|BDT|GHS|KES|BRL|GTQ|COP)/g
    );
    const feeMatch = bodyText.match(
      /(?:Fee|fee|Transfer fee)[^\d]*([\d,.]+)/
    );

    const rate = rateMatch ? parseFloat(rateMatch[1].replace(/,/g, "")) : 0;
    const fee = feeMatch ? parseFloat(feeMatch[1].replace(/,/g, "")) : 0;

    // Find the largest number matching a receive currency pattern (likely the receive amount)
    let receiveAmount = 0;
    if (receiveMatch) {
      for (const match of receiveMatch) {
        const num = parseFloat(match.replace(/[^0-9.]/g, ""));
        if (num > receiveAmount) receiveAmount = num;
      }
    }

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || receiveAmount / amount;
    const effectiveReceive = receiveAmount || amount * rate;

    return {
      provider: "Remitly",
      providerSlug: "remitly",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "remitly-browser-dom",
    };
  } catch {
    return null;
  }
}

async function scrapeWithRetry(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<RemitlyQuote | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const quote = await scrapeCorridorAmount(context, corridor, amount);
    if (quote) return quote;

    if (attempt < MAX_RETRIES) {
      const backoff = attempt * 2000 + Math.random() * 2000;
      console.log(
        `    ↻ Retry ${attempt}/${MAX_RETRIES} in ${Math.round(backoff / 1000)}s...`
      );
      await delay(backoff);
    }
  }
  return null;
}

async function main() {
  console.log("=== Remitly Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}`);
  console.log(`Max retries per quote: ${MAX_RETRIES}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const allQuotes: RemitlyQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.urlPath})`);

      for (const amount of SEND_AMOUNTS) {
        console.log(
          `  Scraping: ${corridor.from} → ${corridor.to} ($${amount})...`
        );

        const quote = await scrapeWithRetry(context, corridor, amount);

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(
            `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate.toFixed(4)}, Receive: ${quote.receiveAmount} [${quote.source}]`
          );
        } else {
          failCount++;
          console.log(`    ✗ No data after ${MAX_RETRIES} attempts`);
        }

        await jitteredDelay(DELAY_MS);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  // Write output
  const outputPath = path.join(OUTPUT_DIR, "remitly-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== Remitly Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(
    `Success rate: ${((successCount / (successCount + failCount)) * 100).toFixed(1)}%`
  );
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);

  if (
    successCount + failCount > 0 &&
    successCount / (successCount + failCount) < 0.2
  ) {
    console.error(
      "\n⚠ Success rate below 20% — Remitly may have changed their site structure"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Remitly scraper failed:", err);
  process.exit(1);
});
