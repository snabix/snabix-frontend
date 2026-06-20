import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user adds and saves a profile address", async ({ page }) => {
  const api = new SnabixApiMock({ addresses: [] });
  await api.install(page);

  await page.goto("/account/settings/addresses");
  await page.getByRole("button", { name: "Добавить первый адрес" }).click();

  const addressSection = page
    .getByRole("heading", { name: "Где вы размещаете объявления" })
    .locator("xpath=ancestor::section[1]");

  await addressSection.locator("select").nth(0).selectOption("77");
  await addressSection.locator("select").nth(1).selectOption("7701");
  await addressSection.getByPlaceholder("Например: ул. Ленина, 10").fill("ул. Новая, 15");
  await addressSection.getByPlaceholder("Дом, офис, склад").fill("Офис");
  await addressSection.getByRole("checkbox", { name: "Приоритетный адрес" }).click();
  await addressSection.getByRole("button", { name: "Сохранить адреса" }).click();

  await expect(page.getByText("Адреса профиля обновлены.")).toBeVisible();
  expect(api.lastAddressPayload).toMatchObject({
    addresses: [
      expect.objectContaining({
        addressLine: "ул. Новая, 15",
        cityId: 7701,
        isPrimary: true,
        label: "Офис",
        regionId: 77,
      }),
    ],
  });
});
