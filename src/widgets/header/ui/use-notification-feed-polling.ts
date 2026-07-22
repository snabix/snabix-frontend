"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import {
  listNotifications,
  type NotificationFeed,
} from "@/src/entities/notification";

const POLLING_INTERVAL_MS = 30_000;
const MAX_BACKOFF_MS = 5 * 60_000;
const FOREGROUND_REFRESH_FRESHNESS_MS = 1_000;
const EMPTY_FEED: NotificationFeed = { items: [], unreadCount: 0 };

type NotificationFeedPollingOptions = {
  isEnabled: boolean;
  onNewNotification: () => void;
};

export function useNotificationFeedPolling({
  isEnabled,
  onNewNotification,
}: NotificationFeedPollingOptions) {
  const [feed, setFeed] = useState<NotificationFeed>(EMPTY_FEED);
  const activeRequest = useRef<Promise<NotificationFeed> | null>(null);
  const lastSuccessfulRefreshAt = useRef(0);
  const latestNotificationId = useRef<string | null>(null);
  const refreshRef = useRef<(force?: boolean) => void>(() => undefined);

  const applyFeed = useEffectEvent((nextFeed: NotificationFeed) => {
    const nextLatestId = nextFeed.items[0]?.id ?? null;

    if (
      latestNotificationId.current !== null
      && nextLatestId !== null
      && nextLatestId !== latestNotificationId.current
    ) {
      onNewNotification();
    }

    latestNotificationId.current = nextLatestId;
    setFeed(nextFeed);
  });

  useEffect(() => {
    let failureCount = 0;
    let forceRefreshQueued = false;
    let inFlight = false;
    let isActive = true;
    let timeoutId: number | null = null;

    const clearScheduledPoll = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const canPoll = () => (
      isEnabled
      && document.visibilityState === "visible"
      && navigator.onLine
    );
    const schedulePoll = (delay: number) => {
      clearScheduledPoll();

      if (isActive && canPoll()) {
        timeoutId = window.setTimeout(runPoll, delay);
      }
    };
    const requestFeed = () => {
      if (activeRequest.current === null) {
        activeRequest.current = listNotifications().finally(() => {
          activeRequest.current = null;
        });
      }

      return activeRequest.current;
    };
    const runPoll = async (force = false) => {
      clearScheduledPoll();

      if (!isActive || !canPoll()) {
        return;
      }

      if (inFlight) {
        forceRefreshQueued ||= force;
        return;
      }

      inFlight = true;

      try {
        const nextFeed = await requestFeed();

        if (!isActive) {
          return;
        }

        failureCount = 0;
        lastSuccessfulRefreshAt.current = Date.now();
        applyFeed(nextFeed);
        schedulePoll(POLLING_INTERVAL_MS);
      } catch {
        if (!isActive) {
          return;
        }

        failureCount += 1;
        schedulePoll(Math.min(
          POLLING_INTERVAL_MS * (2 ** failureCount),
          MAX_BACKOFF_MS,
        ));
      } finally {
        inFlight = false;

        if (forceRefreshQueued && isActive && canPoll()) {
          forceRefreshQueued = false;
          void runPoll(true);
        }
      }
    };
    const refreshNow = (force = false) => {
      failureCount = 0;

      if (
        !force
        && Date.now() - lastSuccessfulRefreshAt.current < FOREGROUND_REFRESH_FRESHNESS_MS
      ) {
        return;
      }

      void runPoll(force);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshNow();
      } else {
        clearScheduledPoll();
      }
    };
    const handleForegroundRefresh = () => refreshNow();
    const handleOffline = () => clearScheduledPoll();

    refreshRef.current = refreshNow;

    if (!isEnabled) {
      latestNotificationId.current = null;
    } else {
      refreshNow();
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleForegroundRefresh);
      window.addEventListener("online", handleForegroundRefresh);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      isActive = false;
      refreshRef.current = () => undefined;
      clearScheduledPoll();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleForegroundRefresh);
      window.removeEventListener("online", handleForegroundRefresh);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isEnabled]);

  const refresh = useCallback((force = false) => refreshRef.current(force), []);

  return { feed, refresh };
}
