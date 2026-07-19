import { expect, test } from "@playwright/test";

test.describe("server-first public storefront", () => {
  test("initial HTML contains listing content without JavaScript", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");

    await expect(page.getByText("Популярные направления")).toBeVisible();
    await expect(page.getByText("Тестовый ноутбук")).toBeVisible();
    await expect(page.getByText(/75\s?000/)).toBeVisible();
    await expect(page.getByText("Электроника", { exact: true }).first()).toBeVisible();

    await context.close();
  });

  test("listing details generate metadata and render content on the server", async ({
    page,
  }) => {
    await page.goto("/listings/listing-1");

    await expect(page).toHaveTitle(/Тестовый ноутбук.*75\s?000.*SNABIX/);
    await expect(page.getByRole("heading", { name: "Тестовый ноутбук" })).toBeVisible();
    await expect(page.getByText("Описание тестового объявления для браузерного сценария.")).toBeVisible();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Тестовый ноутбук.*SNABIX/,
    );
  });

  test("category HTML and metadata come from the server category DTO", async ({
    page,
  }) => {
    await page.goto("/?categoryId=1");

    await expect(page.getByRole("heading", { name: "Электроника" })).toBeVisible();
    await expect(page.getByText("Тестовый ноутбук")).toBeVisible();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Электроника.*SNABIX/,
    );
  });

  test("server rendering never forwards browser cookies as favorite state", async ({
    context,
    page,
  }) => {
    await context.addCookies([{
      domain: "localhost",
      name: "snabix-session",
      path: "/",
      value: "another-user-session",
    }]);

    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "Добавить объявление в избранное" }),
    ).toBeVisible();
  });

  test("first render stays inside the public API request budget", async ({
    page,
  }) => {
    let browserApiRequests = 0;
    let browserPublicListingRequests = 0;

    page.on("request", (request) => {
      if (request.url().includes("/api/v1/")) {
        browserApiRequests += 1;
      }

      if (request.url().includes("/api/v1/public/listings")) {
        browserPublicListingRequests += 1;
      }
    });

    await page.goto("/");
    await expect(page.getByText("Тестовый ноутбук")).toBeVisible();

    expect(browserApiRequests).toBeLessThanOrEqual(2);
    expect(browserPublicListingRequests).toBe(0);
  });
});
