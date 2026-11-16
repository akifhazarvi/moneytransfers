import { test, expect, trackedEventParams } from "./fixtures";

test.use({ hasExtension: false });

test("navigation stays usable at narrow, tablet and desktop widths", async ({ page }) => {
  await page.goto("/developers");
  for (const width of [320, 390, 768, 1024, 1200, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width < 1200) {
      const toggle = page.getByRole("button", { name: "Toggle menu" });
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Developers · Data API" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
    } else {
      await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Developers" })).toHaveAttribute("aria-current", "page");
      await page.getByRole("button", { name: "Resources", exact: true }).click();
      await expect(page.locator("#header-resources").getByRole("link", { name: /Exchange rates/ })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator("#header-resources")).toHaveCount(0);
    }
  }
});

test("extension overview explains permissions, closes with Escape, and restores focus", async ({ page, isMobile }) => {
  await page.goto("/developers");
  if (isMobile) await page.getByRole("button", { name: "Toggle menu" }).click();
  const trigger = page.getByRole("button", { name: "Chrome extension", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Check a transfer before you send." });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Access to supported provider sites is optional");
  if (isMobile) {
    await expect(dialog).toContainText("on a computer");
    await expect(dialog.getByRole("button", { name: /^Add to/ })).toHaveCount(0);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the overview attributes store clicks and recognizes installation on return", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Desktop extension installation only");
  await context.route(/chromewebstore\.google\.com/, (route) => route.fulfill({ body: "Store preview" }));
  await page.goto("/developers");
  await page.getByRole("button", { name: "Chrome extension", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Check a transfer before you send." });
  const [store] = await Promise.all([
    context.waitForEvent("page"),
    dialog.getByRole("button", { name: /^Add to (Chrome|browser|Edge)$/ }).click(),
  ]);
  await store.waitForURL(/chromewebstore/);
  expect(new URL(store.url()).searchParams.get("utm_medium")).toBe("header_details");
  await store.close();
  await page.evaluate(() => {
    const target = window as Window & { chrome?: Record<string, unknown> };
    target.chrome = Object.assign(target.chrome ?? {}, {
      runtime: { sendMessage: (_id: string, _message: unknown, reply: (value: unknown) => void) => reply({ installed: true, version: "1.0.1" }) },
    });
    window.dispatchEvent(new Event("focus"));
  });
  await expect(dialog).toContainText("You already have the extension");
  await expect(dialog.getByRole("button", { name: /^Add to/ })).toHaveCount(0);
  await expect.poll(() => trackedEventParams(page, "extension_install_confirmed")).toEqual([expect.objectContaining({ placement: "header_details" })]);
});
