import type { Page } from "@playwright/test";
import { test, expect, installPrompt, offerInstallPrompt, scrollUntilOffered, trackedEvents } from "./fixtures";

// Chromium browsers (desktop Chrome/Edge, Android Chrome): the install flow
// the browser API makes possible. Runs on the desktop and Android projects.

/** The "Install" entry point a visitor can reach on this form factor. */
async function clickInstallEntry(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("button", { name: "Install the app" }).click();
  } else {
    await page.getByRole("button", { name: "Install app", exact: true }).click();
  }
}

test.describe("install on Chromium", () => {
  test("with a captured prompt, Install opens the browser's own dialog", async ({ page, context, isMobile }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await clickInstallEntry(page, isMobile);

    await expect.poll(() => page.evaluate(() => window.__installPromptCalls)).toBe(1);
    // The browser's dialog is the confirmation; ours never opens on top of it.
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect.poll(() => trackedEvents(page)).toEqual(expect.arrayContaining(["pwa_install_clicked", "pwa_install_outcome"]));
  });

  test("without a prompt, Install explains the browser's install route", async ({ page, isMobile }) => {
    await page.goto("/");
    await clickInstallEntry(page, isMobile);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(isMobile ? "Add to Home screen" : "Install page as app");
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("the prompt waits for engagement and the end of results, then installs", async ({ page, context }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.waitForTimeout(5_500);
    await expect(installPrompt(page), "never on the landing page view").toHaveCount(0);

    await page.goto("/send-money");
    await page.waitForTimeout(5_500);
    await expect(installPrompt(page)).toHaveCount(0);
    await scrollUntilOffered(page);
    const prompt = installPrompt(page);
    await expect(prompt).toContainText("Install the SendMoneyCompare app");

    // In document flow after the results, never laid over a provider action.
    // Mobile sets `relative` to anchor the icon — still in flow; fixed/sticky are not.
    expect(await prompt.evaluate((node) => getComputedStyle(node).position)).toMatch(/^(?:static|relative)$/);
    await expect(page.locator('[data-pwa-install-slot="comparison-end"]')).toContainText("Install the SendMoneyCompare app");

    await prompt.getByRole("button", { name: "Install", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__installPromptCalls)).toBe(1);
    await expect(prompt).toHaveCount(0);
    expect(await trackedEvents(page)).toEqual(expect.arrayContaining(["pwa_install_prompt_shown", "pwa_install_outcome"]));
  });

  test("Not now keeps the prompt away on later visits", async ({ page, context }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.goto("/send-money");
    await scrollUntilOffered(page);
    const prompt = installPrompt(page);
    await prompt.getByRole("button", { name: "Not now" }).click();
    await expect(prompt).toHaveCount(0);
    expect(await trackedEvents(page)).toContain("pwa_install_prompt_dismissed");

    // A new tab is a new session; the 30-day snooze still holds.
    const later = await context.newPage();
    await later.goto("/exchange-rates");
    await later.waitForTimeout(5_500);
    await expect(installPrompt(later)).toHaveCount(0);
  });

  test("a declined browser dialog also snoozes the prompt", async ({ page, context }) => {
    await offerInstallPrompt(context, "dismissed");
    await page.goto("/");
    await page.goto("/send-money");
    await scrollUntilOffered(page);
    const prompt = installPrompt(page);
    await prompt.getByRole("button", { name: "Install", exact: true }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("smc_pwa_dismissed_at"))).not.toBeNull();
  });

  // Regression (a27e148d7): focus stays in the amount field while the page
  // scrolls, and the first version refused the offer for good at that moment.
  test("a field left focused after scrolling away does not block the offer", async ({ page, context }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.goto("/send-money");
    const amount = page.locator("#transfer-amount");
    await amount.fill("2000");
    await expect(amount).toBeFocused();
    await scrollUntilOffered(page, page.locator('[data-pwa-install-slot="comparison-end"]'));
    await expect(amount).toBeFocused();
  });

  // Regression (a27e148d7): only the page's first slot was watched, so a reader
  // who skipped past the homepage slot never got the offer further down.
  test("a later slot still offers when the reader skipped the first", async ({ page, context }) => {
    await offerInstallPrompt(context, "accepted");
    // A returning visitor. (Visiting /guides first is not enough on the Pixel
    // profile: leaving before it hydrates never counts that view.)
    await context.addInitScript(() => localStorage.setItem("smc_pwa_views", "1"));
    await page.goto("/");
    await page.waitForTimeout(4_500); // past the dwell, still at the top: no slot in reach
    const end = page.locator('[data-pwa-install-slot="article-end"]');
    // Jump straight to the end-of-page slot. Near the top of the viewport, the
    // homepage slot is well outside the 200px reach (centring would pull it in).
    await expect(async () => {
      await end.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100));
      await expect(end.locator("[data-pwa-install-prompt]")).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 20_000 });
  });

  test("the prompt never stacks on the cookie banner", async ({ page, context, baseURL }) => {
    // A UK visitor who has not answered the consent banner yet.
    await context.addCookies([{ name: "geo-country", value: "GB", url: baseURL! }]);
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.goto("/send-money");
    await expect(page.getByRole("dialog", { name: "Cookie consent" })).toBeVisible();
    await page.waitForTimeout(5_500);
    await expect(installPrompt(page)).toHaveCount(0);
  });

  test("an install is counted even when it lands before hydration", async ({ page, context }) => {
    // Chromium fires appinstalled when the address-bar install finishes, which
    // can be while the page is still hydrating. CI's first run caught this
    // exact event being dropped. DOMContentLoaded is always before hydration.
    await context.addInitScript(() => {
      addEventListener("DOMContentLoaded", () => dispatchEvent(new Event("appinstalled")));
    });
    await page.goto("/");
    await expect.poll(() => trackedEvents(page)).toContain("pwa_installed");
    expect((await trackedEvents(page)).filter((e) => e === "pwa_installed")).toHaveLength(1);
  });

  test("once installed, the install entry points go away", async ({ page, context, isMobile }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.evaluate(() => {
      // What Chromium does after a successful install.
      window.__smcInstallPrompt = null;
      dispatchEvent(new Event("appinstalled"));
    });
    await expect.poll(() => trackedEvents(page)).toContain("pwa_installed");

    await page.addInitScript(() => {
      // Chromium stops offering a prompt once the app is installed.
      addEventListener("beforeinstallprompt", (e) => e.stopImmediatePropagation(), true);
    });
    await page.reload();
    if (isMobile) {
      await page.getByRole("button", { name: "Toggle menu" }).click();
      await expect(page.getByRole("button", { name: "Install the app" })).toHaveCount(0);
    } else {
      await expect(page.getByRole("button", { name: "Install app", exact: true })).toBeHidden();
    }
  });
});
