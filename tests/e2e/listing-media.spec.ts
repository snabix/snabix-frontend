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

  const blackMedia = page.getByText("black.png").locator("xpath=ancestor::article[1]");
  const whiteMedia = page.getByText("white.png").locator("xpath=ancestor::article[1]");

  await whiteMedia.getByRole("button", { name: "Сдвинуть фото левее" }).click();
  await expect.poll(() => api.reorderedMediaIds.join(",")).toBe("2,1");
  await expect(whiteMedia.getByText("Главное фото", { exact: true })).toBeVisible();

  await blackMedia.getByRole("button", { name: "Сделать фото главным" }).click();
  await expect(page.getByText("Главное фото", { exact: true })).toBeVisible();
  await expect.poll(() => api.listing.media?.[0]?.id).toBe(1);

  await blackMedia.getByRole("button", { name: "Удалить фото" }).click();
  await expect(page.getByText("black.png")).toBeHidden();
  await expect.poll(() => api.listing.media?.map((media) => media.id)).toEqual([2]);
});
