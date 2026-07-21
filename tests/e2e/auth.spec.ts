import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user signs in and reaches the marketplace", async ({ page }) => {
  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);

  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("user@snabix.test");
  await page.locator("#sign-in-password").fill("password");
  await page.getByRole("main").getByRole("button", { name: "Войти" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Открыть меню пользователя" })).toBeVisible();
  expect(api.authenticated).toBe(true);
});

test("user signs up and is redirected to sign in when auto-login is unavailable", async ({ page }) => {
  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill("anna@snabix.test");
  await page.getByLabel("Пароль", { exact: true }).fill("password123");
  await page.getByLabel("Повторите пароль").fill("password123");
  await page.getByRole("button", { name: "Создать аккаунт" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: "Вход" })).toBeVisible();
  expect(api.lastSignUpPayload).toMatchObject({
    email: "anna@snabix.test",
  });
});
