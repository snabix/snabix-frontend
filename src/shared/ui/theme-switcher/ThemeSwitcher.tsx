"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "./theme-context";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, setTheme } = useAppTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
      className={[
        "inline-flex items-center gap-3 rounded-full",
        compact ? "h-6" : "h-11",
        "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)]",
        "transition-colors duration-300 hover:border-[var(--accent)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
      ].join(" ")}
      onClick={handleToggle}
      type="button"
    >
      <span
        className={[
          "relative h-6 w-11 overflow-hidden rounded-full border transition-[background-color,border-color,transform] duration-300 motion-reduce:transition-none",
          isDark
            ? "scale-[1.02] border-[var(--accent)] bg-[var(--active-button-bg)]"
            : "border-[var(--border-soft)] bg-[var(--accent-soft)]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full",
            "bg-[var(--surface)] text-[var(--brand-deep)] shadow-[0_6px_16px_color-mix(in_srgb,var(--brand-deep)_18%,transparent)]",
            "transition-transform duration-300 ease-out motion-reduce:transition-none",
            isDark ? "translate-x-5 rotate-[360deg]" : "translate-x-0 rotate-0",
          ].join(" ")}
        >
          <Sun
            aria-hidden="true"
            className={[
              "absolute transition-[opacity,transform] duration-200 motion-reduce:transition-none",
              isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            ].join(" ")}
            size={12}
          />
          <Moon
            aria-hidden="true"
            className={[
              "absolute transition-[opacity,transform] duration-200 motion-reduce:transition-none",
              isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
            ].join(" ")}
            size={12}
          />
        </span>
      </span>
    </button>
  );
}
