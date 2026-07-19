"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isAppTheme,
  LEGACY_THEME_STORAGE_KEY,
  persistThemeMode,
  readStoredThemeMode,
  resolveTheme,
  THEME_MODE_STORAGE_KEY,
  type AppTheme,
  type ThemeMode,
} from "./theme-preference";

type AppThemeContextValue = {
  resolvedTheme: AppTheme;
  setThemeMode: (mode: ThemeMode) => void;
  setTheme: (theme: AppTheme) => void;
  themeMode: ThemeMode;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

function applyTheme(theme: AppTheme, mode: ThemeMode) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.dataset.themeMode = mode;
  root.style.colorScheme = theme;
}

function readAppliedTheme(): AppTheme {
  const value = document.documentElement.dataset.theme ?? null;

  return isAppTheme(value) ? value : "light";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<AppTheme>("light");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const storedMode = readStoredThemeMode(window.localStorage);

      persistThemeMode(window.localStorage, storedMode);
      setThemeModeState(storedMode);
      setResolvedTheme(readAppliedTheme());
      setIsInitialized(true);
    });

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === null
        || event.key === LEGACY_THEME_STORAGE_KEY
        || event.key === THEME_MODE_STORAGE_KEY
      ) {
        setThemeModeState(readStoredThemeMode(window.localStorage));
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    const syncTheme = () => {
      const theme = resolveTheme(themeMode, mediaQuery.matches);

      applyTheme(theme, themeMode);
      setResolvedTheme(theme);
    };

    const frameId = window.requestAnimationFrame(syncTheme);

    if (themeMode !== "system") {
      return () => window.cancelAnimationFrame(frameId);
    }

    mediaQuery.addEventListener("change", syncTheme);

    return () => {
      window.cancelAnimationFrame(frameId);
      mediaQuery.removeEventListener("change", syncTheme);
    };
  }, [isInitialized, themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    const prefersDark = window.matchMedia(SYSTEM_THEME_QUERY).matches;
    const theme = resolveTheme(mode, prefersDark);

    persistThemeMode(window.localStorage, mode);
    setThemeModeState(mode);
    setResolvedTheme(theme);
    applyTheme(theme, mode);
  }, []);

  const setTheme = useCallback(
    (theme: AppTheme) => setThemeMode(theme),
    [setThemeMode],
  );

  const value = useMemo<AppThemeContextValue>(
    () => ({
      resolvedTheme,
      setTheme,
      setThemeMode,
      themeMode,
    }),
    [resolvedTheme, setTheme, setThemeMode, themeMode],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const context = useContext(AppThemeContext);

  if (context === null) {
    throw new Error("useAppTheme must be used within AppThemeProvider.");
  }

  return context;
}
