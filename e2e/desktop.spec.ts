import { test, expect, installPrompt, runAsInstalledApp, trackedEventParams, trackedEvents } from "./fixtures";

// Desktop paths that are not Chromium's prompt: Safari's Add to Dock, a
// browser that cannot install, and the installed app itself.

const MAC_SAFARI =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15";
const FIREFOX = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0";

test.describe("Safari on macOS", () => {
  test.use({ userAgent: MAC_SAFARI });

  test("Install explains File → Add to Dock", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Install app", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Add SendMoneyCompare to your Dock");
    await expect(dialog).toContainText("Add to Dock");
  });

  test("the prompt offers the steps on a later page view", async ({ page }) => {
    await page.goto("/");
    await page.goto("/exchange-rates");
    await page.waitForTimeout(5_500);
    await page.locator("[data-pwa-install-slot]").first().scrollIntoViewIfNeeded();
    const prompt = installPrompt(page);
    await expect(prompt).toContainText("Add SendMoneyCompare to your Dock", { timeout: 15_000 });
    await prompt.getByRole("button", { name: "Show me how" }).click();
    await expect(page.getByRole("dialog")).toContainText("File");
  });
});

test.describe("a browser that cannot install", () => {
  test.use({ userAgent: FIREFOX });

  test("shows no install button and no prompt", async ({ page }) => {
    await page.goto("/");
    await page.goto("/exchange-rates");
    // Rendered, so the header never shifts, but invisible.
    await expect(page.getByRole("button", { name: "Install app", exact: true })).toBeHidden();
    await page.waitForTimeout(5_500);
    await expect(installPrompt(page)).toHaveCount(0);
  });
});

test.describe("inside the installed app", () => {
  test("the first launch counts the install, then every session counts a launch", async ({ page, context }) => {
    await runAsInstalledApp(context);
    await page.goto("/");

    // Safari never fires appinstalled, so the first launch IS the install.
    await expect.poll(() => trackedEventParams(page, "pwa_installed")).toEqual([
      expect.objectContaining({ install_method: "first_launch", os: "windows" }),
    ]);
    await expect.poll(() => trackedEventParams(page, "pwa_launch")).toEqual([
      expect.objectContaining({ display_mode: "standalone", os: "windows" }),
    ]);
    await expect(page.getByRole("button", { name: "Install app", exact: true })).toBeHidden();

    // Same session, next page: neither counts again, and nothing is offered.
    await page.goto("/exchange-rates");
    await page.waitForTimeout(5_500);
    expect(await trackedEvents(page)).not.toContain("pwa_launch");
    expect(await trackedEvents(page)).not.toContain("pwa_installed");
    await expect(installPrompt(page)).toHaveCount(0);

    // A new session is a new launch, not a new install.
    const next = await context.newPage();
    await next.goto("/");
    await expect.poll(() => trackedEvents(next)).toContain("pwa_launch");
    expect(await trackedEvents(next)).not.toContain("pwa_installed");
  });

  test("a Chromium install already counted by appinstalled is not counted again", async ({ page, context }) => {
    await context.addInitScript(() => {
      // Set by PWA_INLINE when Chromium fired appinstalled in the browser tab;
      // the installed app shares that storage.
      try {
        localStorage.setItem("smc_pwa_installed", "1");
      } catch {
        // about:blank has no storage.
      }
    });
    await runAsInstalledApp(context);
    await page.goto("/");
    await expect.poll(() => trackedEvents(page)).toContain("pwa_launch");
    expect(await trackedEvents(page)).not.toContain("pwa_installed");
  });
});
