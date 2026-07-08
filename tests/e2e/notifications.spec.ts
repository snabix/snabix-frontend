import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user updates and resets notification settings", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/account/settings/notifications");
  await expect(page.getByRole("heading", { name: "Уведомления" })).toBeVisible();

  const favoriteRow = page
    .getByRole("heading", { name: "Добавление в избранное" })
    .locator("xpath=ancestor::article[1]");

  await favoriteRow.getByRole("switch", { name: "Email" }).click();
  await page.getByRole("button", { name: "Сохранить настройки" }).click();

  await expect(page.getByText("Настройки уведомлений сохранены.")).toBeVisible();
  expect(api.lastNotificationPreferencesPayload).toMatchObject({
    items: expect.arrayContaining([
      expect.objectContaining({
        emailEnabled: true,
        key: "listing.favorite.created",
        siteEnabled: true,
      }),
    ]),
  });

  await page.getByRole("button", { name: "Сбросить настройки" }).click();
  await expect(page.getByText("Настройки уведомлений сброшены.")).toBeVisible();
});

test("user reads and deletes notifications from the header feed", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Уведомления" }).click();
  await expect(page.getByText("Объявление добавили в избранное")).toBeVisible();

  await page.getByRole("button", { name: /Объявление добавили в избранное/ }).click();
  await expect.poll(() => api.notifications[0]?.isRead).toBe(true);

  const firstNotification = page.getByRole("article", {
    name: "Объявление добавили в избранное",
  });

  await firstNotification.getByRole("button", { name: "Удалить уведомление" }).click();
  await expect.poll(() => api.deletedNotificationIds).toContain("notification-1");
  await expect(page.getByText("Объявление добавили в избранное")).toBeHidden();

  await page.getByRole("button", { name: "Очистить все" }).click();
  await expect(page.getByText("Пока уведомлений нет.")).toBeVisible();
  expect(api.notifications).toHaveLength(0);
});
