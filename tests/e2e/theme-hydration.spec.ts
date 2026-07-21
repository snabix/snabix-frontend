import { expect, test, type Page } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

type ConsoleIssue = {
  source: "console" | "pageerror";
  text: string;
};

const hydrationWarningPattern =
  /hydration|hydrated|server rendered html didn't match|script tag while rendering react component|scripts inside react components are never executed/i;

for (const testCase of [
  {
    colorScheme: "dark" as const,
    expectedTheme: "light" as const,
    mode: "light" as const,
  },
  {
    colorScheme: "light" as const,
    expectedTheme: "dark" as const,
    mode: "dark" as const,
  },
]) {
  test(`${testCase.mode} theme hydrates without hidden mismatches`, async ({
    page,
  }) => {
    const issues = collectConsoleIssues(page);

    await page.emulateMedia({ colorScheme: testCase.colorScheme });
    await seedThemeMode(page, testCase.mode);
    await page.goto("/");

    await expectTheme(page, testCase.mode, testCase.expectedTheme);
    await expect(page.getByText("Тестовый ноутбук")).toBeVisible();
    await assertNoHydrationIssues(page, issues);
  });
}

test("system theme follows the browser without hydration warnings", async ({
  page,
}) => {
  const issues = collectConsoleIssues(page);

  await page.emulateMedia({ colorScheme: "dark" });
  await seedThemeMode(page, "system");
  await page.goto("/");

  await expectTheme(page, "system", "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expectTheme(page, "system", "light");
  await assertNoHydrationIssues(page, issues);
});

test("CSS theme switcher toggles and persists the selected theme", async ({
  page,
}) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.emulateMedia({ colorScheme: "dark" });
  await seedThemeMode(page, "light");
  await page.goto("/account/settings/account");

  await page.getByRole("button", { name: "Включить темную тему" }).click();
  await expectTheme(page, "dark", "dark");
  await expect(page.getByRole("button", { name: "Включить светлую тему" })).toBeVisible();
  await expect.poll(() => page.evaluate(
    () => window.localStorage.getItem("snabix-theme-mode"),
  )).toBe("dark");
});

function collectConsoleIssues(page: Page): ConsoleIssue[] {
  const issues: ConsoleIssue[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      issues.push({
        source: "console",
        text: message.text(),
      });
    }
  });
  page.on("pageerror", (error) => {
    issues.push({
      source: "pageerror",
      text: error.message,
    });
  });

  return issues;
}

async function seedThemeMode(
  page: Page,
  mode: "dark" | "light" | "system",
): Promise<void> {
  await page.addInitScript((themeMode) => {
    window.localStorage.clear();
    window.localStorage.setItem("snabix-theme-mode", themeMode);

    if (themeMode !== "system") {
      window.localStorage.setItem("theme", themeMode);
    }
  }, mode);
}

async function expectTheme(
  page: Page,
  mode: "dark" | "light" | "system",
  theme: "dark" | "light",
): Promise<void> {
  const root = page.locator("html");

  await expect(root).toHaveAttribute("data-theme-mode", mode);
  await expect(root).toHaveAttribute("data-theme", theme);
  await expect(root).toHaveCSS("color-scheme", theme);
  await expect(root).toHaveClass(new RegExp(`(?:^|\\s)${theme}(?:\\s|$)`));
}

async function assertNoHydrationIssues(
  page: Page,
  issues: ConsoleIssue[],
): Promise<void> {
  await page.waitForTimeout(250);

  expect(
    issues.filter((issue) => hydrationWarningPattern.test(issue.text)),
  ).toEqual([]);
}
