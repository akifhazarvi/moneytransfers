/**
 * TapTap Send Browser Automation Scraper
 *
 * TapTap Send has a simple calculator at https://www.taptapsend.com/
 * They focus on specific corridors (US/UK/EU to Africa, South Asia, etc).
 *
 * Their site uses a React app that calls internal APIs when you select
 * a corridor and amount. TapTap Send is known for $0 fees and competitive rates.
 *
 * Strategy: Navigate to homepage → select country → intercept API → fill amount.
 * Fallback: DOM scraping for displayed rate/receive values.
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
  withRetry,
  writeOutput,
  parseNumber,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext, Page } from "playwright";

// TapTap Send supports limited corridors — mainly US/UK/EU to developing countries
const CORRIDORS = [
  { from: "USD", to: "INR", country: "India" },
  { from: "USD", to: "PHP", country: "Philippines" },
  { from: "USD", to: "NGN", country: "Nigeria" },
  { from: "USD", to: "PKR", country: "Pakistan" },
  { from: "USD", to: "BDT", country: "Bangladesh" },
  { from: "USD", to: "GHS", country: "Ghana" },
  { from: "USD", to: "KES", country: "Kenya" },
  { from: "USD", to: "MXN", country: "Mexico" },
  { from: "USD", to: "COP", country: "Colombia" },
  { from: "GBP", to: "INR", country: "India" },
  { from: "GBP", to: "NGN", country: "Nigeria" },
  { from: "GBP", to: "PKR", country: "Pakistan" },
  { from: "GBP", to: "GHS", country: "Ghana" },
  { from: "GBP", to: "KES", country: "Kenya" },
  { from: "GBP", to: "BDT", country: "Bangladesh" },
  { from: "EUR", to: "NGN", country: "Nigeria" },
  { from: "EUR", to: "GHS", country: "Ghana" },
  { from: "EUR", to: "KES", country: "Kenya" },
  { from: "CAD", to: "INR", country: "India" },
  { from: "CAD", to: "PHP", country: "Philippines" },
];

function parseTapTapApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);
    const root = data?.data || data?.result || data?.quote || data;

    // TapTap Send typically has no fees — rate is the key metric
    const rate = parseFloat(
      String(root.rate || root.exchangeRate || root.fx_rate || root.conversionRate || "0")
    );
    const fee = parseFloat(
      String(root.fee || root.transferFee || root.totalFee || "0")
    );
    const sendAmount = parseFloat(
      String(root.sendAmount || root.sourceAmount || root.send_amount || root.inputAmount || "0")
    ) || expectedAmount;
    const receiveAmount = parseFloat(
      String(root.receiveAmount || root.destinationAmount || root.receive_amount || root.outputAmount || root.convertedAmount || "0")
    );

    if (!receiveAmount && !rate) return null;

    const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / sendAmount : 0);
    const effectiveReceive = receiveAmount || sendAmount * rate;

    if (effectiveReceive <= 0) return null;

    return {
      provider: "TapTap Send",
      providerSlug: "taptap-send",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "taptapsend-browser",
    };
  } catch {
    return null;
  }
}

async function scrapeDom(
  page: Page,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): Promise<ProviderQuote | null> {
  try {
    const bodyText = await page.locator("body").textContent({ timeout: 3000 });
    if (!bodyText) return null;

    // TapTap Send shows "They receive X.XX CUR" or "1 USD = X.XX CUR"
    const rateMatch =
      bodyText.match(/1\s*[A-Z]{3}\s*=\s*([\d,.]+)\s*[A-Z]{3}/) ||
      bodyText.match(/(?:Rate|Exchange rate)[:\s]*([\d,.]+)/i);

    const receivePattern = new RegExp(
      `(?:receive|get|They receive)[^\\d]*(([\\d,]+(?:\\.\\d{2})?))\\s*${receiveCurrency}`,
      "i"
    );
    const receiveMatch = receivePattern.exec(bodyText);

    // Also try to find just the number near the currency
    const amtPattern = new RegExp(`([\\d,]+(?:\\.\\d{2})?)\\s*${receiveCurrency}`, "g");
    let maxReceive = 0;
    let match;
    while ((match = amtPattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      if (num > maxReceive) maxReceive = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const receiveAmount = receiveMatch ? parseNumber(receiveMatch[1]) : maxReceive;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || receiveAmount / amount;
    const effectiveReceive = receiveAmount || amount * rate;

    return {
      provider: "TapTap Send",
      providerSlug: "taptap-send",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: 0, // TapTap Send typically has no transfer fee
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "taptapsend-browser-dom",
    };
  } catch {
    return null;
  }
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let capturedQuote: ProviderQuote | null = null;

  try {
    // Intercept TapTap Send's API calls
    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.includes("taptapsend.com") &&
        (url.includes("quote") || url.includes("rate") || url.includes("price") ||
         url.includes("calculator") || url.includes("convert") || url.includes("transfer") ||
         url.includes("api"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("rate") || body.includes("amount") ||
            body.includes("receive") || body.includes("convert")
          ) {
            const parsed = parseTapTapApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to TapTap Send's main page
    await page.goto("https://www.taptapsend.com/", {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(3000);
    await dismissOverlays(page);

    // Try to select the destination country
    // TapTap Send typically has country selection buttons or a dropdown
    const countrySelectors = [
      `button:has-text("${corridor.country}")`,
      `a:has-text("${corridor.country}")`,
      `[data-country="${corridor.country}"]`,
      `li:has-text("${corridor.country}")`,
    ];
    for (const sel of countrySelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 })) {
          await el.click();
          await delay(2000);
          break;
        }
      } catch {
        continue;
      }
    }

    // Try search input for country selection
    const searchSelectors = [
      'input[placeholder*="country"]',
      'input[placeholder*="search"]',
      'input[placeholder*="Search"]',
      'input[aria-label*="country"]',
      'input[type="search"]',
    ];
    for (const sel of searchSelectors) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 1500 })) {
          await input.fill(corridor.country);
          await delay(1000);
          await page
            .locator(`li:has-text("${corridor.country}"), [role="option"]:has-text("${corridor.country}"), button:has-text("${corridor.country}")`)
            .first()
            .click({ timeout: 2000 });
          await delay(1500);
          break;
        }
      } catch {
        continue;
      }
    }

    // Fill send amount
    const filled = await fillAmountInput(page, amount, [
      'input[data-testid*="send"]',
      'input[data-testid*="amount"]',
      'input[name*="send"]',
      'input[name*="amount"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[aria-label*="You send"]',
      'input[placeholder*="send"]',
      'input[placeholder*="amount"]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      await page.keyboard.press("Tab");
    }

    await delay(5000);

    if (capturedQuote) return capturedQuote;
    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== TapTap Send Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.country})`);

      for (const amount of SEND_AMOUNTS) {
        console.log(`  Scraping: ${corridor.from} → ${corridor.to} ($${amount})...`);

        const quote = await withRetry(
          () => scrapeCorridorAmount(context, corridor, amount),
          MAX_RETRIES
        );

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(
            `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount} [${quote.source}]`
          );
        } else {
          failCount++;
          console.log(`    ✗ No data after ${MAX_RETRIES} attempts`);
        }

        await jitteredDelay(3000);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("TapTap Send", "taptapsend", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("TapTap Send scraper failed:", err);
  process.exit(1);
});
