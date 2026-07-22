import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user favorites a listing and filters by region and city", async ({ page }) => {
  const api = new SnabixApiMock();
  await api.install(page);

  await page.goto("/");
  await expect(page.getByText("Тестовый ноутбук")).toBeVisible();

  await page.getByRole("button", { name: "Добавить объявление в избранное" }).click();
  await expect(page.getByRole("button", { name: "Удалить объявление из избранного" })).toBeVisible();
  await expect.poll(() => api.favorite).toBe(true);

  await page.getByRole("button", { name: "Фильтры", exact: true }).click();
  await page.getByPlaceholder("Регион, например Краснодарский край").fill("Московская область");
  await page.getByPlaceholder("Город, например Краснодар").fill("Москва");
  await page.getByLabel("Торг уместен").click();

  await expect.poll(() => api.lastPublicQuery.get("regionQuery")).toBe("Московская область");
  await expect.poll(() => api.lastPublicQuery.get("cityQuery")).toBe("Москва");
  await expect.poll(() => api.lastPublicQuery.get("isNegotiable")).toBe("true");

  api.listing = { ...api.listing, isNegotiable: false };
  await page.getByPlaceholder("Город, например Краснодар").fill("Сочи");
  await expect.poll(() => api.lastPublicQuery.get("cityQuery")).toBe("Сочи");
  await expect(page.getByText("Тестовый ноутбук")).not.toBeVisible();
});

test("favorite listing is available in the account section", async ({ page }) => {
  const api = new SnabixApiMock();
  api.favorite = true;
  await api.install(page);

  await page.goto("/account/favorites");

  await expect(page.getByText("Тестовый ноутбук")).toBeVisible();
  await expect(page.getByRole("button", { name: "Удалить объявление из избранного" })).toBeVisible();
});

test("filter dialog contains and restores keyboard focus", async ({ page }) => {
  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);
  await page.setViewportSize({ height: 800, width: 360 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Фильтры", exact: true });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Фильтры объявлений" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((element) => (
    element.contains(document.activeElement)
  ))).toBe(true);

  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
