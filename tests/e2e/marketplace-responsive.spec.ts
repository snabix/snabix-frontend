import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

const viewports = [
  { height: 800, name: "mobile-360", width: 360 },
  { height: 844, name: "mobile-390", width: 390 },
  { height: 1024, name: "tablet-768", width: 768 },
  { height: 900, name: "desktop-1440", width: 1440 },
] as const;

const routes = [
  { name: "home", path: "/", readyText: "Тестовый ноутбук" },
  { name: "category-listings", path: "/?categoryId=1", readyText: "Электроника" },
  { name: "listing-details", path: "/listings/listing-1", readyText: "Тестовый ноутбук" },
] as const;

const colorSchemes = ["light", "dark"] as const;

for (const viewport of viewports) {
  for (const colorScheme of colorSchemes) {
    for (const route of routes) {
      test(`${route.name} is responsive and accessible at ${viewport.name} in ${colorScheme}`, async ({ page }, testInfo) => {
        const api = new SnabixApiMock({ authenticated: false });
        await api.install(page);
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });

        await page.goto(route.path);
        await expect(page.getByText(route.readyText, { exact: true }).first()).toBeVisible();
        await page.evaluate(() => window.scrollTo(0, 0));

        const layout = await page.evaluate(() => {
          const viewportWidth = document.documentElement.clientWidth;
          const offenders = [...document.querySelectorAll<HTMLElement>("header *, main *")]
            .filter((element) => {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();

              if (
                style.display === "none"
                || style.visibility === "hidden"
                || Number(style.opacity) === 0
                || rect.width === 0
                || rect.height === 0
                || element.closest("[aria-hidden='true']")
                || element.closest("[data-horizontal-scroll]")
              ) {
                return false;
              }

              return rect.left < -1 || rect.right > viewportWidth + 1;
            })
            .slice(0, 10)
            .map((element) => ({
              className: element.className.toString().slice(0, 120),
              tag: element.tagName.toLowerCase(),
            }));

          return {
            documentWidth: document.documentElement.scrollWidth,
            offenders,
            viewportWidth,
          };
        });

        expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
        expect(layout.offenders).toEqual([]);

        const undersizedTargets = await page.evaluate(() => (
          [...document.querySelectorAll<HTMLElement>(
            "button, input, select, textarea, [role='button'], [data-touch-target]",
          )]
            .filter((element) => {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();

              return style.display !== "none"
                && style.visibility !== "hidden"
                && !element.closest("[aria-hidden='true']")
                && rect.width > 0
                && rect.height > 0
                && (rect.width < 24 || rect.height < 24);
            })
            .slice(0, 10)
            .map((element) => ({
              height: Math.round(element.getBoundingClientRect().height),
              name: element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 50),
              tag: element.tagName.toLowerCase(),
              width: Math.round(element.getBoundingClientRect().width),
            }))
        ));

        expect(undersizedTargets).toEqual([]);

        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const violations = axe.violations.map((violation) => ({
          help: violation.help,
          id: violation.id,
          impact: violation.impact,
          targets: violation.nodes.flatMap((node) => node.target).slice(0, 5),
        }));

        expect(violations).toEqual([]);

        await testInfo.attach(`${route.name}-${viewport.name}-${colorScheme}`, {
          body: await page.screenshot({ animations: "disabled", fullPage: false }),
          contentType: "image/png",
        });
      });
    }
  }
}
