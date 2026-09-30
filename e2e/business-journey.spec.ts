import { test, expect } from "./fixtures";

for (const [slug, workflow, title] of [
  ["small-business", "everyday", "Everyday business payments"],
  ["vendor-payments", "suppliers", "Pay overseas suppliers"],
  ["bulk-payments", "teams", "Pay a team or many recipients"],
  ["b2b-transfers", "planning", "Plan larger business transfers"],
]) {
  test(`business guide ${slug} continues into a relevant shortlist`, async ({ page }) => {
    await page.goto(`/business/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.getByRole("link", { name: "Compare providers for this workflow →", exact: true }).first().click();
    await page.waitForURL(`**/business/compare?workflow=${workflow}#finder`);
    await expect(page.getByRole("group", { name: "Payment workflow" }).getByRole("button", { name: title, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".business-needs button[aria-pressed=true]")).toHaveCount(2);
    await expect(page.locator("[data-business-provider]")).toHaveCount(7);
  });
}

test("business shortlist filters, clears and sorts measured costs", async ({ page }) => {
  await page.goto("/business/compare");
  await page.getByRole("checkbox", { name: "My company is outside the US" }).check();
  await expect(page.locator('[data-business-provider="mercury"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Clear selections", exact: true }).click();
  await expect(page.locator("[data-business-provider]")).toHaveCount(7);
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("cost");
  const values = await page.locator(".business-provider-cost strong").allTextContents();
  const numeric = values.filter(v => v.endsWith("%")).map(parseFloat);
  expect(numeric).toEqual([...numeric].sort((a,b) => a-b));
  await expect(page.locator(".business-cost-note")).toContainText("not quotes for your business");
});

test("feature detail cells are usable without a mouse hover", async ({ page }) => {
  await page.goto("/business/compare#matrix");
  const region = page.getByRole("region", { name: "Business feature comparison, scroll horizontally" });
  await expect(region).toHaveAttribute("tabindex", "0");
  const cell = region.locator("summary").first();
  await cell.focus();
  await page.keyboard.press("Enter");
  await expect(region.locator("details").first()).toHaveAttribute("open", "");
});

test("business hub separates TapTap sponsorship from benchmark evidence", async ({ page }) => {
  await page.goto("/business");
  const partner = page.getByRole("complementary", { name: "Sponsored: TapTap Send Business" });
  await expect(partner).toContainText("Paid partner placement");
  await expect(partner.getByRole("link", { name: /Explore business payments/ })).toHaveAttribute("href", "https://business.taptapsend.com/");
  await expect(page.getByRole("complementary", { name: "Business transfer cost benchmark" })).toContainText("not your quote");
  expect(await page.locator(".business-experience").evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test("comparison keeps the business sponsor outside the ranked shortlist", async ({ page }) => {
  await page.goto("/business/compare");
  const sponsor = page.getByRole("complementary", { name: "Sponsored: TapTap Send Business" });
  await expect(sponsor).toHaveCount(1);
  await expect(page.locator("[data-business-provider]")).toHaveCount(7);
  await expect(page.locator('.business-provider-results [aria-label="Sponsored: TapTap Send Business"]')).toHaveCount(0);
  await expect(sponsor.getByRole("link", { name: /Explore business payments/ })).toHaveAttribute("href", "https://business.taptapsend.com/");
});

 test("Regency FX appears once with evidenced planning features and source links", async ({ page }) => {
  await page.goto("/business/compare?workflow=planning");
  const card = page.locator('[data-business-provider="regencyfx"]');
  await expect(card).toHaveCount(1);
  await expect(card).toContainText("2/2 fully supported");
  await expect(card).toContainText("Quote needed");
  await expect(card.getByRole("link", { name: /Visit Regency FX/ })).toHaveAttribute("href", /go\/regencyfx/);
  await expect(page.locator("#regencyfx").getByRole("link", { name: "Business services", exact: true })).toHaveAttribute("href", "https://www.regencyfx.com/business");
  await expect(page.getByRole("button", { name: /Bulk \/ batch payments/ })).toBeVisible();
  await page.getByRole("button", { name: /Bulk \/ batch payments/ }).click();
  await expect(card).toContainText("Not verified");
 });
