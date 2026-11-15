import { test, expect } from "./fixtures";

test("developer sections fit phone, tablet and desktop widths in both themes", async ({ page }) => {
  await page.goto("/developers");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const dark of [false, true]) {
      await page.evaluate((value) => document.documentElement.classList.toggle("dark", value), dark);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const controls = page.locator("#demo select, #demo input, #waitlist select, #waitlist input:not([tabindex='-1'])");
      for (const control of await controls.all()) {
        const box = await control.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
});

test("direct plan links select a plan without opening the email keyboard", async ({ page }) => {
  for (const plan of ["developer", "business", "enterprise"]) {
    await page.goto(`/developers#join-${plan}`);
    await expect(page.locator("#wl-plan")).toHaveValue(plan);
    await expect(page.locator("#wl-email")).not.toBeFocused();
    await expect(page.locator("#wl-email")).toBeInViewport();
  }
});

test("demo validates amounts and identifies a response after controls change", async ({ page }) => {
  await page.goto("/developers");
  let requests = 0;
  await page.route("**/api/v1/quotes?**", async (route) => {
    requests++;
    await route.fulfill({ json: { query: { amount: 500.25 } } });
  });
  await page.locator("#pg-amount").fill("");
  await page.getByRole("button", { name: "Send request" }).click();
  expect(requests).toBe(0);
  await page.locator("#pg-amount").fill("500.25");
  await page.locator("#pg-amount").press("Enter");
  await expect(page.locator("#demo pre")).toContainText("500.25");
  await expect(page.locator("#demo")).not.toContainText("Request changed.");
  await page.getByRole("button", { name: "Rate history", exact: true }).click();
  await expect(page.locator("#demo")).toContainText("Request changed.");
  await expect(page.locator("#demo pre")).toContainText("500.25");
});

test("waitlist preserves answers on failure and confirms a successful retry", async ({ page }) => {
  await page.goto("/developers#join-business");
  await page.route("**/api/waitlist", (route) => route.fulfill({ status: 503, json: { error: "Please try again." } }));
  await page.locator("#wl-email").fill("developer@example.com");
  await page.locator("#wl-company").fill("Example project");
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page.locator("#waitlist").getByRole("alert")).toContainText("Please try again.");
  await expect(page.locator("#wl-company")).toHaveValue("Example project");
  await expect(page.getByRole("link", { name: "Send it to us by email instead" })).toHaveAttribute("href", /developer%40example.com/);
  await page.route("**/api/waitlist", (route) => route.fulfill({ json: { ok: true } }));
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page.locator("#waitlist [role=status]")).toContainText("You are on the list.");
});
