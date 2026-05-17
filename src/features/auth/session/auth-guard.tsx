"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/src/entities/user";

type AuthGuardProps = {
  children: ReactNode;
};

function buildSignInUrl(pathname: string) {
  const redirectTo = encodeURIComponent(pathname || "/account/profile");

  return `/sign-in?redirectTo=${redirectTo}`;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);

  useEffect(() => {
    if (!hasCheckedSession || isLoading || user) {
      return;
    }

    router.replace(buildSignInUrl(pathname));
  }, [hasCheckedSession, isLoading, pathname, router, user]);

  if (!hasCheckedSession || isLoading) {
    return (
      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold text-[var(--brand-deep)]">
          Проверяем сессию...
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Сейчас аккуратно восстановим доступ к личному кабинету.
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
