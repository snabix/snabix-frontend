import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user terminates another account session", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/account/settings/sessions");
  await expect(page.getByText("MacBook Pro")).toBeVisible();
  await expect(page.getByText("iPhone")).toBeVisible();

  await page.getByLabel("Завершить сеанс iPhone").click();
  await page.getByRole("dialog", { name: "Завершить этот сеанс?" })
    .getByRole("button", { name: "Завершить сеанс" })
    .click();

  await expect(page.getByText("Сеанс завершен.")).toBeVisible();
  await expect(page.getByText("iPhone")).toBeHidden();
  expect(api.terminatedSessionIds).toContain("session-mobile");
});

test("user terminates all other account sessions", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/account/settings/sessions");
  await page.getByRole("button", { name: "Завершить остальные сеансы" }).click();
  await page.getByRole("dialog", { name: "Завершить остальные сеансы?" })
    .getByRole("button", { name: "Завершить остальные" })
    .click();

  await expect(page.getByText("Остальные сеансы завершены.")).toBeVisible();
  await expect(page.getByText("iPhone")).toBeHidden();
  expect(api.terminatedOtherSessions).toBe(true);
});
