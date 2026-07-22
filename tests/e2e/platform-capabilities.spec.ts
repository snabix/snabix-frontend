import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("account settings expose only implemented commands", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/account/settings/account");

  await expect(page.getByRole("heading", { name: "Тема интерфейса" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Деактивировать" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Удалить аккаунт" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Язык и регион" })).toHaveCount(0);
});

test("disabled seller profile capability returns a real not found page", async ({ page }) => {
  await page.goto("/sellers/test-seller");

  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByText("Страница не найдена")).toBeVisible();
});
