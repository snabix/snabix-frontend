"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useUserStore } from "@/src/entities/user";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);

  useEffect(() => {
    if (!hasCheckedSession || isLoading || user !== null) {
      return;
    }

    router.replace(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
  }, [hasCheckedSession, isLoading, pathname, router, user]);

  if (!hasCheckedSession || isLoading) {
    return (
      <div className="surface-card flex min-h-80 items-center justify-center gap-3 rounded-[30px] text-sm font-semibold text-[var(--text-muted)]">
        <LoaderCircle className="animate-spin" size={18} />
        Проверяем сессию
      </div>
    );
  }

  if (user === null) {
    return null;
  }

  return children;
}
