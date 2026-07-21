"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
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

const deviceIconToneByType: Record<ActiveUserSession["type"], string> = {
  desktop: "bg-[#3478f6] text-white",
  mobile: "bg-[#3478f6] text-white",
  tablet: "bg-[#6f7df7] text-white",
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

          {!isLoading && !errorMessage && sessions.length > 0 ? (
            <div className="overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-sm shadow-black/5">
              {sessions.map((session) => (
                <SessionListItem
                  isMutating={isMutating}
                  key={session.id}
                  onTerminate={() => setSessionToClose(session)}
                  session={session}
                />
              ))}
            </div>
          ) : null}
        </div>
      </SettingsSection>

      <ConfirmActionDialog
        actionLabel={isMutating ? "Завершаем..." : "Завершить сеанс"}
        description={sessionToClose ? `Сеанс на устройстве ${sessionToClose.deviceName} будет завершен.` : ""}
        isOpen={sessionToClose !== null}
        onConfirm={handleTerminateSession}
        onOpenChange={(isOpen) => {
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
        onConfirm={handleTerminateOtherSessions}
        onOpenChange={setIsCloseAllOpen}
        title="Завершить остальные сеансы?"
      />
    </>
  );
}

function SessionListItem({
  isMutating,
  onTerminate,
  session,
}: {
  isMutating: boolean;
  onTerminate: () => void;
  session: ActiveUserSession;
}) {
  const Icon = deviceIconByType[session.type];

  return (
    <article className="group relative flex gap-4 px-4 py-4 after:absolute after:bottom-0 after:left-[88px] after:right-4 after:h-px after:bg-[var(--border-soft)] last:after:hidden sm:px-5">
      <div className={`relative mt-0.5 grid size-12 shrink-0 place-items-center rounded-[12px] ${deviceIconToneByType[session.type]}`}>
        <Icon aria-hidden="true" size={25} />
        {session.isCurrent ? (
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-[var(--active-button-bg)] text-[var(--active-button-text)] ring-2 ring-[var(--surface)]">
            <CheckCircle2 aria-hidden="true" size={13} />
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[18px] font-semibold leading-6 text-[var(--brand-deep)]">
              {session.deviceName}
            </h3>
            <p className="mt-0.5 truncate text-[16px] leading-6 text-[var(--brand-deep)]">
              {session.browser}
              {session.ipAddress ? `, ${session.ipAddress}` : ""}
            </p>
            <p className="truncate text-[16px] leading-6 text-[var(--text-muted)]">
              {session.locationLabel}
            </p>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            <div className="pt-0.5 text-right text-[16px] font-semibold leading-6 text-[var(--text-muted)]">
              {session.isCurrent ? "сейчас" : formatSessionActivityShort(session.lastActivityAt)}
            </div>
            <Button
              aria-label={`Завершить сеанс ${session.deviceName}`}
              className="size-8 rounded-full opacity-80 transition-opacity group-hover:opacity-100"
              disabled={isMutating}
              onClick={onTerminate}
              type="button"
              variant="ghost"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatSessionActivityShort(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}
