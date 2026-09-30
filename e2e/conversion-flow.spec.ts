import { test, expect, installPrompt, offerInstallPrompt, runAsInstalledApp, trackedEventParams } from "./fixtures";

test("install promotion leaves the transfer form clear, then appears after results", async ({ page, context }) => {
  await offerInstallPrompt(context);
  await page.goto("/");
  await page.goto("/send-money");
  await page.locator("#transfer-amount").fill("1000");
  await page.waitForTimeout(5_500);
  await expect(installPrompt(page)).toHaveCount(0);
  await page.locator("#transfer-amount").blur();
  await page.locator('[data-pwa-install-slot="comparison-end"]').scrollIntoViewIfNeeded();
  await expect(installPrompt(page)).toBeVisible();
  // In flow: static, or relative on mobile (anchors the icon) — never fixed/sticky.
  expect(await installPrompt(page).evaluate(el => getComputedStyle(el).position)).toMatch(/^(?:static|relative)$/);
  await expect.poll(() => trackedEventParams(page, "pwa_install_prompt_shown")).toEqual([
    expect.objectContaining({ placement: "comparison-end" }),
  ]);
});

test("installed navigation returns to comparison and identifies app searches", async ({ page, context }) => {
  await runAsInstalledApp(context);
  await page.goto("/send-money");
  const navigation = page.getByRole("navigation", { name: "App navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Compare", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.locator("[data-pwa-install-button]")).toBeHidden();
  await page.getByRole("button", { name: "Compare transfers" }).click();
  await expect.poll(() => trackedEventParams(page, "compare_search")).toEqual([
    expect.objectContaining({ display_mode: "standalone" }),
  ]);
  await navigation.getByRole("link", { name: "Rates", exact: true }).click();
  await page.waitForURL("**/exchange-rates", { timeout: 30_000 });
  await expect(navigation.getByRole("link", { name: "Rates", exact: true })).toHaveAttribute("aria-current", "page");
  await navigation.getByRole("link", { name: "Compare", exact: true }).click();
  await expect(page.locator("#transfer-amount")).toBeVisible();
});

test("connection loss explains the next step without covering app navigation", async ({ page, context }) => {
  await runAsInstalledApp(context);
  await page.goto("/send-money");
  await expect(page.getByRole("navigation", { name: "App navigation" })).toBeVisible();
  await context.setOffline(true);
  const notice = page.locator("[data-pwa-offline-notice]");
  await expect(notice).toContainText("Connect to refresh quotes and continue to a provider");
  const navBox = await page.getByRole("navigation", { name: "App navigation" }).boundingBox();
  const noticeBox = await notice.boundingBox();
  expect(noticeBox!.y).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
  await context.setOffline(false);
  await expect(notice).toHaveCount(0);
});

test("a sponsored result follows the first comparison result", async ({ page }) => {
  await page.goto("/send-money?from=USD&to=INR&amount=1000");
  await expect(page.locator(".conversion-results > .conversion-result").first()).toBeVisible();
  await page.getByRole("button", { name: "Best value", exact: true }).click();
  await page.getByRole("option", { name: "Lowest fees", exact: true }).click();
  const results = page.locator(".conversion-results");
  await expect(results.locator(":scope > .conversion-spotlight")).toHaveCount(1);
  expect(await results.evaluate(el => el.firstElementChild?.classList.contains("conversion-result"))).toBe(true);
  await expect(results.locator(":scope > .conversion-spotlight")).toContainText("Sponsored");
});
