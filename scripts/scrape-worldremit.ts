import * as fs from "fs";
import * as path from "path";
import { chromium, type Page, type BrowserContext } from "playwright";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 3000;
const NAV_TIMEOUT = 30000;
const MAX_RETRIES = 3;

// WorldRemit URL pattern: /en/{receiveCountry}
// The calculator on each page defaults to that corridor
const CORRIDORS = [
  { from: "USD", to: "INR", sendCountry: "us", receiveCountry: "india" },
  { from: "USD", to: "PHP", sendCountry: "us", receiveCountry: "philippines" },
  { from: "USD", to: "IDR", sendCountry: "us", receiveCountry: "indonesia" },
  { from: "USD", to: "THB", sendCountry: "us", receiveCountry: "thailand" },
  { from: "USD", to: "NPR", sendCountry: "us", receiveCountry: "nepal" },
  { from: "USD", to: "EGP", sendCountry: "us", receiveCountry: "egypt" },
  { from: "USD", to: "MXN", sendCountry: "us", receiveCountry: "mexico" },
  { from: "USD", to: "NGN", sendCountry: "us", receiveCountry: "nigeria" },
  { from: "USD", to: "PKR", sendCountry: "us", receiveCountry: "pakistan" },
  { from: "USD", to: "BDT", sendCountry: "us", receiveCountry: "bangladesh" },
  { from: "USD", to: "GHS", sendCountry: "us", receiveCountry: "ghana" },
  { from: "USD", to: "KES", sendCountry: "us", receiveCountry: "kenya" },
  { from: "GBP", to: "INR", sendCountry: "gb", receiveCountry: "india" },
  { from: "GBP", to: "NGN", sendCountry: "gb", receiveCountry: "nigeria" },
  { from: "GBP", to: "PKR", sendCountry: "gb", receiveCountry: "pakistan" },
  { from: "GBP", to: "GHS", sendCountry: "gb", receiveCountry: "ghana" },
  { from: "GBP", to: "EUR", sendCountry: "gb", receiveCountry: "germany" },
  { from: "EUR", to: "INR", sendCountry: "de", receiveCountry: "india" },
  { from: "EUR", to: "NGN", sendCountry: "de", receiveCountry: "nigeria" },
  { from: "CAD", to: "INR", sendCountry: "ca", receiveCountry: "india" },
  { from: "CAD", to: "PHP", sendCountry: "ca", receiveCountry: "philippines" },
  { from: "AUD", to: "INR", sendCountry: "au", receiveCountry: "india" },
  { from: "AUD", to: "PHP", sendCountry: "au", receiveCountry: "philippines" },
  { from: "AED", to: "INR", sendCountry: "ae", receiveCountry: "india" },
  { from: "AED", to: "PKR", sendCountry: "ae", receiveCountry: "pakistan" },
  { from: "SGD", to: "INR", sendCountry: "sg", receiveCountry: "india" },
  { from: "SGD", to: "PHP", sendCountry: "sg", receiveCountry: "philippines" },
  { from: "SAR", to: "INR", sendCountry: "sa", receiveCountry: "india" },
  { from: "SAR", to: "PKR", sendCountry: "sa", receiveCountry: "pakistan" },
  { from: "SAR", to: "BDT", sendCountry: "sa", receiveCountry: "bangladesh" },
  { from: "NZD", to: "INR", sendCountry: "nz", receiveCountry: "india" },
  { from: "NZD", to: "PHP", sendCountry: "nz", receiveCountry: "philippines" },
];

const SEND_AMOUNTS = [100, 500, 1000, 5000];

