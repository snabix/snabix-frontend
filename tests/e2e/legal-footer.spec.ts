import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

const legalLinks = [
  { heading: "Политика конфиденциальности", label: "Конфиденциальность", url: /\/privacy$/ },
  { heading: "Доступность", label: "Доступность", url: /\/accessibility$/ },
  { heading: "Файлы cookie", label: "Файлы cookie", url: /\/cookies$/ },
  { heading: "Политика и положения", label: "Политика и положения", url: /\/policies$/ },
];

for (const link of legalLinks) {
  test(`footer opens ${link.label} legal page`, async ({ page }) => {
    const api = new SnabixApiMock({ authenticated: false });
    await api.install(page);

    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: link.label }).click();

    await expect(page).toHaveURL(link.url);
    await expect(page.getByRole("heading", { name: link.heading })).toBeVisible();
  });
}
