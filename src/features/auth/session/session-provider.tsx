"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { getMe, useUserStore } from "@/src/entities/user";
import { AUTH_UNAUTHORIZED_EVENT } from "@/src/features/auth/session/auth-events";
import {
  clearAuthSession,
  shouldHydrateSession,
} from "@/src/shared/lib/auth-session";

export function SessionProvider() {
  const hasHydratedSessionRef = useRef(false);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoading = useUserStore((state) => state.setLoading);
  const setHasCheckedSession = useUserStore(
    (state) => state.setHasCheckedSession,
  );

  const hydrateSession = useEffectEvent(async () => {
    if (!shouldHydrateSession()) {
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
      clearAuthSession();
    } finally {
      setLoading(false);
      setHasCheckedSession(true);
    }
  });

  useEffect(() => {
    if (hasHydratedSessionRef.current) {
      return;
    }

    hasHydratedSessionRef.current = true;

    hydrateSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearUser();
      setLoading(false);
      setHasCheckedSession(true);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [clearUser, setHasCheckedSession, setLoading]);

  return null;
}
