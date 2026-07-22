import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("anonymous public view does not bootstrap private session APIs", async ({ page }) => {
  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Войти" })).toBeVisible();

  expect(api.countRequests("/api/v1/auth/me")).toBe(0);
  expect(api.countRequests("/api/v1/notifications")).toBe(0);
});

test("authenticated header performs one initial session and notification request", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Создать объявление" })).toBeVisible();
  await expect.poll(() => api.countRequests("/api/v1/notifications")).toBe(1);

  expect(api.countRequests("/api/v1/auth/me")).toBe(1);
  expect(api.countRequests("/api/v1/notifications")).toBe(1);
});
