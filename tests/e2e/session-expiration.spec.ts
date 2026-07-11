import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

const privateRoutes = [
  "/account/profile",
  "/account/listings",
  "/account/listings/create",
  "/account/favorites",
  "/account/settings/profile",
  "/account/settings/account",
  "/account/settings/notifications",
  "/account/settings/addresses",
  "/account/settings/privacy",
  "/account/settings/sessions",
];

for (const route of privateRoutes) {
  test(`redirects expired session from ${route}`, async ({ page }) => {
    const api = new SnabixApiMock({ authenticated: false });
    await api.install(page);

    await page.goto(route);

    await expect(page).toHaveURL(
      new RegExp(`/sign-in\\?redirectTo=${encodeURIComponent(route)}`),
    );
    await expect(page.getByRole("heading", { name: "Вход" })).toBeVisible();
  });
}

test("redirects when a private request fails with csrf expiration", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/account/listings");
  await expect(page.getByRole("heading", { name: /Управляйте объявлениями/ })).toBeVisible();

  api.authenticated = false;
  api.unauthorizedStatus = 419;

  await page.getByLabel("Фильтр по статусу объявления").selectOption("1");

  await expect(page).toHaveURL(/\/sign-in\?redirectTo=%2Faccount%2Flistings/);
  await expect(page.getByRole("heading", { name: "Вход" })).toBeVisible();
});

test("redirects from favorite mutation when session expires", async ({ page }) => {
  const api = new SnabixApiMock();
  api.favorite = true;
  await api.install(page);

  await page.goto("/account/favorites");
  await expect(page.getByText("Тестовый ноутбук")).toBeVisible();

  api.authenticated = false;
  api.unauthorizedStatus = 419;

  await page.getByRole("button", { name: "Удалить объявление из избранного" }).click();

  await expect(page).toHaveURL(/\/sign-in\?redirectTo=%2Faccount%2Ffavorites/);
  await expect(page.getByRole("heading", { name: "Вход" })).toBeVisible();
});
