import { test, expect, trackedEventParams } from "./fixtures";

test("manual rate checks update the counter and record one interaction", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/rates", async (route) => {
    requests++;
    await route.fulfill({ json: { rates: { USD: 1, GBP: 0.75, PKR: 280, INR: 84 }, timestamp: Date.now() } });
  });
  await page.goto("/send-money?from=GBP&to=PKR&amount=1000");
  const status = page.getByRole("region", { name: "Comparison status" });
  await expect(status.getByRole("status")).toHaveText("Comparison ready");
  await expect(status.locator(".comparison-status-clock")).toContainText(/4:5\d|5:00/);
  const before = requests;
  await status.getByRole("button", { name: "Refresh rates" }).click();
  await expect.poll(() => requests).toBeGreaterThan(before);
  await expect(status.getByRole("status")).toHaveText("Comparison ready");
  await expect.poll(() => trackedEventParams(page, "tool_used")).toEqual([
    expect.objectContaining({ tool: "comparison_refresh", cta_source: "comparison_status", corridor: "GBP-PKR" }),
  ]);
});

test("failed checks offer retry and offline status disables refresh", async ({ page, context }) => {
  await page.route("**/api/rates", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/send-money?from=GBP&to=PKR&amount=1000");
  const status = page.getByRole("region", { name: "Comparison status" });
  await expect(status.getByRole("status")).toHaveText("Check unavailable");
  await expect(status.getByRole("button", { name: "Refresh rates" })).toBeEnabled();
  await context.setOffline(true);
  await expect(status.getByRole("status")).toHaveText("Offline");
  await expect(status.getByRole("button", { name: "Refresh rates" })).toBeDisabled();
});
