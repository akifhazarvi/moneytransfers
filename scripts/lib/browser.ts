/**
 * Shared Playwright browser utilities for all provider scrapers.
 * Handles: browser setup, bot detection evasion, overlay dismissal,
 * input interaction, retry logic, and output writing.
 *
 * Anti-detection strategy (2025):
 *  - Rotating realistic user agents (Chrome 131/130, Firefox 132, Safari 17, Edge 131)
 *  - Randomised viewport / screen dimensions
 *  - Full navigator spoofing: webdriver, plugins, languages, platform,
 *    hardwareConcurrency, deviceMemory, connection
 *  - Realistic chrome runtime object
 *  - Permissions API override (notifications probe)
 *  - WebGL vendor / renderer spoofing
 *  - Canvas toDataURL noise injection
 *  - Human-like mouse movement before every click
 */
import * as fs from "fs";
import * as path from "path";
import { chromium, type Page, type BrowserContext } from "playwright";

export const OUTPUT_DIR = path.join(__dirname, "..", "..", "src", "data", "scraped");
export const NAV_TIMEOUT = 30000;
export const MAX_RETRIES = 3;

// ---------------------------------------------------------------------------
// Rotating user agents – real strings from Chrome 130/131, Firefox 132,
// Safari 17.6, Edge 131. Rotated per browser context to vary fingerprint.
// ---------------------------------------------------------------------------
export const USER_AGENTS = [
  // Chrome 131 – Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  // Chrome 130 – Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  // Chrome 131 – macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  // Chrome 130 – macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  // Chrome 131 – Linux
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  // Edge 131 – Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  // Firefox 132 – Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
  // Firefox 132 – macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
  // Safari 17.6 – macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
  // Chrome 131 – Windows (alternate build)
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36",
];

// Realistic viewport / screen combos (width × height)
const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
];

// Platform strings that match the user agents above
const PLATFORMS = ["Win32", "Win32", "MacIntel", "MacIntel", "Linux x86_64", "Win32", "Win32", "MacIntel", "MacIntel", "Win32"];

export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

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
  /** How the sender pays: "Bank Transfer", "Debit Card", "Credit Card", "Apple Pay", etc. */
  paymentMethod: string | null;
  /** How the recipient receives funds: "Bank Deposit", "Cash Pickup", "Mobile Money", etc. */
  deliveryMethod: string | null;
  /** Estimated delivery time: "Minutes", "Same day", "1-2 days", etc. */
  deliveryEstimate: string | null;
  dateCollected: string;
  source: string;
}

/**
 * Extract payment method from an API response object.
 * Checks common field names across provider APIs.
 */
export function extractPaymentMethod(obj: Record<string, unknown>): string | null {
  const raw = String(
    obj.paymentMethod ?? obj.fundingSource ?? obj.payInMethod ??
    obj.pay_in_method ?? obj.fund_in ?? obj.paymentType ??
    obj.payment_method ?? obj.sendMethod ?? ""
  ).trim();
  if (!raw) return null;
  // Normalise to human-readable label
  const upper = raw.toUpperCase();
  if (upper.includes("BANK") || upper.includes("ACH") || upper.includes("WIRE")) return "Bank Transfer";
  if (upper.includes("DEBIT")) return "Debit Card";
  if (upper.includes("CREDIT")) return "Credit Card";
  if (upper.includes("APPLE")) return "Apple Pay";
  if (upper.includes("GOOGLE")) return "Google Pay";
  if (upper.includes("CARD")) return "Card";
  if (upper.includes("WALLET")) return "Digital Wallet";
  return raw; // return raw if no known pattern
}

/**
 * Extract delivery method (receive side) from an API response.
 */
export function extractDeliveryMethod(obj: Record<string, unknown>): string | null {
  const raw = String(
    obj.deliveryMethod ?? obj.receiveMethod ?? obj.payoutMethod ??
    obj.disbursementMethod ?? obj.payout_method ?? obj.deliveryOption ??
    obj.serviceOption ?? ""
  ).trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (upper.includes("BANK") || upper.includes("DEPOSIT") || upper.includes("ACCOUNT")) return "Bank Deposit";
  if (upper.includes("CASH")) return "Cash Pickup";
  if (upper.includes("MOBILE") || upper.includes("MPESA") || upper.includes("MOMO")) return "Mobile Money";
  if (upper.includes("WALLET")) return "Digital Wallet";
  if (upper.includes("HOME") || upper.includes("DOOR")) return "Home Delivery";
  return raw;
}

/**
 * Extract delivery time estimate from an API response.
 */
export function extractDeliveryTime(obj: Record<string, unknown>): string | null {
  const raw = String(
    obj.deliveryEstimate ?? obj.deliveryTime ?? obj.estimatedDelivery ??
    obj.delivery_time ?? obj.transferTime ?? obj.processingTime ??
    obj.speed ?? ""
  ).trim();
  if (!raw || raw === "null" || raw === "undefined") return null;
  return raw;
}

