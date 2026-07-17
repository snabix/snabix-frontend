"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { HeaderAuthActions } from "@/src/shared/ui/header/HeaderAuthActions";
import { HeaderNotificationsMenu } from "@/src/shared/ui/header/HeaderNotificationsMenu";
import { HeaderSearchMenu } from "@/src/shared/ui/header/HeaderSearchMenu";
import { HeaderUserMenu } from "@/src/shared/ui/header/HeaderUserMenu";

type HeaderSessionActionsProps = {
  isSearchOpen: boolean;
  isPending: boolean;
  onSearchOpenChangeAction: (isOpen: boolean) => void;
  onLogoutAction: () => void;
};

export function HeaderSessionActions({
  isSearchOpen,
  isPending,
  onSearchOpenChangeAction,
  onLogoutAction,
}: HeaderSessionActionsProps) {
  const user = useUserStore((state) => state.user);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
      {hasCheckedSession && user !== null ? (
        <Link
          aria-label="Создать объявление"
          className="active-button inline-flex size-11 items-center justify-center gap-2 rounded-full text-sm font-bold leading-none shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] sm:h-12 sm:w-auto sm:px-5"
          href="/account/listings/create"
        >
          <Plus size={17} strokeWidth={2.4} />
          <span className="hidden sm:inline">Создать</span>
        </Link>
      ) : null}

      <HeaderSearchMenu
        isOpen={isSearchOpen}
        onOpenChangeAction={onSearchOpenChangeAction}
      />

      <HeaderNotificationsMenu isEnabled={hasCheckedSession && user !== null} />

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
