import { test, expect, offerInstallPrompt, installPrompt, trackedEventParams } from "./fixtures";

const pages = [
  ["/", "home-after-comparison", "Rates and transfer comparisons, one tap away."],
  ["/guides", "guides-library", "Guides and transfer comparisons, one tap away."],
  ["/guides/best-money-transfer-apps-large-transfers", "guide-after-reading", "Guides and transfer comparisons, one tap away."],
  ["/guides/bank-vs-app-transfer-cost-2026", "guide-research-end", "Guides and transfer comparisons, one tap away."],
  ["/business", "business-after-benchmark", "Business guides and comparisons, one tap away."],
  ["/business/small-business", "business-guide-end", "Business guides and comparisons, one tap away."],
  ["/business/compare", "business-after-finder", "Business guides and comparisons, one tap away."],
];

for (const [url, placement, copy] of pages) {
  test(`one contextual install banner on ${url}`, async ({ page, context }) => {
    await offerInstallPrompt(context);
    // A returning visitor, with the initial comparison/research already done.
    await context.addInitScript(() => localStorage.setItem("smc_pwa_views", "2"));
    await page.goto(url);
    await page.waitForTimeout(5_000);
    const slot = page.locator(`[data-pwa-install-slot="${placement}"]`);
    await slot.scrollIntoViewIfNeeded();
    const banner = installPrompt(page);
    await expect(banner).toHaveCount(1);
    await expect(banner).toContainText(copy);
    await expect(slot.locator("[data-pwa-install-prompt]")).toBeVisible();
    expect(await banner.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect(await banner.evaluate(el => getComputedStyle(el).position)).not.toBe("fixed");
    await expect.poll(() => trackedEventParams(page, "pwa_install_prompt_shown")).toEqual([
      expect.objectContaining({ placement }),
    ]);
    await banner.getByRole("button", { name: "Not now", exact: true }).click();
    await expect(banner).toHaveCount(0);
    await page.locator('[data-pwa-install-slot="article-end"]').scrollIntoViewIfNeeded();
    await expect(banner).toHaveCount(0);
  });
}
