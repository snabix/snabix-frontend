import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user opens header search and selects a recent query", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Открыть поиск" }).click();

  const searchInput = page.getByPlaceholder("Поиск");
  await expect(searchInput).toBeFocused();
  await expect(page.getByRole("heading", { name: "Недавние поисковые запросы" })).toBeVisible();

  await page.getByRole("button", { name: "Бетон М300" }).click();
  await expect(searchInput).toHaveValue("Бетон М300");

  await page.getByRole("button", { name: "Очистить поиск" }).click();
  await expect(searchInput).toHaveValue("");
});
