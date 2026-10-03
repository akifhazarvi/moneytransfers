import { test, expect } from "@playwright/test";

const path = "/guides/how-much-can-you-save-comparing-money-transfers";

test("savings estimates hide stale quotes and recover from failed requests", async ({ page }) => {
  await page.goto(path);
  const amount = page.locator("#sc-amount");
  const calculator = page.locator(".not-prose").filter({ has: amount });
  const ranking = calculator.getByText(/Top of our comparison for/);
  await expect(ranking).toBeVisible();

  await amount.fill("0");
  await expect(calculator.getByText(/Enter an amount between/)).toBeVisible();
  await expect(ranking).toHaveCount(0);
  await expect(calculator.locator('aside[aria-label="Sponsored: TapTap Send"]')).toHaveCount(0);

  let fail = true;
  await page.route("**/api/quotes?**", async (route) => {
    if (fail) return route.fulfill({ status: 503, json: { error: "Unavailable" } });
    return route.fulfill({ json: { quotes: [
      { providerSlug: "wise", receiveAmount: 1050, fee: 0, exchangeRate: 2.1 },
      { providerSlug: "remitly", receiveAmount: 1000, fee: 0, exchangeRate: 2 },
      { providerSlug: "xe", receiveAmount: 950, fee: 0, exchangeRate: 1.9 },
    ] } });
  });
  await amount.fill("500");
  await expect(ranking).toHaveCount(0);
  await expect(calculator.getByText(/We could not load quotes/)).toBeVisible();
  await expect(calculator.locator('aside[aria-label="Sponsored: TapTap Send"]')).toHaveCount(0);
  fail = false;
  await calculator.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(ranking).toBeVisible();
  await expect(calculator.getByText("+600 INR", { exact: true })).toBeVisible();
  await page.locator("#sc-freq").selectOption("1");
  await expect(calculator.getByText("+50 INR", { exact: true }).first()).toBeVisible();
  await expect(calculator.getByRole("link", { name: /See all 3 providers/ })).toHaveAttribute("href", "/send-money?from=USD&to=INR&amount=500");
});
