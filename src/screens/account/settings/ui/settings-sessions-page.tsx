"use client";

import { useEffect, useState } from "react";
import {
  Monitor,
  MonitorSmartphone,
  Smartphone,
  Tablet,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import {
  listActiveSessions,
  terminateOtherSessions,
  terminateSession,
} from "@/src/features/auth/api";
import type { ActiveUserSession } from "@/src/features/auth/model/types";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { ConfirmActionDialog, SettingsSection } from "./settings-shared";

const deviceIconByType: Record<ActiveUserSession["type"], LucideIcon> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export function SessionsSettingsPage() {
  const [sessions, setSessions] = useState<ActiveUserSession[]>([]);
  const [sessionToClose, setSessionToClose] = useState<ActiveUserSession | null>(null);
  const [isCloseAllOpen, setIsCloseAllOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const activeSessions = await listActiveSessions();

        if (isMounted) {
          setSessions(activeSessions);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(extractApiError(error, "Не удалось загрузить активные устройства."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTerminateSession = async () => {
    if (!sessionToClose) {
      return;
    }

    setIsMutating(true);

    try {
      await terminateSession(sessionToClose.id);

      if (sessionToClose.isCurrent) {
        clearUser();
        window.location.assign("/sign-in");
        return;
      }

      setSessions((currentSessions) =>
        currentSessions.filter((session) => session.id !== sessionToClose.id),
      );
      setSessionToClose(null);
      toast.success("Сеанс завершен.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось завершить сеанс."));
    } finally {
      setIsMutating(false);
    }
  };

  const handleTerminateOtherSessions = async () => {
    setIsMutating(true);

    try {
      await terminateOtherSessions();
      setSessions((currentSessions) => currentSessions.filter((session) => session.isCurrent));
      setIsCloseAllOpen(false);
      toast.success("Остальные сеансы завершены.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось завершить сеансы."));
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <>
      <SettingsSection
        description="Активные устройства берутся из backend-сессий. Текущий сеанс показываем первым, остальные можно завершить отдельно."
        icon={MonitorSmartphone}
        title="Сессии"
      >
        <div className="mb-5 flex justify-end">
          <Button
            className="rounded-2xl"
            disabled={isLoading || isMutating || sessions.every((session) => session.isCurrent)}
            onClick={() => setIsCloseAllOpen(true)}
            type="button"
            variant="destructive"
          >
            Завершить остальные сеансы
          </Button>
        </div>

        <div className="grid gap-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="h-[82px] animate-pulse rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)]"
                  key={index}
                />
              ))
            : null}

          {!isLoading && errorMessage ? (
            <div className="rounded-[24px] border border-[var(--danger-soft)] bg-[var(--danger-soft)] p-5 text-sm font-semibold text-[var(--brand-deep)]">
              {errorMessage}
            </div>
          ) : null}

          {!isLoading && !errorMessage && sessions.length === 0 ? (
            <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5 text-sm leading-6 text-[var(--text-muted)]">
              Активные устройства пока не найдены.
            </div>
          ) : null}

          {!isLoading && !errorMessage
            ? sessions.map((session) => {
                const Icon = deviceIconByType[session.type];

                return (
                  <article
                    className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4"
                    key={session.id}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Icon aria-hidden="true" size={22} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading truncate text-base font-black text-[var(--brand-deep)]">
                              {session.deviceName}
                            </h3>
                            {session.isCurrent ? (
                              <span className="rounded-full bg-[var(--active-button-bg)] px-3 py-1 text-xs font-black text-[var(--active-button-text)]">
                                текущий сеанс
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                            {session.browser} · активность: {formatSessionActivity(session.lastActivityAt)}
                            {session.ipAddress ? ` · ${session.ipAddress}` : ""}
                          </p>
                        </div>
                      </div>

                      <Button
                        aria-label={`Завершить сеанс ${session.deviceName}`}
                        className="size-10 shrink-0 rounded-2xl"
                        disabled={isMutating}
                        onClick={() => setSessionToClose(session)}
                        type="button"
                        variant="ghost"
                      >
                        <X size={17} />
                      </Button>
                    </div>
                  </article>
                );
              })
            : null}
        </div>
      </SettingsSection>

      <ConfirmActionDialog
        actionLabel={isMutating ? "Завершаем..." : "Завершить сеанс"}
        description={sessionToClose ? `Сеанс на устройстве ${sessionToClose.deviceName} будет завершен.` : ""}
        isOpen={sessionToClose !== null}
        onConfirmAction={handleTerminateSession}
        onOpenChangeAction={(isOpen) => {
          if (!isOpen) {
            setSessionToClose(null);
          }
        }}
        title="Завершить этот сеанс?"
      />

      <ConfirmActionDialog
        actionLabel={isMutating ? "Завершаем..." : "Завершить остальные"}
        description="Все сеансы кроме текущего будут завершены."
        isOpen={isCloseAllOpen}
        onConfirmAction={handleTerminateOtherSessions}
        onOpenChangeAction={setIsCloseAllOpen}
        title="Завершить остальные сеансы?"
      />
    </>
  );
}

function formatSessionActivity(value: string | null): string {
  if (!value) {
    return "неизвестно";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
  }).format(new Date(value));
}
