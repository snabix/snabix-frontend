import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user creates a listing with media, edits it and archives it", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/account/listings/create");
  await page.getByLabel("Заголовок").fill("Ноутбук для e2e");
  await page.getByLabel("Описание").fill("Подробное описание объявления для сквозного теста.");
  await page.getByLabel("Цена").fill("85000");
  await page.getByLabel("Выберите подкатегорию").selectOption("11");
  await page.locator('input[type="file"]').setInputFiles({
    buffer: Buffer.from("e2e-image"),
    mimeType: "image/png",
    name: "listing.png",
  });
  await page.getByRole("button", { name: "Сохранить как черновик" }).click();

  await expect(page).toHaveURL(/\/account\/listings\/listing-1$/);
  await expect(page.getByRole("heading", { name: "Ноутбук для e2e" })).toBeVisible();
  expect(api.lastListingPayload).toMatchObject({
    saveAsDraft: true,
    title: "Ноутбук для e2e",
  });
  expect(api.mediaUploads).toBe(1);

  await page.getByRole("button", { name: "Открыть меню действий объявления" }).click();
  await page.getByRole("menuitem", { name: "Редактировать" }).click();
  await expect(page).toHaveURL(/\/edit$/);

  await page.getByLabel("Заголовок").fill("Обновленный ноутбук для e2e");
  await page.getByRole("button", { name: "Сохранить изменения" }).click();
  await expect(page).toHaveURL(/\/account\/listings\/listing-1$/);
  await expect(page.getByRole("heading", { name: "Обновленный ноутбук для e2e" })).toBeVisible();

  await page.getByRole("button", { name: "Открыть меню действий объявления" }).click();
  await page.getByRole("menuitem", { name: "Архивировать" }).click();
  await expect(page.getByText("Объявление перенесено в архив.")).toBeVisible();
  expect(api.listing).toMatchObject({
    listingStatus: "archived",
    listingStatusLabel: "В архиве",
  });
});
