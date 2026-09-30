import type { Page } from "@playwright/test";
import { test, expect, installPrompt, offerInstallPrompt, trackedEvents } from "./fixtures";

// Chromium browsers (desktop Chrome/Edge, Android Chrome): the install flow
// the browser API makes possible. Runs on the desktop and Android projects.

/** The "Install" entry point a visitor can reach on this form factor. */
async function clickInstallEntry(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("button", { name: "Install the app" }).click();
  } else {
    await page.getByRole("button", { name: "Install the SendMoneyCompare app" }).click();
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

  test("the prompt waits for a second page view, sits clear of the Send bars, and installs", async ({ page, context }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.waitForTimeout(5_500);
    await expect(installPrompt(page), "never on the landing page view").toHaveCount(0);

    await page.goto("/send-money");
    const prompt = installPrompt(page);
    await expect(prompt).toBeVisible({ timeout: 15_000 });
    await expect(prompt).toContainText("Install the SendMoneyCompare app");

    // Docked in the top half: the bottom belongs to StickyBestCTA & co.
    const box = await prompt.boundingBox();
    const viewport = page.viewportSize();
    expect(box && viewport && box.y + box.height).toBeLessThan((viewport?.height ?? 0) / 2);

    await prompt.getByRole("button", { name: "Install", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__installPromptCalls)).toBe(1);
    await expect(prompt).toHaveCount(0);
    expect(await trackedEvents(page)).toEqual(expect.arrayContaining(["pwa_install_prompt_shown", "pwa_install_outcome"]));
  });

  test("Not now keeps the prompt away on later visits", async ({ page, context }) => {
    await offerInstallPrompt(context, "accepted");
    await page.goto("/");
    await page.goto("/send-money");
    const prompt = installPrompt(page);
    await expect(prompt).toBeVisible({ timeout: 15_000 });
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
    const prompt = installPrompt(page);
    await expect(prompt).toBeVisible({ timeout: 15_000 });
    await prompt.getByRole("button", { name: "Install", exact: true }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("smc_pwa_dismissed_at"))).not.toBeNull();
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
      await expect(page.getByRole("button", { name: "Install the SendMoneyCompare app" })).toBeHidden();
    }
  });
});
