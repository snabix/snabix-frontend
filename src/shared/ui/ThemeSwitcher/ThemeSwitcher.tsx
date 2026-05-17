"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
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
        "inline-flex h-11 items-center gap-3 rounded-full ",
        "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)]",
        "hover:border-[var(--accent)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
      ].join(" ")}
      onClick={handleToggle}
      type="button"
    >
      <span
        className={[
          "relative h-6 w-11 rounded-full border transition-colors duration-300",
          isDark
            ? "border-[var(--accent)] bg-[var(--active-button-bg)]"
            : "border-[var(--border-soft)] bg-[var(--accent-soft)]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-[var(--surface)] text-[var(--brand-deep)] shadow-sm transition-transform duration-300",
            isDark ? "translate-x-[20px]" : "translate-x-[2px]",
          ].join(" ")}
        >
          {isDark ? <Moon size={12} /> : <Sun size={12} />}
        </span>
      </span>
    </button>
  );
}
