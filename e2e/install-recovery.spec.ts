import { test, expect, installPrompt, offerInstallPrompt, waitForServiceWorker } from "./fixtures";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("smc_pwa_views", "2"));
});

test("a late browser install event offers without another scroll", async ({ page }) => {
  await page.goto("/guides");
  await page.waitForTimeout(5_000);
  await page.locator('[data-pwa-install-slot="article-end"]').scrollIntoViewIfNeeded();
  await expect(installPrompt(page)).toHaveCount(0);
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.assign(event, {
      __fake: true,
      prompt: () => Promise.resolve(),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
    });
    dispatchEvent(event);
  });
  await expect(installPrompt(page)).toBeVisible();
});

test("returning online retries the visible slot", async ({ page, context }) => {
  await offerInstallPrompt(context);
  await page.goto("/guides");
  await context.setOffline(true);
  await page.waitForTimeout(5_000);
  await page.locator('[data-pwa-install-slot="article-end"]').scrollIntoViewIfNeeded();
  await expect(installPrompt(page)).toHaveCount(0);
  await context.setOffline(false);
  await expect(installPrompt(page)).toBeVisible();
});

test("consent dismissal retries without another scroll", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "geo-country", value: "GB", url: baseURL! }]);
  await offerInstallPrompt(context);
  await page.goto("/guides");
  await page.waitForTimeout(5_000);
  await page.locator('[data-pwa-install-slot="article-end"]').scrollIntoViewIfNeeded();
  await expect(installPrompt(page)).toHaveCount(0);
  await page.getByRole("dialog", { name: "Cookie consent" }).getByRole("button", { name: "Decline" }).click();
  await expect(installPrompt(page)).toBeVisible();
});

test("a failed native prompt opens installation instructions", async ({ page, context, isMobile }) => {
  await offerInstallPrompt(context);
  await page.goto("/guides");
  await page.evaluate(() => {
    window.__smcInstallPrompt!.prompt = () => Promise.reject(new Error("Expired install event"));
  });
  await page.getByRole("button", { name: "Add to your device", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(isMobile ? "Add to Home screen" : "Install page as app");
});

test("footer instructions remain available after declining the offer", async ({ page, context }) => {
  await offerInstallPrompt(context);
  await context.addInitScript(() => localStorage.setItem("smc_pwa_dismissed_at", String(Date.now())));
  await page.goto("/tools");
  await page.getByRole("button", { name: "Add to your device", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__installPromptCalls)).toBe(1);
  await expect(installPrompt(page)).toHaveCount(0);
});

test("a late-rendered slot is discovered without scrolling", async ({ page, context }) => {
  await offerInstallPrompt(context);
  await page.goto("/guides");
  await page.waitForTimeout(5_000);
  await expect(installPrompt(page)).toHaveCount(0);
  await page.evaluate(() => {
    const slot = document.createElement("div");
    slot.dataset.pwaInstallSlot = "late-content";
    slot.style.cssText = "position:fixed;top:150px;left:20px;right:20px;min-height:1px";
    document.getElementById("main-content")!.append(slot);
  });
  await expect(page.locator('[data-pwa-install-slot="late-content"] [data-pwa-install-prompt]')).toBeVisible();
});

test("worker registration does not wait for a stalled page resource", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/pwa-stalled-image.png", async route => {
    await pending;
    await route.abort();
  });
  await page.addInitScript(() => {
    addEventListener("DOMContentLoaded", () => {
      const image = new Image();
      image.src = "/pwa-stalled-image.png";
      document.body.append(image);
    });
  });
  try {
    await page.goto("/guides", { waitUntil: "domcontentloaded" });
    await waitForServiceWorker(page);
    expect(await page.evaluate(() => document.readyState)).not.toBe("complete");
  } finally {
    release();
  }
});