export function extractReceiveAmount(obj: Record<string, unknown>): number {
  const raw = obj.receiveAmount ?? obj.receivedAmount ?? obj.receive_amount ??
    obj.destinationAmount ?? obj.targetAmount ?? obj.recipientAmount ??
    obj.destination_amount ?? obj.payout_amount ?? obj.payoutAmount ??
    obj.amountReceived ?? obj.toAmount ?? obj.convertedAmount ?? 0;
  return parseFloat(String(raw)) || 0;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function jitteredDelay(baseMs: number): Promise<void> {
  const jitter = Math.floor(Math.random() * baseMs * 0.5);
  return delay(baseMs + jitter);
}

// ---------------------------------------------------------------------------
// setupBrowserContext — hardened stealth browser with rotating fingerprint
// ---------------------------------------------------------------------------
export async function setupBrowserContext(opts: { userAgent?: string } = {}): Promise<BrowserContext> {
  const uaIndex = Math.floor(Math.random() * USER_AGENTS.length);
  const userAgent = opts.userAgent ?? USER_AGENTS[uaIndex];
  const platform = PLATFORMS[uaIndex] ?? "Win32";
  const viewport = VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=" + viewport.width + "," + viewport.height,
      "--lang=en-US,en",
    ],
  });

  const context = await browser.newContext({
    userAgent,
    viewport,
    locale: "en-US",
    timezoneId: "America/New_York",
    // Expose screen dimensions matching the viewport
    screen: { width: viewport.width, height: viewport.height },
  });

  // ---------------------------------------------------------------------------
  // Comprehensive navigator / window spoofing injected before any page script
  // ---------------------------------------------------------------------------
  await context.addInitScript((opts: { platform: string }) => {
    // 1. Remove Playwright automation flag
    Object.defineProperty(navigator, "webdriver", { get: () => false });

    // 2. Realistic Chrome runtime object
    (window as unknown as Record<string, unknown>).chrome = {
      app: {
        isInstalled: false,
        InstallState: { DISABLED: "disabled", INSTALLED: "installed", NOT_INSTALLED: "not_installed" },
        RunningState: { CANNOT_RUN: "cannot_run", READY_TO_RUN: "ready_to_run", RUNNING: "running" },
        getDetails: () => {},
        getIsInstalled: () => {},
        installState: () => {},
      },
      runtime: {
        id: undefined,
        connect: () => { throw new Error(); },
        sendMessage: () => { throw new Error(); },
        onConnect: { addListener: () => {}, removeListener: () => {}, hasListener: () => false },
        onMessage: { addListener: () => {}, removeListener: () => {}, hasListener: () => false },
      },
      loadTimes: () => ({
        requestTime: performance.timeOrigin / 1000,
        startLoadTime: performance.timeOrigin / 1000,
        commitLoadTime: performance.timeOrigin / 1000,
        finishDocumentLoadTime: performance.timeOrigin / 1000,
        finishLoadTime: performance.timeOrigin / 1000,
        firstPaintTime: performance.timeOrigin / 1000,
        firstPaintAfterLoadTime: 0,
        navigationType: "Other",
        wasFetchedViaSpdy: false,
        wasNpnNegotiated: false,
        npnNegotiatedProtocol: "unknown",
        wasAlternateProtocolAvailable: false,
        connectionInfo: "http/1.1",
      }),
      csi: () => ({
        startE: performance.timeOrigin,
        onloadT: performance.timeOrigin,
        pageT: performance.now(),
        tran: 15,
      }),
    };

    // 3. Navigator plugin list (matches a real Chrome install)
    const pluginData = [
      { name: "Chrome PDF Plugin", filename: "internal-pdf-viewer", description: "Portable Document Format", mimeTypes: [{ type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format" }] },
      { name: "Chrome PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai", description: "", mimeTypes: [{ type: "application/pdf", suffixes: "pdf", description: "" }] },
      { name: "Native Client", filename: "internal-nacl-plugin", description: "", mimeTypes: [{ type: "application/x-nacl", suffixes: "", description: "Native Client Executable" }, { type: "application/x-pnacl", suffixes: "", description: "Portable Native Client Executable" }] },
    ];
    Object.defineProperty(navigator, "plugins", {
      get: () => {
        const arr = pluginData as unknown[];
        Object.defineProperty(arr, "item", { value: (i: number) => arr[i] });
        Object.defineProperty(arr, "namedItem", { value: (n: string) => pluginData.find(p => p.name === n) ?? null });
        Object.defineProperty(arr, "refresh", { value: () => {} });
        return arr;
      },
    });
    Object.defineProperty(navigator, "mimeTypes", { get: () => ({ length: 4, item: () => null, namedItem: () => null }) });

    // 4. Language / locale
    Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
    Object.defineProperty(navigator, "language", { get: () => "en-US" });

    // 5. Hardware hints — realistic values
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
    Object.defineProperty(navigator, "platform", { get: () => opts.platform });

    // 6. Connection API (present in Chrome)
    Object.defineProperty(navigator, "connection", {
      get: () => ({
        rtt: 50,
        downlink: 10,
        effectiveType: "4g",
        saveData: false,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });

    // 7. Permissions API — spoof notification query
    if ("Permissions" in window && window.Permissions?.prototype?.query) {
      const origQuery = window.Permissions.prototype.query.bind(window.Permissions.prototype);
      window.Permissions.prototype.query = (params: PermissionDescriptor) =>
        params.name === "notifications"
          ? Promise.resolve(Object.assign(Object.create(PermissionStatus.prototype), { state: Notification.permission, onchange: null }))
          : origQuery(params);
    }

    // 8. WebGL vendor/renderer spoofing
    try {
      const getParam = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (p: number) {
        if (p === 37445) return "Google Inc. (NVIDIA)";   // UNMASKED_VENDOR_WEBGL
        if (p === 37446) return "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0, D3D11)"; // UNMASKED_RENDERER_WEBGL
        return getParam.call(this, p);
      };
    } catch { /* WebGL not available */ }

    // 9. Canvas fingerprint noise — XOR 1 bit on a handful of pixels
    try {
      const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function (type?: string, quality?: number) {
        const ctx = this.getContext("2d");
        if (ctx && this.width > 0 && this.height > 0) {
          const d = ctx.getImageData(0, 0, this.width, this.height);
          for (let i = 0; i < d.data.length; i += 997) d.data[i] ^= 1;
          ctx.putImageData(d, 0, 0);
        }
        return origToDataURL.call(this, type, quality);
      };
    } catch { /* not writable */ }
  }, { platform });

  return context;
}

// ---------------------------------------------------------------------------
// dismissOverlays — cookie consent / modal closers
// ---------------------------------------------------------------------------
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
    'button:has-text("Accept cookies")',
    'button:has-text("Accept")',
    'button:has-text("I agree")',
    'button:has-text("I Accept")',
    'button:has-text("Got it")',
    'button:has-text("OK")',
    'button:has-text("Allow all")',
    'button:has-text("Allow All")',
    'button:has-text("Agree")',
    '[class*="cookie"] button',
    '[class*="consent"] button',
    '[class*="gdpr"] button',
    '[class*="modal"] button[class*="close"]',
    '[class*="banner"] button[class*="close"]',
    '[class*="overlay"] button[class*="close"]',
    'button[aria-label="Close"]',
    'button[aria-label="Dismiss"]',
    '[data-cy="cookie-accept"]',
    '[data-qa="cookie-accept"]',
  ];

  for (const selector of dismissSelectors) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1000 });
        await delay(300);
      }
    } catch {
      // Not found — continue
    }
  }
}

