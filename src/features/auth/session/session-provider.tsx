"use client";

import { useEffect, useEffectEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe, useUserStore } from "@/src/entities/user";
import { AUTH_UNAUTHORIZED_EVENT } from "@/src/features/auth/session/auth-events";
import { getAccessToken, removeAccessToken } from "@/src/shared/lib/access-token";

export function SessionProvider() {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoading = useUserStore((state) => state.setLoading);
  const setHasCheckedSession = useUserStore(
    (state) => state.setHasCheckedSession,
  );

  const hydrateSession = useEffectEvent(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      clearUser();
      setLoading(false);
      setHasCheckedSession(true);
      return;
    }

    setLoading(true);

    try {
      const user = await getMe();
      setUser(user);
    } catch {
      clearUser();
      removeAccessToken();
    } finally {
      setLoading(false);
      setHasCheckedSession(true);
    }
  });

  useEffect(() => {
    hydrateSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearUser();
      removeAccessToken();
      setLoading(false);
      setHasCheckedSession(true);

      if (pathname.startsWith("/account")) {
        router.replace(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
      }
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearUser, pathname, router, setHasCheckedSession, setLoading]);

  return null;
}
