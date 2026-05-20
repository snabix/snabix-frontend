"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { toast } from "sonner";
import { getMe, useUserStore } from "@/src/entities/user";
import {
  AUTH_UNAUTHORIZED_EVENT,
  type AuthUnauthorizedEventDetail,
} from "@/src/features/auth/session/auth-events";
import {
  clearCookieSessionState,
  shouldCheckCookieSession,
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
    if (!shouldCheckCookieSession()) {
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
      clearCookieSessionState();
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
    const handleUnauthorized = (event: Event) => {
      const detail = (event as CustomEvent<AuthUnauthorizedEventDetail>).detail;

      clearUser();
      setLoading(false);
      setHasCheckedSession(true);

      if (detail?.message) {
        toast.warning(detail.message);
      }
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [clearUser, setHasCheckedSession, setLoading]);

  return null;
}
