"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PointerEvent, type ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { settingsNavigation } from "@/src/screens/account/settings/ui/settings-navigation";

type SettingsShellProps = {
  children: ReactNode;
};

const MIN_WIDTH = 236;
const MAX_WIDTH = 360;
const COLLAPSED_WIDTH = 88;
const DEFAULT_WIDTH = 298;
const AUTO_COLLAPSE_WIDTH = 162;

export function SettingsShell({ children }: SettingsShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      const nextWidth = Math.min(
        Math.max(moveEvent.clientX - 24, COLLAPSED_WIDTH),
        MAX_WIDTH,
      );

      if (nextWidth < AUTO_COLLAPSE_WIDTH) {
        setIsCollapsed(true);
        return;
      }

      setIsCollapsed(false);
      setWidth(Math.max(nextWidth, MIN_WIDTH));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="grid gap-5 lg:flex lg:items-start">
      <aside
        className={[
          "settings-sidebar sticky top-24 shrink-0 overflow-hidden rounded-[30px]",
          "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)]",
          "shadow-[var(--shadow-card)] backdrop-blur-xl",
          "transition-[width] duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)]",
        ].join(" ")}
        style={{ width: isCollapsed ? COLLAPSED_WIDTH : width }}
      >
        <div
          className={[
            "flex items-center border-b border-[var(--border-soft)] p-4",
            isCollapsed ? "justify-center" : "justify-between gap-3",
          ].join(" ")}
        >
          <div
            className={[
              "overflow-hidden transition-[max-width,opacity,transform] duration-[420ms] ease-[cubic-bezier(.22,1,.36,1)]",
              isCollapsed ? "max-w-0 translate-x-3 opacity-0" : "max-w-[190px] translate-x-0 opacity-100",
            ].join(" ")}
          >
            <div className="font-heading whitespace-nowrap text-lg font-extrabold text-[var(--brand-deep)]">
              Настройки
            </div>
          </div>

          <button
            aria-label={isCollapsed ? "Открыть меню настроек" : "Закрыть меню настроек"}
            className={[
              "grid size-11 shrink-0 place-items-center rounded-2xl",
              "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)]",
              "text-[var(--brand-deep)] transition-colors duration-200",
              "hover:border-[var(--accent)] hover:text-[var(--accent)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
            ].join(" ")}
            onClick={() => setIsCollapsed((value) => !value)}
            type="button"
          >
            {isCollapsed ? (
              <PanelLeftOpen aria-hidden="true" size={19} strokeWidth={2.25} />
            ) : (
              <PanelLeftClose aria-hidden="true" size={19} strokeWidth={2.25} />
            )}
          </button>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto overscroll-contain scroll-smooth p-3">
          {settingsNavigation.map((section) => (
            <div
              className="pb-2"
              key="settings-navigation"
            >
              <nav className="grid gap-1.5">
                {section.items.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href;

                  return (
                    <Link
                      aria-label={isCollapsed ? label : undefined}
                      className={[
                        "group flex min-h-12 items-center overflow-hidden rounded-2xl px-3 text-sm font-bold",
                        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                        isCollapsed ? "justify-center" : "gap-3",
                        isActive
                          ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)] shadow-[var(--shadow-card)]"
                          : "text-[var(--brand-deep)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
                      ].join(" ")}
                      href={href}
                      key={href}
                      title={isCollapsed ? label : undefined}
                    >
                      <span
                        className={[
                          "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-200",
                          isActive
                            ? "bg-[color-mix(in_srgb,var(--active-button-text)_14%,transparent)] text-[var(--active-button-text)]"
                            : "bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--active-button-bg)] group-hover:text-[var(--active-button-text)]",
                        ].join(" ")}
                      >
                        <Icon aria-hidden="true" size={18} />
                      </span>

                      <span
                        className={[
                          "whitespace-pre-line leading-5 transition-[width,opacity,transform] duration-[420ms] ease-[cubic-bezier(.22,1,.36,1)]",
                          isCollapsed ? "w-0 translate-x-3 opacity-0" : "w-auto translate-x-0 opacity-100",
                        ].join(" ")}
                      >
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {!isCollapsed ? (
          <button
            aria-label="Изменить ширину меню настроек перетаскиванием"
            className={[
              "absolute bottom-5 right-1 top-5 w-3 cursor-ew-resize rounded-full outline-none",
              "transition-colors duration-200 hover:bg-[var(--accent-soft)]",
              "focus-visible:bg-[var(--accent-soft)]",
            ].join(" ")}
            onPointerDown={handlePointerDown}
            type="button"
          >
            <span className="mx-auto block h-full w-1 rounded-full bg-[var(--border-strong)]" />
          </button>
        ) : null}
      </aside>

      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
