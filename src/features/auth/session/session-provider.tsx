"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMe, useUserStore } from "@/src/entities/user";
import {
  AUTH_CONTINUE_MESSAGE,
  AUTH_UNAUTHORIZED_EVENT,
  type AuthUnauthorizedEventDetail,
} from "@/src/shared/api/auth-session-events";
import { hasAuthSessionHint } from "@/src/shared/api/auth-session-hint";

function requiresAuthenticatedSession(pathname: string): boolean {
  return pathname === "/account" || pathname.startsWith("/account/");
}

export function SessionProvider() {
  const hasHydratedSessionRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoading = useUserStore((state) => state.setLoading);
  const setHasCheckedSession = useUserStore(
    (state) => state.setHasCheckedSession,
  );

  const hydrateSession = useEffectEvent(async () => {
    setLoading(true);

    try {
      const user = await getMe();
      setUser(user);
    } catch {
      clearUser("unauthenticated");
    } finally {
      setLoading(false);
      setHasCheckedSession(true);
    }
  });

  useEffect(() => {
    if (hasHydratedSessionRef.current || user !== null) {
      return;
    }

    if (!requiresAuthenticatedSession(pathname) && !hasAuthSessionHint()) {
      setUser(null);
      return;
    }

    hasHydratedSessionRef.current = true;

    void hydrateSession();
  }, [pathname, setUser, user]);

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const detail = (event as CustomEvent<AuthUnauthorizedEventDetail>).detail;
      const shouldRedirectToSignIn = pathname.startsWith("/account");

      clearUser(detail?.reason ?? "unauthenticated");
      setLoading(false);
      setHasCheckedSession(true);

      if (detail?.message && shouldRedirectToSignIn) {
        toast.info(AUTH_CONTINUE_MESSAGE);
        router.replace(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
      }
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [clearUser, pathname, router, setHasCheckedSession, setLoading]);

  return null;
}
