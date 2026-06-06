import { describe, expect, it } from "vitest";

describe("auth session helpers", () => {
  it("always checks session in cookie-first mode", async () => {
    const { shouldCheckCookieSession } = await import(
      "@/src/shared/lib/auth-session"
    );

    expect(shouldCheckCookieSession()).toBe(true);
  });

  it("can clear cookie session state without throwing", async () => {
    const { clearCookieSessionState } = await import(
      "@/src/shared/lib/auth-session"
    );

    expect(() => clearCookieSessionState()).not.toThrow();
  });
});
