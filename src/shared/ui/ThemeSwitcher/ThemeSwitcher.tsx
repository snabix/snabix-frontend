"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
        "transition-colors duration-300 hover:border-[var(--accent)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
      ].join(" ")}
      onClick={handleToggle}
      type="button"
    >
      <motion.span
        animate={{
          scale: isDark ? 1.02 : 1,
        }}
        className={[
          "relative h-6 w-11 overflow-hidden rounded-full border transition-colors duration-300",
          isDark
            ? "border-[var(--accent)] bg-[var(--active-button-bg)]"
            : "border-[var(--border-soft)] bg-[var(--accent-soft)]",
        ].join(" ")}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <motion.span
          animate={{
            rotate: isDark ? 360 : 0,
            x: isDark ? 20 : 2,
          }}
          className={[
            "absolute top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full",
            "bg-[var(--surface)] text-[var(--brand-deep)] shadow-[0_6px_16px_color-mix(in_srgb,var(--brand-deep)_18%,transparent)]",
          ].join(" ")}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="grid place-items-center"
              exit={{ opacity: 0, scale: 0.65, rotate: isDark ? -90 : 90 }}
              initial={{ opacity: 0, scale: 0.65, rotate: isDark ? 90 : -90 }}
              key={isDark ? "moon" : "sun"}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {isDark ? <Moon size={12} /> : <Sun size={12} />}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.span>
    </button>
  );
}
