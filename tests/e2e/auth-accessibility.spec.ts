import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { SnabixApiMock } from "./fixtures/api-mock";

const authPages = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password?token=e2e-reset-token&email=user%40snabix.test",
];

for (const path of authPages) {
  test(`${path} has no critical axe violations`, async ({ page }) => {
    const api = new SnabixApiMock({ authenticated: false });
    await api.install(page);
    await page.goto(path);

    await expectNoCriticalAxeViolations(page);
  });
}

test("auth fields expose password-manager semantics and accessible errors", async ({
  page,
}) => {
  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);

  await page.goto("/sign-in");
  await expect(page.getByLabel("Email")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("Email")).toHaveAttribute(
    "autocomplete",
    "username",
  );
  await expect(page.getByLabel("Пароль", { exact: true })).toHaveAttribute(
    "autocomplete",
    "current-password",
  );

  await page.goto("/sign-up");
  await expect(page.getByLabel("Email")).toHaveAttribute(
    "autocomplete",
    "username",
  );
  await expect(page.getByLabel("Пароль", { exact: true })).toHaveAttribute(
    "autocomplete",
    "new-password",
  );
  await expect(page.getByLabel("Повторите пароль")).toHaveAttribute(
    "autocomplete",
    "new-password",
  );

  await page.getByRole("button", { name: "Создать аккаунт" }).click();

  const email = page.getByLabel("Email");
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");

  const emailErrorId = await email.getAttribute("aria-errormessage");
  expect(emailErrorId).toBeTruthy();
  await expect(page.locator(`#${emailErrorId}`)).toContainText("email");

  await page.goto("/forgot-password");
  await expect(page.getByLabel("Email")).toHaveAttribute(
    "autocomplete",
    "email",
  );

  await page.goto(
    "/reset-password?token=e2e-reset-token&email=user%40snabix.test",
  );
  await expect(page.getByLabel("Email")).toHaveAttribute(
    "autocomplete",
    "username",
  );
  await expect(page.getByLabel("Новый пароль")).toHaveAttribute(
    "autocomplete",
    "new-password",
  );
});

test("user completes sign-in using only the keyboard", async ({ page }) => {
  const api = new SnabixApiMock({ authenticated: false });
  await api.install(page);
  await page.goto("/sign-in");

  const email = page.getByLabel("Email");
  const password = page.getByLabel("Пароль", { exact: true });
  const showPassword = page.getByRole("button", { name: "Показать пароль" });
  const forgotPassword = page.getByRole("link", { name: "Забыли пароль?" });
  const submit = page.getByRole("main").getByRole("button", { name: "Войти" });

  await tabTo(page, email);
  await page.keyboard.type("user@snabix.test");
  await page.keyboard.press("Tab");
  await expect(password).toBeFocused();
  await page.keyboard.type("password");
  await page.keyboard.press("Tab");
  await expect(showPassword).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(forgotPassword).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(submit).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/$/);
  expect(api.authenticated).toBe(true);
});

test("privacy email and verification dialogs manage keyboard focus", async ({
  page,
}) => {
  const api = new SnabixApiMock();
  await api.install(page);
  await page.goto("/account/settings/privacy");

  const editEmail = page.getByRole("button", { name: "Редактировать Email" });

  await tabTo(page, editEmail);
  await page.keyboard.press("Enter");

  const emailDialog = page.getByRole("dialog", { name: "Изменить email" });
  const email = emailDialog.getByLabel("Email");

  await expect(email).toBeFocused();
  await expectNoCriticalAxeViolations(page, emailDialog);

  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.type("new-email@snabix.test");
  await page.keyboard.press("Enter");

  const verificationDialog = page.getByRole("dialog", {
    name: "Подтвердите email",
  });
  const firstCodeDigit = verificationDialog.getByRole("textbox", {
    name: "Цифра 1 из 6",
  });

  await expect(firstCodeDigit).toBeFocused();
  await expect(firstCodeDigit).toHaveAttribute(
    "autocomplete",
    "one-time-code",
  );
  await expectNoCriticalAxeViolations(page, verificationDialog);

  await page.keyboard.type("123456");
  await tabTo(
    page,
    verificationDialog.getByRole("button", { name: "Подтвердить" }),
  );
  await page.keyboard.press("Enter");

  await expect(verificationDialog).toBeHidden();
  await expect(editEmail).toBeFocused();
});

async function expectNoCriticalAxeViolations(
  page: Page,
  include?: Locator,
) {
  let builder = new AxeBuilder({ page });

  if (include) {
    builder = builder.include(await include.evaluate((element) => {
      if (!element.id) {
        element.id = "axe-test-scope";
      }

      return `#${CSS.escape(element.id)}`;
    }));
  }

  const results = await builder.analyze();
  const criticalViolations = results.violations
    .filter((violation) => violation.impact === "critical")
    .map((violation) => ({
      help: violation.help,
      id: violation.id,
      targets: violation.nodes.flatMap((node) => node.target),
    }));

  expect(criticalViolations).toEqual([]);
}

async function tabTo(page: Page, target: Locator, maxTabs = 40) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");

    if (await target.evaluate((element) => element === document.activeElement)) {
      return;
    }
  }

  throw new Error(`Element was not reached with Tab after ${maxTabs} attempts.`);
}
