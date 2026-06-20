import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user favorites a listing and filters by region and city", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/");
  await expect(page.getByText("Тестовый ноутбук")).toBeVisible();

  await page.getByRole("button", { name: "Добавить объявление в избранное" }).click();
  await expect(page.getByRole("button", { name: "Удалить объявление из избранного" })).toBeVisible();
  expect(api.favorite).toBe(true);

  await page.getByRole("button", { name: "Фильтры", exact: true }).click();
  await page.getByPlaceholder("Регион, например Краснодарский край").fill("Московская область");
  await page.getByPlaceholder("Город, например Краснодар").fill("Москва");

  await expect.poll(() => api.lastPublicQuery.get("regionQuery")).toBe("Московская область");
  await expect.poll(() => api.lastPublicQuery.get("cityQuery")).toBe("Москва");
});

test("favorite listing is available in the account section", async ({ page }) => {
  const api = new SnabixApiMock();
  api.favorite = true;
  await api.install(page);

  await page.goto("/account/favorites");

  await expect(page.getByText("Тестовый ноутбук")).toBeVisible();
  await expect(page.getByRole("button", { name: "Удалить объявление из избранного" })).toBeVisible();
});
