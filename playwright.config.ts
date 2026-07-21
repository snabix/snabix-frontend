import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3000);
const apiPort = Number(process.env.E2E_API_PORT ?? 4010);
const baseURL = `http://localhost:${port}`;
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const distDir = process.env.E2E_DIST_DIR?.trim() || ".next";

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  outputDir: "test-results/e2e",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests/e2e",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: `E2E_API_PORT=${apiPort} node tests/e2e/fixtures/server-api.mjs`,
      reuseExistingServer: false,
      timeout: 30_000,
      url: `${apiOrigin}/health`,
    },
    {
      command: `NEXT_DIST_DIR=${distDir} NEXT_PUBLIC_API_URL=${apiOrigin}/api/v1 npm run dev -- --port ${port}`,
      reuseExistingServer: false,
      timeout: 120_000,
      url: baseURL,
    },
  ],
});
