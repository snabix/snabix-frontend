import { beforeEach, describe, expect, it } from "vitest";
import {
  normalizeStoredThemeMode,
  persistThemeMode,
  readStoredThemeMode,
  resolveTheme,
} from "./theme-preference";

describe("theme preference", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("resolves explicit and system themes", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("migrates legacy manual and automatic modes", () => {
    expect(normalizeStoredThemeMode("manual", "dark")).toBe("dark");
    expect(normalizeStoredThemeMode("manual", null)).toBe("light");
    expect(normalizeStoredThemeMode("auto", "dark")).toBe("system");
  });

  it("uses a legacy explicit theme when no mode exists", () => {
    expect(normalizeStoredThemeMode(null, "dark")).toBe("dark");
    expect(normalizeStoredThemeMode(null, null)).toBe("system");
  });

  it("persists canonical modes without a stale legacy system value", () => {
    persistThemeMode(window.localStorage, "dark");

    expect(readStoredThemeMode(window.localStorage)).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    persistThemeMode(window.localStorage, "system");

    expect(readStoredThemeMode(window.localStorage)).toBe("system");
    expect(window.localStorage.getItem("theme")).toBeNull();
  });
});
