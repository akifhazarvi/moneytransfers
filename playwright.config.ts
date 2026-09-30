import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests for the installed app (PWA): manifest, service worker,
 * offline copy and the install flow on each platform.
 *
 *   npm run build && npm run test:e2e              # against `next start`
 *   E2E_BASE_URL=https://… npm run test:e2e        # against a deployment
 *
 * The service worker only registers in a production build, so there is no
 * `next dev` mode. CI (.github/workflows/e2e.yml) runs it against production.
 */
const PORT = Number(process.env.E2E_PORT ?? 3210);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /ios\.spec/,
    },
    {
      name: "android-chrome",
      use: { ...devices["Pixel 7"] },
      testIgnore: /manifest\.spec|desktop\.spec|ios\.spec/,
    },
    {
      // iOS has no install API: the flow is driven by the user agent (Safari
      // on iPhone), so Chromium with the iPhone descriptor exercises it fully.
      name: "iphone",
      use: { ...devices["iPhone 15"], browserName: "chromium" },
      testMatch: /ios\.spec/,
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
