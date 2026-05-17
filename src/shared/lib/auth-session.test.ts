import { describe, expect, it } from "vitest";

describe("auth session helpers", () => {
  it("always hydrates session in cookie-first mode", async () => {
    const { shouldHydrateSession } = await import("@/src/shared/lib/auth-session");

    expect(shouldHydrateSession()).toBe(true);
  });

  it("can clear auth session without throwing", async () => {
    const { clearAuthSession } = await import("@/src/shared/lib/auth-session");

    expect(() => clearAuthSession()).not.toThrow();
  });
});
