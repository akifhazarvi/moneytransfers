import { test, expect, installPrompt, runAsInstalledApp, trackedEvents } from "./fixtures";

// Desktop paths that are not Chromium's prompt: Safari's Add to Dock, a
// browser that cannot install, and the installed app itself.

const MAC_SAFARI =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15";
const FIREFOX = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0";

test.describe("Safari on macOS", () => {
  test.use({ userAgent: MAC_SAFARI });

  test("Install explains File → Add to Dock", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Install the SendMoneyCompare app" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Add SendMoneyCompare to your Dock");
    await expect(dialog).toContainText("Add to Dock");
  });

  test("the prompt offers the steps on a later page view", async ({ page }) => {
    await page.goto("/");
    await page.goto("/exchange-rates");
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
    await expect(page.getByRole("button", { name: "Install the SendMoneyCompare app" })).toBeHidden();
    await page.waitForTimeout(5_500);
    await expect(installPrompt(page)).toHaveCount(0);
  });
});

test.describe("inside the installed app", () => {
  test("records the launch once per session and offers nothing to install", async ({ page, context }) => {
    await runAsInstalledApp(context);
    await page.goto("/");
    await expect.poll(() => trackedEvents(page)).toContain("pwa_launch");
    await expect(page.getByRole("button", { name: "Install the SendMoneyCompare app" })).toBeHidden();

    await page.goto("/exchange-rates");
    await page.waitForTimeout(5_500);
    expect(await trackedEvents(page)).not.toContain("pwa_launch");
    await expect(installPrompt(page)).toHaveCount(0);
  });
});
