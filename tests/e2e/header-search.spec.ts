import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user opens header search and clears the typed query", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Открыть поиск" }).click();

  const searchInput = page.getByPlaceholder("Поиск");
  await expect(searchInput).toBeFocused();
  await expect(page.getByRole("heading", { name: "Недавние поисковые запросы" })).toBeVisible();
  await expect(page.getByText("Недавние запросы появятся здесь после запуска поиска.")).toBeVisible();

  await searchInput.fill("Бетон М300");
  await expect(searchInput).toHaveValue("Бетон М300");

  await page.getByRole("button", { name: "Очистить поиск" }).click();
  await expect(searchInput).toHaveValue("");
});
