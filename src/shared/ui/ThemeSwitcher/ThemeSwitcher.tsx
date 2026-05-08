"use client";

import { useEffect, useState } from "react";
import { Dropdown, type MenuProps } from "antd";
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

  const themeItems: MenuProps["items"] = [
    {
      key: "light",
      label: (
        <div className="flex items-center gap-2 py-1">
          <Sun size={16} className="text-[var(--foreground)]" />
          <span>Светлая тема</span>
        </div>
      ),
      onClick: () => setTheme("light"),
    },
    {
      key: "dark",
      label: (
        <div className="flex items-center gap-2 py-1">
          <Moon size={16} className="text-[var(--foreground)]" />
          <span>Темная тема</span>
        </div>
      ),
      onClick: () => setTheme("dark"),
    },
    {
      key: "system",
      label: (
        <div className="flex items-center gap-2 py-1">
          <div className="size-4 rounded-full border border-current" />
          <span>Система</span>
        </div>
      ),
      onClick: () => setTheme("system"),
    },
  ];

  return (
    <Dropdown
      menu={{ items: themeItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <button
        aria-label="Переключатель темы"
        className="interactive-lift grid size-10 place-items-center rounded-full border border-[var(--border-soft)] bg-transparent transition-colors duration-200 hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        type="button"
      >
        {isDark ? (
          <Moon size={20} className="text-[var(--foreground)]" />
        ) : (
          <Sun size={20} className="text-[var(--foreground)]" />
        )}
      </button>
    </Dropdown>
  );
}
