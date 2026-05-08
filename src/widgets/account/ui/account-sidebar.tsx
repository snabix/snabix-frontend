"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PointerEvent, useState } from "react";
import {
  FileDown,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Tags,
  UserRound,
} from "lucide-react";
import { accountNavigation } from "@/src/shared/config/navigation";

const iconByKey = {
  profile: UserRound,
  reviews: MessageSquareText,
  settings: Settings,
  listings: Tags,
  export: FileDown,
};

const MIN_WIDTH = 220;
const MAX_WIDTH = 340;
const COLLAPSED_WIDTH = 88;

export function AccountSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(278);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      const nextWidth = Math.min(Math.max(moveEvent.clientX - 24, 96), MAX_WIDTH);

      if (nextWidth < 150) {
        setIsCollapsed(true);
        return;
      }

      setIsCollapsed(false);
      setWidth(Math.max(nextWidth, MIN_WIDTH));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <aside
      className="account-sidebar relative shrink-0 overflow-hidden rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] shadow-[var(--shadow-card)] backdrop-blur-xl"
      style={{ width: isCollapsed ? COLLAPSED_WIDTH : width }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-soft)] p-4">
        {!isCollapsed ? (
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Кабинет
            </div>
            <div className="font-heading text-lg font-extrabold text-[var(--brand-deep)]">
              Управление
            </div>
          </div>
        ) : null}

        <button
          aria-label={isCollapsed ? "Открыть боковое меню" : "Закрыть боковое меню"}
          className="grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-white/70 text-[var(--brand-deep)] hover:border-[var(--accent)] hover:text-[var(--accent)] dark:bg-white/5"
          onClick={() => setIsCollapsed((value) => !value)}
          type="button"
        >
          {isCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>
      </div>

      <nav className="space-y-2 p-3">
        {accountNavigation.map((item) => {
          const Icon = iconByKey[item.key as keyof typeof iconByKey];
          const isActive = pathname === item.href;

          return (
            <Link
              aria-label={isCollapsed ? item.label : undefined}
              className={[
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold",
                "text-[var(--text-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)]",
                isActive
                  ? "bg-[linear-gradient(135deg,var(--brand),var(--accent))] text-white shadow-[0_16px_28px_rgba(2,28,79,0.16)] hover:text-white"
                  : "",
                isCollapsed ? "justify-center" : "",
              ].join(" ")}
              href={item.href}
              key={item.key}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={19} />
              {!isCollapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <button
        aria-label="Изменить ширину бокового меню перетаскиванием"
        className="absolute bottom-5 right-1 top-5 w-3 cursor-ew-resize rounded-full outline-none hover:bg-[var(--accent-soft)] focus-visible:bg-[var(--accent-soft)]"
        onPointerDown={handlePointerDown}
        type="button"
      >
        <span className="mx-auto block h-full w-1 rounded-full bg-[var(--border-strong)]" />
      </button>
    </aside>
  );
}
