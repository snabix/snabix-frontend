import { chromium, devices } from "@playwright/test";

const targetUrl = process.env.PUBLIC_STOREFRONT_URL?.trim();

if (!targetUrl) {
  console.error(
    "PUBLIC_STOREFRONT_URL is required, for example https://staging.example.com/.",
  );
  process.exit(2);
}

const budget = {
  apiRequests: Number(process.env.PUBLIC_BUDGET_API_REQUESTS ?? 4),
  jsBytes: Number(process.env.PUBLIC_BUDGET_JS_BYTES ?? 250 * 1024),
  lcpMs: Number(process.env.PUBLIC_BUDGET_LCP_MS ?? 2_500),
  ttfbMs: Number(process.env.PUBLIC_BUDGET_TTFB_MS ?? 500),
};
const mobileDevice = { ...devices["Pixel 7"] };
delete mobileDevice.defaultBrowserType;
const browser = await chromium.launch();
const context = await browser.newContext(mobileDevice);
const page = await context.newPage();
let browserApiRequests = 0;

page.on("request", (request) => {
  if (request.url().includes("/api/")) {
    browserApiRequests += 1;
  }
});

await page.addInitScript(() => {
  window.__snabixLargestContentfulPaint = 0;

  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries.at(-1);

    if (lastEntry) {
      window.__snabixLargestContentfulPaint = lastEntry.startTime;
    }
  }).observe({ buffered: true, type: "largest-contentful-paint" });
});

try {
  const response = await page.goto(targetUrl, {
    timeout: 30_000,
    waitUntil: "networkidle",
  });

  if (!response?.ok()) {
    throw new Error(`Storefront returned HTTP ${response?.status() ?? "unknown"}.`);
  }

  await page.waitForTimeout(1_000);

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const scripts = resources.filter((entry) => entry.initiatorType === "script");
    const jsBytes = scripts.reduce(
        (total, entry) =>
          total + (entry.transferSize || entry.encodedBodySize || 0),
        0,
      );

    return {
      jsBytes,
      jsResources: scripts
        .map((entry) => ({
          bytes: entry.transferSize || entry.encodedBodySize || 0,
          path: new URL(entry.name).pathname,
        }))
        .sort((left, right) => right.bytes - left.bytes),
      lcpMs: window.__snabixLargestContentfulPaint,
      ttfbMs: navigation.responseStart - navigation.requestStart,
    };
  });
  const measured = {
    ...metrics,
    apiRequests: browserApiRequests,
  };
  const failures = [
    ["TTFB", measured.ttfbMs, budget.ttfbMs, "ms"],
    ["LCP", measured.lcpMs, budget.lcpMs, "ms"],
    ["JavaScript", measured.jsBytes, budget.jsBytes, "bytes"],
    ["Browser API requests", measured.apiRequests, budget.apiRequests, ""],
  ].filter(([, actual, limit]) => actual > limit);
  const missingMetrics = [
    ["TTFB", measured.ttfbMs],
    ["LCP", measured.lcpMs],
    ["JavaScript", measured.jsBytes],
  ].filter(([, actual]) => actual <= 0);

  console.table({
    "Browser API requests": {
      budget: budget.apiRequests,
      measured: measured.apiRequests,
      unit: "requests",
    },
    JavaScript: {
      budget: budget.jsBytes,
      measured: measured.jsBytes,
      unit: "bytes",
    },
    LCP: {
      budget: budget.lcpMs,
      measured: Math.round(measured.lcpMs),
      unit: "ms",
    },
    TTFB: {
      budget: budget.ttfbMs,
      measured: Math.round(measured.ttfbMs),
      unit: "ms",
    },
  });
  console.table(
    measured.jsResources.map((resource) => ({
      bytes: resource.bytes,
      resource: resource.path,
    })),
  );

  if (missingMetrics.length > 0) {
    for (const [name] of missingMetrics) {
      console.error(`${name}: metric was not recorded.`);
    }
  }

  if (failures.length > 0) {
    for (const [name, actual, limit, unit] of failures) {
      console.error(`${name}: ${Math.round(actual)}${unit} exceeds ${limit}${unit}.`);
    }
  }

  if (missingMetrics.length > 0 || failures.length > 0) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
