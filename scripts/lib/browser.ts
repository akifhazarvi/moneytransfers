/**
 * Shared Playwright browser utilities for all provider scrapers.
 * Handles: browser setup, bot detection evasion, overlay dismissal,
 * input interaction, retry logic, and output writing.
 */
import * as fs from "fs";
import * as path from "path";
import { chromium, type Page, type BrowserContext } from "playwright";

export const OUTPUT_DIR = path.join(__dirname, "..", "..", "src", "data", "scraped");
export const NAV_TIMEOUT = 30000;
export const MAX_RETRIES = 3;

// Standard corridors used across all provider scrapers
export const STANDARD_CORRIDORS = [
  // From USD
  { from: "USD", to: "INR" },
  { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" },
  { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" },
  { from: "USD", to: "BDT" },
  { from: "USD", to: "GHS" },
  { from: "USD", to: "KES" },
  { from: "USD", to: "BRL" },
  { from: "USD", to: "COP" },
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  // From GBP
  { from: "GBP", to: "INR" },
  { from: "GBP", to: "EUR" },
  { from: "GBP", to: "NGN" },
  { from: "GBP", to: "PKR" },
  { from: "GBP", to: "PHP" },
  // From EUR
  { from: "EUR", to: "INR" },
  { from: "EUR", to: "GBP" },
  { from: "EUR", to: "NGN" },
  { from: "EUR", to: "PHP" },
  // From CAD
  { from: "CAD", to: "INR" },
  { from: "CAD", to: "PHP" },
  // From AUD
  { from: "AUD", to: "INR" },
  { from: "AUD", to: "PHP" },
  // From AED
  { from: "AED", to: "INR" },
  { from: "AED", to: "PKR" },
];

export const SEND_AMOUNTS = [100, 500, 1000, 5000];

export interface ProviderQuote {
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

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function jitteredDelay(baseMs: number): Promise<void> {
  const jitter = Math.floor(Math.random() * baseMs * 0.5);
  return delay(baseMs + jitter);
}

export async function setupBrowserContext(): Promise<BrowserContext> {
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

export async function dismissOverlays(page: Page): Promise<void> {
  const dismissSelectors = [
    "#onetrust-accept-btn-handler",
    "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
    '[data-testid="cookie-accept"]',
    '[id*="cookie-accept"]',
    'button:has-text("Accept All Cookies")',
    'button:has-text("Accept all cookies")',
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept")',
    'button:has-text("I agree")',
    'button:has-text("Got it")',
    'button:has-text("OK")',
    'button:has-text("Continue")',
    '[class*="cookie"] button',
    '[class*="consent"] button',
    '[class*="modal"] button[class*="close"]',
    '[class*="banner"] button[class*="close"]',
    'button[aria-label="Close"]',
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

/**
 * Try to fill an input field using multiple selector strategies.
 * Types digit-by-digit to trigger reactive framework updates.
 */
export async function fillAmountInput(
  page: Page,
  amount: number,
  selectors: string[]
): Promise<boolean> {
  for (const sel of selectors) {
    try {
      const input = page.locator(sel).first();
      if (await input.isVisible({ timeout: 2000 })) {
        await input.click({ clickCount: 3 }); // Select all
        await delay(200);
        // Clear first
        await input.press("Backspace");
        await delay(100);
        // Type digit by digit
        for (const char of String(amount)) {
          await input.press(char);
          await delay(60);
        }
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * Generic retry wrapper for scraping functions.
 */
export async function withRetry<T>(
  fn: () => Promise<T | null>,
  maxRetries: number = MAX_RETRIES,
  label: string = ""
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await fn();
    if (result) return result;

    if (attempt < maxRetries) {
      const backoff = attempt * 2000 + Math.random() * 2000;
      console.log(
        `    ↻ Retry ${attempt}/${maxRetries}${label ? ` (${label})` : ""} in ${Math.round(backoff / 1000)}s...`
      );
      await delay(backoff);
    }
  }
  return null;
}

/**
 * Write quotes to output file and print summary.
 */
export function writeOutput(
  providerName: string,
  slug: string,
  quotes: ProviderQuote[],
  startTime: number,
  successCount: number,
  failCount: number
): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const outputPath = path.join(OUTPUT_DIR, `${slug}-quotes.json`);
  fs.writeFileSync(outputPath, JSON.stringify(quotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const total = successCount + failCount;
  const rate = total > 0 ? ((successCount / total) * 100).toFixed(1) : "0.0";

  console.log(`\n=== ${providerName} Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${quotes.length} quotes)`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Success rate: ${rate}%`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);

  if (total > 0 && successCount / total < 0.2) {
    console.error(
      `\n⚠ Success rate below 20% — ${providerName} may have changed their site structure`
    );
    process.exit(1);
  }
}

/**
 * Extract a number from text, stripping currency symbols and commas.
 */
export function parseNumber(text: string | null | undefined): number {
  if (!text) return 0;
  const cleaned = text.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}
