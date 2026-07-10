"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import {
  deleteAllNotifications,
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationFeed,
} from "@/src/entities/notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";

export function HeaderNotificationsMenu({ isEnabled }: { isEnabled: boolean }) {
  const [feed, setFeed] = useState<NotificationFeed>({ items: [], unreadCount: 0 });
  const [isClearing, setIsClearing] = useState(false);
  const [deletingNotificationIds, setDeletingNotificationIds] = useState<Set<string>>(new Set());
  const latestNotificationId = useRef<string | null>(null);
  const canPlaySound = useRef(false);
  const visibleFeed = isEnabled ? feed : { items: [], unreadCount: 0 };

  useEffect(() => {
    const unlockSound = () => {
      canPlaySound.current = true;
    };

    window.addEventListener("pointerdown", unlockSound, { once: true });
    return () => window.removeEventListener("pointerdown", unlockSound);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      latestNotificationId.current = null;
      return;
    }

    let isMounted = true;
    const load = async () => {
      try {
        const nextFeed = await listNotifications();
        const nextLatestId = nextFeed.items[0]?.id ?? null;

        if (
          latestNotificationId.current !== null
          && nextLatestId !== null
          && nextLatestId !== latestNotificationId.current
          && canPlaySound.current
        ) {
          playNotificationSound();
        }

        latestNotificationId.current = nextLatestId;
        if (isMounted) setFeed(nextFeed);
      } catch {
        // Session handling is centralized in the API interceptor.
      }
    };

    void load();
    const intervalId = window.setInterval(load, 30_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [isEnabled]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setFeed((current) => ({
      items: current.items.map((item) => ({ ...item, isRead: true })),
      unreadCount: 0,
    }));
  };

  const handleDeleteAll = async () => {
    setIsClearing(true);

    try {
      await deleteAllNotifications();
      latestNotificationId.current = null;
      setFeed({ items: [], unreadCount: 0 });
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setDeletingNotificationIds((current) => new Set(current).add(notificationId));

    try {
      await deleteNotification(notificationId);
      setFeed((current) => {
        const deletedNotification = current.items.find((item) => item.id === notificationId);

        return {
          items: current.items.filter((item) => item.id !== notificationId),
          unreadCount: deletedNotification !== undefined && !deletedNotification.isRead
            ? Math.max(current.unreadCount - 1, 0)
            : current.unreadCount,
        };
      });
    } finally {
      setDeletingNotificationIds((current) => {
        const next = new Set(current);
        next.delete(notificationId);

        return next;
      });
    }
  };

  const handleNotificationOpen = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markNotificationRead(notificationId);
      setFeed((current) => ({
        items: current.items.map((item) => (
          item.id === notificationId ? { ...item, isRead: true } : item
        )),
        unreadCount: Math.max(current.unreadCount - 1, 0),
      }));
    }
  };

  const handleMenuOpenChange = (isOpen: boolean) => {
    if (isOpen && visibleFeed.unreadCount > 0) {
      void handleMarkAllRead();
    }
  };

  return (
    <DropdownMenu onOpenChange={handleMenuOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Уведомления"
          className="relative grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
          type="button"
        >
          <Bell size={18} />
          {visibleFeed.unreadCount > 0 ? (
            <span className="absolute right-1 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-black text-white">
              {visibleFeed.unreadCount > 99 ? "99+" : visibleFeed.unreadCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(92vw,380px)] rounded-[24px] p-3">
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <DropdownMenuLabel className="p-0 text-sm font-black text-[var(--brand-deep)]">
            Уведомления
          </DropdownMenuLabel>
          <div className="flex items-center gap-3">
            {visibleFeed.items.length > 0 ? (
              <button
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--danger)] disabled:opacity-50"
                disabled={isClearing}
                onClick={() => void handleDeleteAll()}
                type="button"
              >
                <Trash2 size={14} />
                {isClearing ? "Очищаем..." : "Очистить"}
              </button>
            ) : null}
            {visibleFeed.unreadCount > 0 ? (
              <button
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)]"
                onClick={() => void handleMarkAllRead()}
                type="button"
              >
                <CheckCheck size={14} />
                Прочитать все
              </button>
            ) : null}
          </div>
        </div>

        {visibleFeed.items.length === 0 ? (
          <div className="mt-2 rounded-2xl border border-dashed border-[var(--border-soft)] p-4 text-sm leading-6 text-[var(--text-muted)]">
            Пока уведомлений нет.
          </div>
        ) : (
          <div className="mt-2 max-h-96 overflow-y-auto">
            {visibleFeed.items.map((notification) => {
              const deleteButton = (
                <button
                  aria-label="Удалить уведомление"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] disabled:opacity-50"
                  disabled={deletingNotificationIds.has(notification.id)}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void handleDeleteNotification(notification.id);
                  }}
                  type="button"
                >
                  <X size={14} />
                </button>
              );
              const content = (
                <div className="flex min-w-0 items-start gap-2">
                  {!notification.isRead ? <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--accent)]" /> : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[var(--brand-deep)]">{notification.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{notification.body}</p>
                  </div>
                </div>
              );
              const rowClassName = "flex items-start gap-2 rounded-xl px-2 py-3 hover:bg-[var(--accent-soft)]";
              const openNotification = () => void handleNotificationOpen(notification.id, notification.isRead);

              return notification.actionUrl ? (
                <article aria-label={notification.title} className={rowClassName} key={notification.id}>
                  <Link
                    className="min-w-0 flex-1"
                    href={notification.actionUrl}
                    onClick={openNotification}
                  >
                    {content}
                  </Link>
                  {deleteButton}
                </article>
              ) : (
                <article aria-label={notification.title} className={rowClassName} key={notification.id}>
                  <button
                    className="min-w-0 flex-1 text-left"
                    onClick={openNotification}
                    type="button"
                  >
                    {content}
                  </button>
                  {deleteButton}
                </article>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function playNotificationSound() {
  const AudioContextClass = window.AudioContext;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.setValueAtTime(740, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(980, context.currentTime + 0.12);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
  oscillator.addEventListener("ended", () => void context.close());
}
