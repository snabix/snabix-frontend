import { beforeEach, describe, expect, it } from "vitest";
import {
  getMillisecondsUntilThemeChange,
  getTimeBasedTheme,
  markThemePreferenceAsManual,
  usesAutomaticTheme,
} from "./time-based-theme";

describe("time-based theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("uses the light theme during the day", () => {
    expect(getTimeBasedTheme(new Date(2026, 5, 22, 7))).toBe("light");
    expect(getTimeBasedTheme(new Date(2026, 5, 22, 18, 59))).toBe("light");
  });

  it("uses the dark theme during the night", () => {
    expect(getTimeBasedTheme(new Date(2026, 5, 22, 19))).toBe("dark");
    expect(getTimeBasedTheme(new Date(2026, 5, 22, 6, 59))).toBe("dark");
  });

  it("calculates the next theme boundary", () => {
    expect(getMillisecondsUntilThemeChange(new Date(2026, 5, 22, 18, 30))).toBe(30 * 60 * 1_000);
    expect(getMillisecondsUntilThemeChange(new Date(2026, 5, 22, 23))).toBe(8 * 60 * 60 * 1_000);
  });

  it("keeps a manual preference", () => {
    expect(usesAutomaticTheme()).toBe(true);

    markThemePreferenceAsManual();

    expect(usesAutomaticTheme()).toBe(false);
  });
});
