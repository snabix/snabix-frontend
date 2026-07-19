export type AppTheme = "dark" | "light";
export type ThemeMode = AppTheme | "system";

export const LEGACY_THEME_STORAGE_KEY = "theme";
export const THEME_MODE_STORAGE_KEY = "snabix-theme-mode";

type ThemeStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export function isAppTheme(value: string | null): value is AppTheme {
  return value === "dark" || value === "light";
}

export function normalizeStoredThemeMode(
  storedMode: string | null,
  legacyTheme: string | null,
): ThemeMode {
  if (
    storedMode === "dark"
    || storedMode === "light"
    || storedMode === "system"
  ) {
    return storedMode;
  }

  if (storedMode === "manual") {
    return isAppTheme(legacyTheme) ? legacyTheme : "light";
  }

  if (storedMode === "auto") {
    return "system";
  }

  return isAppTheme(legacyTheme) ? legacyTheme : "system";
}

export function readStoredThemeMode(storage: ThemeStorage): ThemeMode {
  try {
    return normalizeStoredThemeMode(
      storage.getItem(THEME_MODE_STORAGE_KEY),
      storage.getItem(LEGACY_THEME_STORAGE_KEY),
    );
  } catch {
    return "system";
  }
}

export function persistThemeMode(
  storage: ThemeStorage,
  mode: ThemeMode,
): void {
  try {
    storage.setItem(THEME_MODE_STORAGE_KEY, mode);

    if (mode === "system") {
      storage.removeItem(LEGACY_THEME_STORAGE_KEY);
    } else {
      storage.setItem(LEGACY_THEME_STORAGE_KEY, mode);
    }
  } catch {
    // Theme remains usable for storage-restricted browsers.
  }
}

export function resolveTheme(
  mode: ThemeMode,
  prefersDark: boolean,
): AppTheme {
  if (mode === "system") {
    return prefersDark ? "dark" : "light";
  }

  return mode;
}
