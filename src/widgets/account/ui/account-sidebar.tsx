"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PointerEvent, useState } from "react";
import {
    FileDown,
    Heart,
    MessageSquareText,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    Tags,
    UserRound,
} from "lucide-react";
import {
    accountNavigation,
    type AccountNavigationKey,
} from "@/src/shared/config/navigation";

const iconByKey: Record<AccountNavigationKey, typeof UserRound> = {
    profile: UserRound,
    listings: Tags,
    favorites: Heart,
    reviews: MessageSquareText,
    settings: Settings,
    export: FileDown,
};

const MIN_WIDTH = 220;
const MAX_WIDTH = 340;
const COLLAPSED_WIDTH = 88;
const DEFAULT_WIDTH = 278;
const AUTO_COLLAPSE_WIDTH = 150;

export function AccountSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
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
        <aside
            className={[
                "account-sidebar sticky top-24 shrink-0 overflow-hidden rounded-[30px]",
                "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)]",
                "shadow-[var(--shadow-card)] backdrop-blur-xl",
                "transition-[width] duration-300 ease-out",
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
                        "overflow-hidden transition-all duration-300 ease-out",
                        isCollapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100",
                    ].join(" ")}
                >
                    <div className="font-heading whitespace-nowrap text-lg font-extrabold text-[var(--brand-deep)]">
                        Управление
                    </div>
                </div>

                <button
                    aria-label={
                        isCollapsed ? "Открыть боковое меню" : "Закрыть боковое меню"
                    }
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
                        <PanelLeftOpen
                            aria-hidden="true"
                            className="shrink-0"
                            size={19}
                            strokeWidth={2.25}
                        />
                    ) : (
                        <PanelLeftClose
                            aria-hidden="true"
                            className="shrink-0"
                            size={19}
                            strokeWidth={2.25}
                        />
                    )}
                </button>
            </div>

            <nav className="space-y-2 p-3">
                {accountNavigation.map((item) => {
                    const Icon = iconByKey[item.key] ?? UserRound;

                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            aria-label={isCollapsed ? item.label : undefined}
                            className={[
                                "group relative flex min-h-12 items-center overflow-hidden rounded-2xl px-3 text-sm font-bold",
                                "nav-link transition-all duration-200 ease-out",
                                "hover:bg-[var(--accent-soft)]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
                                isActive
                                    ? "active-button text-[var(--active-button-text)] shadow-[var(--shadow-card)]"
                                    : "text-[var(--brand-deep)]",
                                isCollapsed ? "justify-center" : "justify-start gap-3",
                            ].join(" ")}
                            href={item.href}
                            key={item.key}
                            title={isCollapsed ? item.label : undefined}
                        >
              <span
                  className={[
                      "relative z-10 grid size-9 shrink-0 place-items-center rounded-xl",
                      "transition-colors duration-200",
                      isActive
                          ? "bg-[color-mix(in_srgb,var(--active-button-text)_14%,transparent)] text-[var(--active-button-text)]"
                          : "bg-[var(--accent-soft)] text-[var(--text-muted)] group-hover:text-[var(--accent)]",
                  ].join(" ")}
              >
                <Icon
                    aria-hidden="true"
                    className="shrink-0"
                    size={20}
                    strokeWidth={2.25}
                />
              </span>

                            <span
                                className={[
                                    "relative z-10 whitespace-nowrap transition-all duration-300 ease-out",
                                    isCollapsed
                                        ? "w-0 translate-x-2 overflow-hidden opacity-0"
                                        : "w-auto translate-x-0 opacity-100",
                                ].join(" ")}
                            >
                {item.label}
              </span>
                        </Link>
                    );
                })}
            </nav>

            {!isCollapsed ? (
                <button
                    aria-label="Изменить ширину бокового меню перетаскиванием"
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
    );
}
