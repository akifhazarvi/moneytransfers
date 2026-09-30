import { test, expect, installPrompt } from "./fixtures";

// iPhone Safari has no install API. The flow is: we offer, the visitor taps
// "Show me how", and the dialog walks them through Share → Add to Home Screen.

test.describe("install on iPhone", () => {
  test("the menu's Install the app shows the Add to Home Screen steps", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("button", { name: "Install the app" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Add SendMoneyCompare to your Home Screen");
    await expect(dialog).toContainText("Add to Home Screen");
    await expect(dialog.locator("ol li")).toHaveCount(3);
  });

  test("the prompt offers the steps on the second page view", async ({ page }) => {
    await page.goto("/");
    await page.goto("/exchange-rates");
    const prompt = installPrompt(page);
    await expect(prompt).toContainText("Add SendMoneyCompare to your Home Screen", { timeout: 15_000 });

    await prompt.getByRole("button", { name: "Show me how" }).click();
    await expect(prompt).toHaveCount(0);
    await expect(page.getByRole("dialog")).toContainText("Share");
  });
});

test.describe("install on iPhone, in Chrome", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/139.0.7258.76 Mobile/15E148 Safari/604.1",
  });

  test("gets the same Share-sheet route, with Safari as the fallback", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("button", { name: "Install the app" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Add to Home Screen");
    await expect(dialog).toContainText("open this page in Safari");
  });
});