interface WorldRemitQuote {
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
  payoutMethod: string | null;
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
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    'button:has-text("OK")',
    '[class*="modal"] button[class*="close"]',
  ];

  for (const selector of dismissSelectors) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1000 });
        await delay(300);
      }
    } catch {
      // Not found or not clickable
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

  // Mask webdriver detection
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

// Parse the WorldRemit GraphQL createCalculation response
function parseGraphQLResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): WorldRemitQuote | null {
  try {
    const json = JSON.parse(body);
    const calc = json?.data?.createCalculation?.calculation;
    if (!calc) return null;

    const sendAmount = calc.send?.amount;
    const receiveAmount = calc.receive?.amount;
    const feeSummary = calc.informativeSummary?.fee?.value?.amount ?? 0;
    const sendCurr = calc.send?.currency;
    const recvCurr = calc.receive?.currency;

    // Validate this is the response for our expected corridor/amount
    if (sendCurr && sendCurr !== sendCurrency) return null;
    if (recvCurr && recvCurr !== receiveCurrency) return null;
    if (!receiveAmount || receiveAmount <= 0) return null;

    const effectiveRate = receiveAmount / sendAmount;

    // Extract delivery estimate from payOutMethods if available
    let deliveryEstimate: string | null = null;
    const payoutMethods = json?.data?.createCalculation?.calculation?.payOutMethodsCalculations;
    if (Array.isArray(payoutMethods) && payoutMethods.length > 0) {
      deliveryEstimate = payoutMethods[0]?.payOutTimeEstimate ?? null;
    }

    return {
      provider: "WorldRemit",
      providerSlug: "worldremit",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: sendAmount ?? expectedAmount,
      fee: Math.round(feeSummary * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      deliveryEstimate,
      payoutMethod: null,
      dateCollected: new Date().toISOString(),
      source: "worldremit-browser-graphql",
    };
  } catch {
    return null;
  }
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<WorldRemitQuote | null> {
  const page = await context.newPage();
  let capturedQuote: WorldRemitQuote | null = null;
  let pageClosing = false;

  try {
    // Intercept GraphQL responses — worldremit.com or api.worldremit.com
    page.on("response", async (response) => {
      if (pageClosing) return;
      const url = response.url();
      if (
        url.includes("worldremit.com") &&
        (url.includes("graphql") || url.includes("/api/") || url.includes("calculat") || url.includes("quote") || url.includes("price"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          // Only parse responses containing createCalculation
          if (body.includes("createCalculation")) {
            const parsed = parseGraphQLResponse(
              body,
              corridor.from,
              corridor.to,
              amount
            );
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Response not readable
        }
      }
    });

    // Navigate to the corridor page — use direct send-money URL with currency params
    const url = `https://www.worldremit.com/en/${corridor.receiveCountry}?sendingFrom=${corridor.sendCountry}&amount=${amount}`;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(3000);
    await dismissOverlays(page);

    // Wait for initial calculator load (it auto-triggers a calculation)
    await delay(3000);

    // Find the send amount input — WorldRemit uses aria-label="pricing-calculator-input-label"
    // The first matching input is the send amount
    const calcInput = page
      .locator('input[aria-label="pricing-calculator-input-label"]')
      .first();

    if (await calcInput.isVisible({ timeout: 3000 })) {
      // Clear and type the new amount
      await calcInput.click();
      await calcInput.click({ clickCount: 3 }); // Select all
      await delay(200);

      // Type digit by digit to trigger reactive updates
      for (const char of String(amount)) {
        await calcInput.press(char);
        await delay(80);
      }

      // Wait for the GraphQL response
      await delay(4000);
    } else {
      // Fallback: try other input selectors
      const fallbackSelectors = [
        'input[inputmode="numeric"]',
        'input[type="tel"]',
        'input[type="number"]',
      ];

      for (const sel of fallbackSelectors) {
        try {
          const input = page.locator(sel).first();
          if (await input.isVisible({ timeout: 1000 })) {
            await input.click({ clickCount: 3 });
            await delay(200);
            for (const char of String(amount)) {
              await input.press(char);
              await delay(80);
            }
            await delay(4000);
            break;
          }
        } catch {
          continue;
        }
      }
    }

    // If captured via network interception, return it
    if (capturedQuote) return capturedQuote;

    // Fallback: try to extract from DOM
    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(
      `    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`
    );
    return null;
  } finally {
    pageClosing = true;
    await page.close().catch(() => {});
  }
}

async function scrapeDom(
  page: Page,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): Promise<WorldRemitQuote | null> {
  try {
    // WorldRemit shows "They get" section with the receive amount
    const bodyText = await page
      .locator("body")
      .textContent({ timeout: 3000 });
    if (!bodyText) return null;

    // Look for "They get" followed by a number with the target currency
    const receiveMatch = bodyText.match(
      new RegExp(`They\\s+get[\\s\\S]*?([\\d,]+(?:\\.\\d+)?)\\s*${receiveCurrency}`, "i")
    );
    // Match rate for the specific corridor: "1 USD = XX.XX INR"
    const rateMatch = bodyText.match(
      new RegExp(`1\\s*${sendCurrency}\\s*=\\s*([\\d,.]+)\\s*${receiveCurrency}`)
    );
    const feeMatch = bodyText.match(
      new RegExp(`(?:fee|Fee)[^0-9]*([\\d,.]+)\\s*${sendCurrency}`)
    );

    const receiveAmount = receiveMatch
      ? parseFloat(receiveMatch[1].replace(/,/g, ""))
      : 0;
    const rate = rateMatch ? parseFloat(rateMatch[1].replace(/,/g, "")) : 0;
    const fee = feeMatch ? parseFloat(feeMatch[1].replace(/,/g, "")) : 0;

    if (!receiveAmount && !rate) return null;

    const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / amount : 0);
    const effectiveReceive = receiveAmount || (rate > 0 ? amount * rate : 0);

    return {
      provider: "WorldRemit",
      providerSlug: "worldremit",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: null,
      payoutMethod: null,
      dateCollected: new Date().toISOString(),
      source: "worldremit-browser-dom",
    };
  } catch {
    return null;
  }
}

async function scrapeWithRetry(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<WorldRemitQuote | null> {
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
  console.log("=== WorldRemit Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}`);
  console.log(`Max retries per quote: ${MAX_RETRIES}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const allQuotes: WorldRemitQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(
        `\n📍 ${corridor.from} → ${corridor.to} (${corridor.sendCountry} → ${corridor.receiveCountry})`
      );

      for (const amount of SEND_AMOUNTS) {
        try {
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
        } catch (err) {
          failCount++;
          console.error(
            `    ✗ Error scraping ${corridor.from} → ${corridor.to} ($${amount}): ${(err as Error).message}`
          );
        }
      }
    }
  } finally {
    await context.browser()?.close();

    // Write output — always save partial data even if the loop threw
    const outputPath = path.join(OUTPUT_DIR, "worldremit-quotes.json");
    fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n=== WorldRemit Scraping Complete ===`);
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
        "\n⚠ Success rate below 20% — WorldRemit may have changed their site structure"
      );
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("WorldRemit scraper failed:", err);
});
