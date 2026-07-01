import { expect, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

test("user reorders listing media, selects main image and deletes media", async ({ page }) => {
  const api = new SnabixApiMock();
  api.listing = {
    ...api.listing,
    imageUrl: "/snabix-black.png",
    imageUrls: ["/snabix-black.png", "/snabix-white.png"],
    media: [
      { id: 1, fileName: "black.png", isMain: true, order: 1, url: "/snabix-black.png" },
      { id: 2, fileName: "white.png", isMain: false, order: 2, url: "/snabix-white.png" },
    ],
  };
  await api.install(page);

  await page.goto("/account/listings/listing-1/edit");
  await expect(page.getByText("black.png")).toBeVisible();
  await expect(page.getByText("white.png")).toBeVisible();

  await page.getByRole("button", { name: "Сдвинуть фото левее" }).nth(1).click();
  await expect.poll(() => api.reorderedMediaIds.join(",")).toBe("2,1");

  await page.getByRole("button", { name: "Сделать фото главным" }).nth(1).click();
  await expect(page.getByText("Главное фото", { exact: true })).toBeVisible();
  expect(api.listing.media?.[0]?.id).toBe(1);

  await page.getByRole("button", { name: "Удалить фото" }).first().click();
  await expect(page.getByText("black.png")).toBeHidden();
  expect(api.listing.media?.map((media) => media.id)).toEqual([2]);
});
