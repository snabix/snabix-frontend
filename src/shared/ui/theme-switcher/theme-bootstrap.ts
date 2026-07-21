import {
  LEGACY_THEME_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
} from "./theme-preference";

export const themeBootstrapScript = String.raw`
(() => {
  const root = document.documentElement;
  let mode = "system";

  try {
    const storedMode = window.localStorage.getItem(${JSON.stringify(THEME_MODE_STORAGE_KEY)});
    const legacyTheme = window.localStorage.getItem(${JSON.stringify(LEGACY_THEME_STORAGE_KEY)});
    const isTheme = (value) => value === "dark" || value === "light";

    if (storedMode === "dark" || storedMode === "light" || storedMode === "system") {
      mode = storedMode;
    } else if (storedMode === "manual") {
      mode = isTheme(legacyTheme) ? legacyTheme : "light";
    } else if (storedMode === "auto") {
      mode = "system";
    } else if (isTheme(legacyTheme)) {
      mode = legacyTheme;
    }

    window.localStorage.setItem(${JSON.stringify(THEME_MODE_STORAGE_KEY)}, mode);

    if (mode === "system") {
      window.localStorage.removeItem(${JSON.stringify(LEGACY_THEME_STORAGE_KEY)});
    } else {
      window.localStorage.setItem(${JSON.stringify(LEGACY_THEME_STORAGE_KEY)}, mode);
    }
  } catch {
    mode = "system";
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  const theme = mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.dataset.theme = theme;
  root.dataset.themeMode = mode;
  root.style.colorScheme = theme;
})();
`;
