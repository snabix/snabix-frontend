"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { getMe, useUserStore } from "@/src/entities/user";
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

  return null;
}
