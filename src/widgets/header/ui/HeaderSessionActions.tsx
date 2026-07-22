"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { HeaderNotificationsMenu } from "./HeaderNotificationsMenu";
import { HeaderSearchMenu } from "./HeaderSearchMenu";
import { HeaderUserMenu } from "./HeaderUserMenu";

type HeaderSessionActionsProps = {
  isSearchOpen: boolean;
  isPending: boolean;
  onSearchOpenChange: (isOpen: boolean) => void;
  onLogout: () => void;
};

export function HeaderSessionActions({
  isSearchOpen,
  isPending,
  onSearchOpenChange,
  onLogout,
}: HeaderSessionActionsProps) {
  const user = useUserStore((state) => state.user);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);

  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
      {hasCheckedSession && user !== null ? (
        <Link
          aria-label="Создать объявление"
          className="active-button inline-flex size-11 items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-bold leading-none shadow-[var(--shadow-card)] focus-visible:outline-none sm:h-12 sm:w-auto sm:px-5"
          href="/account/listings/create"
        >
          <Plus size={17} strokeWidth={2.4} />
          <span className="hidden sm:inline">Создать</span>
        </Link>
      ) : null}

      <HeaderSearchMenu
        isOpen={isSearchOpen}
        onOpenChange={onSearchOpenChange}
      />

      <HeaderNotificationsMenu
        isEnabled={hasCheckedSession && user !== null}
        key={user?.id ?? "guest"}
      />

      {!hasCheckedSession ? (
        <div
          aria-label="Проверка сессии пользователя"
          className="flex items-center gap-3"
        >
          <div className="hidden h-11 w-28 rounded-[var(--radius-control)] border border-[var(--border-soft)] bg-[var(--surface-muted)] sm:block" />
          <div className="h-11 w-20 rounded-[var(--radius-control)] bg-[var(--surface-muted)] sm:w-32" />
        </div>
      ) : user ? (
        <HeaderUserMenu
          isPending={isPending}
          onLogout={onLogout}
          user={user}
        />
      ) : (
        <HeaderAuthActions />
      )}
    </div>
  );
}
