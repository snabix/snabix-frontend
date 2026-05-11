"use client";

import { useEffect, useEffectEvent } from "react";
import { getMe, useUserStore } from "@/src/entities/user";
import { getAccessToken, removeAccessToken } from "@/src/shared/lib/access-token";

export function SessionProvider() {
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

  return null;
}
