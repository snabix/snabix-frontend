"use client";

import { useEffect } from "react";
import { useAppTheme } from "./theme-context";
import {
  getMillisecondsUntilThemeChange,
  getTimeBasedTheme,
  usesAutomaticTheme,
} from "./time-based-theme";

const BOUNDARY_DELAY_MS = 1_000;

export function TimeBasedThemeSync() {
  const { setTheme } = useAppTheme();

  useEffect(() => {
    if (!usesAutomaticTheme()) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const syncTheme = () => {
      const now = new Date();

      setTheme(getTimeBasedTheme(now));
      timeoutId = setTimeout(
        syncTheme,
        getMillisecondsUntilThemeChange(now) + BOUNDARY_DELAY_MS,
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timeoutId);
        syncTheme();
      }
    };

    syncTheme();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setTheme]);

  return null;
}
