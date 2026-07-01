import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user requests and confirms email verification code", async ({ page }) => {
  const api = new SnabixApiMock();
  api.user = {
    ...api.user,
    emailVerifiedAt: null,
  };
  await api.install(page);

  await page.goto("/account/profile");
  await page.getByRole("button", { name: "Подтвердить email" }).click();

  await expect(page.getByRole("dialog", { name: "Подтвердите email" })).toBeVisible();
  await page.getByRole("button", { name: "Отправить снова" }).click();
  await page.getByLabel("Цифра 1").fill("1");
  await page.getByLabel("Цифра 2").fill("2");
  await page.getByLabel("Цифра 3").fill("3");
  await page.getByLabel("Цифра 4").fill("4");
  await page.getByLabel("Цифра 5").fill("5");
  await page.getByLabel("Цифра 6").fill("6");
  await page.getByRole("button", { name: "Подтвердить" }).click();

  await expect(page.getByText("Email подтвержден.")).toBeVisible();
  await expect(page.getByText("Email подтвержден", { exact: true })).toBeVisible();
  expect(api.user.emailVerifiedAt).not.toBeNull();
});
