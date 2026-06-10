"use client";

import { Bell } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { HeaderAuthActions } from "@/src/shared/ui/header/HeaderAuthActions";
import { HeaderUserMenu } from "@/src/shared/ui/header/HeaderUserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";
import { ThemeSwitcher } from "@/src/shared/ui/theme-switcher/ThemeSwitcher";

type HeaderSessionActionsProps = {
  isPending: boolean;
  onLogoutAction: () => void;
};

export function HeaderSessionActions({
  isPending,
  onLogoutAction,
}: HeaderSessionActionsProps) {
  const user = useUserStore((state) => state.user);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);

  return (
    <div className="flex items-center gap-3">
      <ThemeSwitcher />
      <HeaderNotificationsMenu />

      {!hasCheckedSession ? (
        <div
          aria-label="Проверка сессии пользователя"
          className="flex items-center gap-3"
        >
          <div className="h-11 w-28 rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]" />
          <div className="h-11 w-32 rounded-[18px] bg-[color-mix(in_srgb,var(--brand)_14%,transparent)]" />
        </div>
      ) : user ? (
        <HeaderUserMenu
          isPending={isPending}
          onLogoutAction={onLogoutAction}
          user={user}
        />
      ) : (
        <HeaderAuthActions />
      )}
    </div>
  );
}

function HeaderNotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Уведомления"
          className="grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
          type="button"
        >
          <Bell size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-[24px] p-3">
        <DropdownMenuLabel className="px-2 text-sm font-black text-[var(--brand-deep)]">
          Уведомления
        </DropdownMenuLabel>
        <div className="mt-2 rounded-2xl border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-4 text-sm leading-6 text-[var(--text-muted)]">
          Пока уведомлений нет.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
