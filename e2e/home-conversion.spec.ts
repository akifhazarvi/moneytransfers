import { test, expect, trackedEventParams } from "./fixtures";

test("homepage comparison carries the amount into results", async ({ page }) => {
  await page.goto("/");
  const form = page.getByRole("form", { name: "Compare your transfer" });
  await expect(form).toContainText("Recipient gets · estimated");
  await form.getByRole("textbox", { name: "Amount to send" }).fill("2500");
  await form.getByRole("button", { name: "Compare transfers", exact: true }).click();
  // Route selections travel in the fragment, not a crawlable query (b2c4e6adf).
  await page.waitForURL(/\/send-money#.*amount=2500/);
  await expect.poll(() => trackedEventParams(page, "compare_search")).toEqual(expect.arrayContaining([
    expect.objectContaining({ amount: 2500 }),
  ]));
});

test("invalid amounts get useful feedback and can be corrected", async ({ page }) => {
  await page.goto("/");
  const form = page.getByRole("form", { name: "Compare your transfer" });
  const amount = form.getByRole("textbox", { name: "Amount to send" });
  await amount.fill("0");
  await form.getByRole("button", { name: "Compare transfers", exact: true }).click();
  await expect(form.getByRole("alert")).toContainText("Enter an amount between 1 and 1,000,000");
  await expect(amount).toHaveAttribute("aria-invalid", "true");
  await amount.fill("1000");
  await expect(form.getByRole("alert")).toHaveCount(0);
});

test("homepage gives larger transfers and business payments a clear path", async ({ page }) => {
  await page.goto("/");
  const paths = page.getByRole("region", { name: "Sending for something bigger?" });
  await expect(paths.getByRole("link", { name: /Moving a larger amount/ })).toHaveAttribute("href", "/guides/best-money-transfer-apps-large-transfers");
  await expect(paths.getByRole("link", { name: /Paying for your business/ })).toHaveAttribute("href", "/business");
  await expect(paths.getByRole("link", { name: /Understanding the real cost/ })).toHaveAttribute("href", "/guides/bank-vs-app-transfer-cost-2026");
});

test("a large transfer amount fits the narrow mobile comparison", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  const form = page.getByRole("form", { name: "Compare your transfer" });
  const response = page.waitForResponse(r => r.url().includes("/api/quotes?") && r.url().includes("amount=1000000"));
  await form.getByRole("textbox", { name: "Amount to send" }).fill("1000000");
  await response;
  await expect(form.locator(".home-receive-value")).toBeVisible();
  expect(await form.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
