import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("critical marketplace path from sign in to listing management", async ({ page }) => {
  test.setTimeout(60_000);

  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);

  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("user@snabix.test");
  await page.locator("#sign-in-password").fill("password");
  await page.getByRole("main").getByRole("button", { name: "Войти" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Открыть меню пользователя" })).toBeVisible();

  await page.goto("/account/listings/create");
  await page.getByLabel("Заголовок").fill("Критический ноутбук SNABIX");
  await page.getByLabel("Описание").fill("Сквозной e2e сценарий проверяет базовый путь продавца и покупателя.");
  await page.getByLabel("Цена").fill("99000");
  await page.getByLabel("Выберите подкатегорию").selectOption("11");
  await page.locator('input[type="file"]').setInputFiles({
    buffer: Buffer.from("critical-path-image"),
    mimeType: "image/png",
    name: "critical-listing.png",
  });
  await page.getByRole("button", { name: "Сохранить как черновик" }).click();

  await expect(page).toHaveURL(/\/account\/listings\/listing-1$/);
  await expect(page.getByRole("heading", { name: "Критический ноутбук SNABIX" })).toBeVisible();
  expect(api.lastListingPayload).toMatchObject({
    categoryId: "11",
    priceAmountMinor: 99000,
    saveAsDraft: true,
    title: "Критический ноутбук SNABIX",
  });
  expect(api.mediaUploads).toBe(1);

  await page.goto("/");
  await page.getByRole("button", { name: "Фильтры", exact: true }).click();
  await page.getByPlaceholder("Регион, например Краснодарский край").fill("Московская область");
  await page.getByPlaceholder("Город, например Краснодар").fill("Москва");

  await expect.poll(() => api.lastPublicQuery.get("regionQuery"), { timeout: 20_000 }).toBe("Московская область");
  await expect.poll(() => api.lastPublicQuery.get("cityQuery"), { timeout: 20_000 }).toBe("Москва");
  await expect(page.getByText("Критический ноутбук SNABIX")).toBeVisible();
  await page.getByLabel("Закрыть фильтры").click();

  await page.getByRole("button", { name: "Добавить объявление в избранное" }).click();
  await expect(page.getByRole("button", { name: "Удалить объявление из избранного" })).toBeVisible();
  await expect.poll(() => api.favorite).toBe(true);

  await page.goto("/account/favorites");
  await expect(page.getByText("Критический ноутбук SNABIX")).toBeVisible();

  await page.goto("/account/listings/listing-1");
  await page.getByRole("button", { name: "Открыть меню действий объявления" }).click();
  await page.getByRole("menuitem", { name: "Редактировать" }).click();
  await page.getByLabel("Заголовок").fill("Критический ноутбук SNABIX обновлен");
  await page.getByRole("button", { name: "Сохранить изменения" }).click();

  await expect(page).toHaveURL(/\/account\/listings\/listing-1$/);
  await expect(page.getByRole("heading", { name: "Критический ноутбук SNABIX обновлен" })).toBeVisible();

  await page.getByRole("button", { name: "Открыть меню действий объявления" }).click();
  await page.getByRole("menuitem", { name: "Архивировать" }).click();

  await expect(page.getByText("Объявление перенесено в архив.")).toBeVisible();
  expect(api.listing).toMatchObject({
    listingStatus: "archived",
    listingStatusLabel: "В архиве",
    title: "Критический ноутбук SNABIX обновлен",
  });
});
