import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

const legalLinks = [
  { heading: "Политика конфиденциальности", label: "Конфиденциальность", path: "/privacy", url: /\/privacy$/ },
  { heading: "Доступность", label: "Доступность", path: "/accessibility", url: /\/accessibility$/ },
  { heading: "Файлы cookie", label: "Файлы cookie", path: "/cookies", url: /\/cookies$/ },
  { heading: "Политика и положения", label: "Политика и положения", path: "/policies", url: /\/policies$/ },
];

for (const link of legalLinks) {
  test(`footer opens ${link.label} legal page`, async ({ page }) => {
    const api = new SnabixApiMock({ authenticated: false });
    await api.install(page);

    await page.goto("/");
    const footerLink = page.getByRole("contentinfo").getByRole("link", { name: link.label });
    const href = await footerLink.getAttribute("href");

    expect(href).toBe(link.path);
    await page.goto(link.path);
    await expect(page).toHaveURL(link.url);
    await expect(page.getByRole("heading", { name: link.heading })).toBeVisible();
  });
}
