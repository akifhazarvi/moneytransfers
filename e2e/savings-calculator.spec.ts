import { test, expect } from "@playwright/test";

const path = "/guides/how-much-can-you-save-comparing-money-transfers";

// The result is always labelled with the amount its quotes were priced for: while
// new quotes load it dims rather than disappears, so the Send buttons and the
// TapTap card stay in view (both are conversion surfaces; see CLAUDE.md).
test("savings estimates never relabel stale quotes and recover from failed requests", async ({ page }) => {
  await page.goto(path);
  const amount = page.locator("#sc-amount");
  const calculator = page.locator(".not-prose").filter({ has: amount });
  const ranking = calculator.getByText(/Top of our comparison for/);
  const partner = calculator.locator('aside[aria-label="Sponsored: TapTap Send"]');
  await expect(ranking).toBeVisible();

  await amount.fill("0");
  await expect(calculator.getByText(/Enter an amount between/)).toBeVisible();
  await expect(ranking).toContainText("$1,000");
  await expect(partner).toBeVisible();

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
  await expect(calculator.getByText(/We could not load quotes/)).toBeVisible();
  await expect(ranking).toHaveCount(0);
  await expect(partner).toBeVisible();
  fail = false;
  await calculator.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(ranking).toContainText("$500");
  await expect(calculator.getByText("+600 INR", { exact: true })).toBeVisible();
  await page.locator("#sc-freq").selectOption("1");
  await expect(calculator.getByText("+50 INR", { exact: true }).first()).toBeVisible();
  await expect(calculator.getByRole("link", { name: /See all 3 providers/ })).toHaveAttribute("href", "/send-money?from=USD&to=INR&amount=500");
});
