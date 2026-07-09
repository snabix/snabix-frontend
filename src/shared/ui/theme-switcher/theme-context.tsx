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
import type { AppTheme } from "./time-based-theme";

const THEME_STORAGE_KEY = "theme";

type AppThemeContextValue = {
  resolvedTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function applyTheme(theme: AppTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.style.colorScheme = theme;
}

function storedTheme(): AppTheme | null {
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);

  return value === "dark" || value === "light" ? value : null;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<AppTheme>("light");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const theme = storedTheme() ?? "light";

      setResolvedTheme(theme);
      applyTheme(theme);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((theme: AppTheme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    setResolvedTheme(theme);
    applyTheme(theme);
  }, []);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme],
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
