/**
 * MoneyGram Browser Automation Scraper
 *
 * MoneyGram has an online estimator at https://www.moneygram.com/mgo/us/en/
 * When you select a destination and enter an amount, it triggers pricing API calls.
 *
 * Strategy: Navigate to send-money flow → select destination → intercept pricing API →
 * fill amount → capture response with rate, fees, receive amount.
 * Fallback: DOM scraping for displayed calculator values.
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

const CORRIDORS = [
  { from: "USD", to: "INR", destCountry: "India", sendPath: "us/en" },
  { from: "USD", to: "PHP", destCountry: "Philippines", sendPath: "us/en" },
  { from: "USD", to: "MXN", destCountry: "Mexico", sendPath: "us/en" },
  { from: "USD", to: "NGN", destCountry: "Nigeria", sendPath: "us/en" },
  { from: "USD", to: "PKR", destCountry: "Pakistan", sendPath: "us/en" },
  { from: "USD", to: "BDT", destCountry: "Bangladesh", sendPath: "us/en" },
  { from: "USD", to: "GHS", destCountry: "Ghana", sendPath: "us/en" },
  { from: "USD", to: "KES", destCountry: "Kenya", sendPath: "us/en" },
  { from: "USD", to: "BRL", destCountry: "Brazil", sendPath: "us/en" },
  { from: "USD", to: "COP", destCountry: "Colombia", sendPath: "us/en" },
  { from: "USD", to: "GTQ", destCountry: "Guatemala", sendPath: "us/en" },
  { from: "USD", to: "EUR", destCountry: "Germany", sendPath: "us/en" },
  { from: "GBP", to: "INR", destCountry: "India", sendPath: "gb/en" },
  { from: "GBP", to: "NGN", destCountry: "Nigeria", sendPath: "gb/en" },
  { from: "GBP", to: "PKR", destCountry: "Pakistan", sendPath: "gb/en" },
  { from: "GBP", to: "PHP", destCountry: "Philippines", sendPath: "gb/en" },
  { from: "EUR", to: "INR", destCountry: "India", sendPath: "de/en" },
  { from: "EUR", to: "NGN", destCountry: "Nigeria", sendPath: "de/en" },
  { from: "CAD", to: "INR", destCountry: "India", sendPath: "ca/en" },
  { from: "CAD", to: "PHP", destCountry: "Philippines", sendPath: "ca/en" },
  { from: "AUD", to: "INR", destCountry: "India", sendPath: "au/en" },
];

function parseMoneyGramApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);

    // MoneyGram API shapes — try various patterns
    // Common: { estimateResponse: { receiveAmounts: [...], exchangeRate, fees } }
    // Or: { feeEstimate: [...], exchangeRate }
    // Or: { data: { rate, fee, receiveAmount } }
    const root = data?.estimateResponse || data?.feeEstimate || data?.data || data?.result || data;

    // Handle array of fee estimates (one per delivery method)
    if (Array.isArray(root)) {
      // Pick bank deposit option first, then any
      const bankOption = root.find(
        (r: Record<string, unknown>) =>
          (r.deliveryOption as string)?.toLowerCase().includes("bank") ||
          (r.receiveMethod as string)?.toLowerCase().includes("account") ||
          (r.serviceOption as string)?.toLowerCase().includes("deposit")
      ) || root[0];

      if (bankOption) {
        return extractMoneyGramQuote(bankOption, sendCurrency, receiveCurrency, expectedAmount);
      }
    }

    // Handle nested receiveAmounts array
    if (root?.receiveAmounts && Array.isArray(root.receiveAmounts)) {
      const bankOption = root.receiveAmounts.find(
        (r: Record<string, unknown>) =>
          (r.deliveryOption as string)?.toLowerCase().includes("bank") ||
          (r.receiveMethod as string)?.toLowerCase().includes("account")
      ) || root.receiveAmounts[0];

      const rate = parseFloat(String(root.exchangeRate || root.rate || "0"));
      if (bankOption) {
        return extractMoneyGramQuote(
          { ...bankOption, exchangeRate: rate },
          sendCurrency, receiveCurrency, expectedAmount
        );
      }
    }

    return extractMoneyGramQuote(root, sendCurrency, receiveCurrency, expectedAmount);
  } catch {
    return null;
  }
}

function extractMoneyGramQuote(
  obj: Record<string, unknown>,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  const rate = parseFloat(
    String(obj.exchangeRate || obj.rate || obj.fx_rate || obj.fxRate || "0")
  );
  const fee = parseFloat(
    String(obj.fee || obj.transferFee || obj.totalFee || obj.fees || obj.sendFee || "0")
  );
  const sendAmount = parseFloat(
    String(obj.sendAmount || obj.principalAmount || obj.send_amount || "0")
  ) || expectedAmount;
  const receiveAmount = parseFloat(
    String(obj.receiveAmount || obj.destinationAmount || obj.receive_amount || obj.estimatedReceiveAmount || "0")
  );
  const deliveryEstimate =
    (obj.deliveryOption as string) || (obj.deliveryEstimate as string) ||
    (obj.serviceOption as string) || null;

  if (!receiveAmount && !rate) return null;

  const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / (sendAmount - fee) : 0);
  const effectiveReceive = receiveAmount || (sendAmount - fee) * rate;

  if (effectiveReceive <= 0) return null;

  return {
    provider: "MoneyGram",
    providerSlug: "moneygram",
    providerType: "moneyTransferProvider",
    sendCurrency,
    receiveCurrency,
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(effectiveRate * 10000) / 10000,
    receiveAmount: Math.round(effectiveReceive * 100) / 100,
    deliveryEstimate,
    deliveryMethod: null,
    dateCollected: new Date().toISOString(),
    source: "moneygram-browser",
  };
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

    const rateMatch =
      bodyText.match(/1\s*[A-Z]{3}\s*=\s*([\d,.]+)\s*[A-Z]{3}/) ||
      bodyText.match(/(?:Exchange\s*Rate|Rate)[:\s]*([\d,.]+)/i);
    const feeMatch = bodyText.match(/(?:Fee|Transfer fee|Service fee)[:\s$]*([\d,.]+)/i);

    const receivePattern = new RegExp(`([\\d,]+(?:\\.\\d{2})?)\\s*${receiveCurrency}`, "g");
    let receiveAmount = 0;
    let match;
    while ((match = receivePattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      if (num > receiveAmount) receiveAmount = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || receiveAmount / amount;
    const effectiveReceive = receiveAmount || amount * rate;

    return {
      provider: "MoneyGram",
      providerSlug: "moneygram",
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
      source: "moneygram-browser-dom",
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
    // Intercept MoneyGram's pricing/estimate API calls
    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("moneygram.com") || url.includes("mgo")) &&
        (url.includes("estimate") || url.includes("price") || url.includes("fee") ||
         url.includes("quote") || url.includes("rate") || url.includes("calculate") ||
         url.includes("send"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("exchangeRate") || body.includes("rate") ||
            body.includes("receiveAmount") || body.includes("fee") ||
            body.includes("estimateResponse")
          ) {
            const parsed = parseMoneyGramApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to MoneyGram's online flow
    const url = `https://www.moneygram.com/mgo/${corridor.sendPath}/`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(3000);
    await dismissOverlays(page);

    // Select destination country
    const countryInputSelectors = [
      'input[placeholder*="country"]',
      'input[placeholder*="Country"]',
      'input[placeholder*="Where"]',
      'input[placeholder*="destination"]',
      'input[aria-label*="country"]',
      'input[aria-label*="destination"]',
      'input[aria-label*="Receive"]',
      'input[id*="country"]',
      '#destination-country',
    ];
    for (const sel of countryInputSelectors) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 2000 })) {
          await input.click();
          await input.fill(corridor.destCountry);
          await delay(1000);
          await page
            .locator(`li:has-text("${corridor.destCountry}"), [role="option"]:has-text("${corridor.destCountry}"), button:has-text("${corridor.destCountry}")`)
            .first()
            .click({ timeout: 3000 });
          await delay(2000);
          break;
        }
      } catch {
        continue;
      }
    }

    // Also try clicking direct country buttons/links
    try {
      await page
        .locator(`[data-testid*="country"]:has-text("${corridor.destCountry}"), a:has-text("${corridor.destCountry}")`)
        .first()
        .click({ timeout: 1500 });
      await delay(1500);
    } catch {
      // Not found
    }

    // Fill send amount
    const filled = await fillAmountInput(page, amount, [
      'input[data-testid*="send"]',
      'input[data-testid*="amount"]',
      'input[name*="send"]',
      'input[name*="amount"]',
      'input[id*="send"]',
      'input[id*="amount"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[aria-label*="You send"]',
      'input[aria-label*="amount"]',
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
  console.log("=== MoneyGram Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.destCountry})`);

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

  writeOutput("MoneyGram", "moneygram", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("MoneyGram scraper failed:", err);
  process.exit(1);
});
