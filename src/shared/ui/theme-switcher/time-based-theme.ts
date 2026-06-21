export type AppTheme = "dark" | "light";

const DAY_START_HOUR = 7;
const NIGHT_START_HOUR = 19;
const THEME_MODE_STORAGE_KEY = "snabix-theme-mode";
const NEXT_THEMES_STORAGE_KEY = "theme";

export function getTimeBasedTheme(date = new Date()): AppTheme {
  const hour = date.getHours();

  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? "light" : "dark";
}

export function getMillisecondsUntilThemeChange(date = new Date()): number {
  const nextBoundary = new Date(date);

  if (date.getHours() < DAY_START_HOUR) {
    nextBoundary.setHours(DAY_START_HOUR, 0, 0, 0);
  } else if (date.getHours() < NIGHT_START_HOUR) {
    nextBoundary.setHours(NIGHT_START_HOUR, 0, 0, 0);
  } else {
    nextBoundary.setDate(nextBoundary.getDate() + 1);
    nextBoundary.setHours(DAY_START_HOUR, 0, 0, 0);
  }

  return Math.max(nextBoundary.getTime() - date.getTime(), 0);
}

export function usesAutomaticTheme(): boolean {
  const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);

  if (storedMode === "manual") {
    return false;
  }

  if (storedMode === "auto") {
    return true;
  }

  // Preserve a theme explicitly selected before automatic mode was introduced.
  if (window.localStorage.getItem(NEXT_THEMES_STORAGE_KEY)) {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "manual");
    return false;
  }

  window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "auto");
  return true;
}

export function markThemePreferenceAsManual(): void {
  window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "manual");
}
