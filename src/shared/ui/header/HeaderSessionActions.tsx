"use client";

import { useUserStore } from "@/src/entities/user";
import { HeaderAuthActions } from "@/src/shared/ui/header/HeaderAuthActions";
import { HeaderUserMenu } from "@/src/shared/ui/header/HeaderUserMenu";
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
