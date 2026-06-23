"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import {
  getMillisecondsUntilThemeChange,
  getTimeBasedTheme,
  usesAutomaticTheme,
} from "./time-based-theme";

const BOUNDARY_DELAY_MS = 1_000;

export function TimeBasedThemeSync() {
  const { setTheme } = useTheme();

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