// ---------------------------------------------------------------------------
// humanClick — move mouse to element area before clicking (evades bot checks)
// ---------------------------------------------------------------------------
export async function humanClick(page: Page, selector: string): Promise<boolean> {
  try {
    const el = page.locator(selector).first();
    if (!(await el.isVisible({ timeout: 3000 }))) return false;
    const box = await el.boundingBox();
    if (!box) {
      await el.click();
      return true;
    }
    // Move to a slightly random point within the element
    const x = box.x + box.width * (0.3 + Math.random() * 0.4);
    const y = box.y + box.height * (0.3 + Math.random() * 0.4);
    await page.mouse.move(x - 50, y - 30, { steps: 5 });
    await delay(80 + Math.random() * 120);
    await page.mouse.move(x, y, { steps: 8 });
    await delay(50 + Math.random() * 80);
    await page.mouse.click(x, y);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// fillAmountInput — type digit-by-digit to trigger reactive frameworks
// ---------------------------------------------------------------------------
export async function fillAmountInput(
  page: Page,
  amount: number,
  selectors: string[]
): Promise<boolean> {
  for (const sel of selectors) {
    try {
      const input = page.locator(sel).first();
      if (await input.isVisible({ timeout: 2000 })) {
        await input.click({ clickCount: 3 });
        await delay(150 + Math.random() * 100);
        await input.press("Control+a");
        await input.press("Backspace");
        await delay(100);
        for (const char of String(amount)) {
          await input.press(char);
          await delay(50 + Math.random() * 60);
        }
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// withRetry — exponential backoff wrapper
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// writeOutput — write JSON + print summary
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// parseNumber — strip currency symbols / commas and return float
// ---------------------------------------------------------------------------
export function parseNumber(text: string | null | undefined): number {
  if (!text) return 0;
  const cleaned = text.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}
