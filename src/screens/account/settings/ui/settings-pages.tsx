"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Globe2,
  KeyRound,
  Laptop,
  Mail,
  Monitor,
  MonitorSmartphone,
  Save,
  ShieldCheck,
  Smartphone,
  Tablet,
  Trash2,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { ChangePasswordForm } from "@/src/features/auth/ui/change-password-form";
import {
  listActiveSessions,
  terminateOtherSessions,
  terminateSession,
} from "@/src/features/auth/api";
import type { ActiveUserSession } from "@/src/features/auth/model/types";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { PhoneInput } from "@/src/shared/ui/phone-input";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { ThemeSwitcher } from "@/src/shared/ui/theme-switcher";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { ProfileAddressesSection } from "@/src/screens/account/profile/ui/profile-addresses-section";
import { ProfileEditField } from "@/src/screens/account/profile/ui/profile-parts";
import { toast } from "sonner";

const notificationItems = [
  "Отклики на объявления",
  "Статусы модерации",
  "Важные письма безопасности",
];

export function ProfileSettingsPage() {
  const user = useUserStore((state) => state.user);
  const {
    handleConfirmVerification,
    handleResendVerification,
    handleVerificationCodeChange,
    isConfirmingVerification,
    isEmailVerified,
    isResendingVerification,
    isVerificationDialogOpen,
    openVerificationDialog,
    resendCooldownSeconds,
    setIsVerificationDialogOpen,
    verificationCode,
  } = useEmailVerification();
  const {
    errors,
    handleProfileSubmit,
    handleSubmit,
    isSubmitting,
    register,
  } = useProfileEditor({
    onEmailVerificationRequired: openVerificationDialog,
  });

  return (
    <>
      <SettingsSection
        description="Редактирование профиля теперь находится в настройках. Эти данные используются для аккаунта и будущего публичного профиля продавца."
        icon={UserRound}
        title="Профиль"
      >
        <form className="grid gap-5" onSubmit={handleSubmit(handleProfileSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileEditField label="Имя">
              <Label className="sr-only" htmlFor="settings-first-name">Имя</Label>
              <Input id="settings-first-name" placeholder="Ваше имя" {...register("firstName")} />
              <FieldError message={errors.firstName?.message} />
            </ProfileEditField>

            <ProfileEditField label="Фамилия">
              <Label className="sr-only" htmlFor="settings-last-name">Фамилия</Label>
              <Input id="settings-last-name" placeholder="Ваша фамилия" {...register("lastName")} />
              <FieldError message={errors.lastName?.message} />
            </ProfileEditField>

            <ProfileEditField label="Email">
              <Label className="sr-only" htmlFor="settings-email">Email</Label>
              <Input id="settings-email" placeholder="email@example.com" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </ProfileEditField>

            <ProfileEditField label="Телефон">
              <Label className="sr-only" htmlFor="settings-phone-number">Телефон</Label>
              <PhoneInput id="settings-phone-number" {...register("phoneNumber")} />
              <FieldError message={errors.phoneNumber?.message} />
            </ProfileEditField>
          </div>

          <div className="flex justify-end">
            <Button className="w-fit rounded-2xl" disabled={isSubmitting} type="submit">
              <Save size={17} />
              {isSubmitting ? "Сохраняем..." : "Сохранить профиль"}
            </Button>
          </div>
        </form>
      </SettingsSection>

      {user?.email && !isEmailVerified ? (
        <EmailVerificationDialog
          code={verificationCode}
          cooldownSeconds={resendCooldownSeconds}
          email={user.email}
          isConfirming={isConfirmingVerification}
          isOpen={isVerificationDialogOpen}
          isSending={isResendingVerification}
          onCodeChange={handleVerificationCodeChange}
          onConfirm={handleConfirmVerification}
          onOpenChange={setIsVerificationDialogOpen}
          onResend={handleResendVerification}
        />
      ) : null}
    </>
  );
}

export function AccountSettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <SettingsSection
        description="Базовые настройки интерфейса и будущие параметры языка/региона."
        icon={Globe2}
        title="Аккаунт"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                  Тема интерфейса
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Переключение применяется ко всему клиенту.
                </p>
              </div>
              <Laptop className="text-[var(--accent)]" size={24} />
            </div>
            <div className="mt-5">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5">
            <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
              Язык и регион
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Пока используется русский интерфейс. Позже здесь появятся настройки локализации.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-[color-mix(in_srgb,var(--danger)_34%,var(--border-soft))] bg-[var(--danger-soft)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--danger-bg)] text-[var(--danger-text)]">
                <AlertTriangle aria-hidden="true" size={20} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                  Удаление аккаунта
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Это действие необратимо. Пока кнопка показывает форму подтверждения,
                  backend-действие подключим отдельно после утверждения политики удаления.
                </p>
              </div>
            </div>
            <Button
              className="w-fit rounded-2xl"
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
              variant="destructive"
            >
              <Trash2 size={16} />
              Удалить аккаунт
            </Button>
          </div>
        </div>

      </SettingsSection>

      <ConfirmActionDialog
        actionLabel="Удалить аккаунт"
        description="Для безопасности сейчас это только UI-подтверждение. После подключения backend мы отправим запрос удаления аккаунта здесь."
        isOpen={isDeleteDialogOpen}
        onConfirm={() => setIsDeleteDialogOpen(false)}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить аккаунт?"
      />
    </>
  );
}

export function NotificationsSettingsPage() {
  return (
    <SettingsSection
      description="Уведомления пока работают как UI-заготовка для будущей персонализации."
      icon={Bell}
      title="Уведомления"
    >
      <div className="grid gap-3">
        {notificationItems.map((item) => (
          <div
            className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-4 py-3"
            key={item}
          >
            <span className="text-sm font-bold text-[var(--brand-deep)]">{item}</span>
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black text-[var(--brand-deep)]">
              включено
            </span>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}

export function AddressesSettingsPage() {
  return <ProfileAddressesSection />;
}

export function EmailsSettingsPage() {
  const user = useUserStore((state) => state.user);

  return (
    <SettingsSection
      description="Основной email используется для входа, восстановления доступа и системных уведомлений."
      icon={Mail}
      title="Emails"
    >
      <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--brand-deep)]">
              {user?.email ?? "Email не указан"}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Основной адрес аккаунта.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-black text-[var(--brand-deep)]">
            <CheckCircle2 size={15} />
            активный
          </span>
        </div>
      </div>
    </SettingsSection>
  );
}

export function PasswordSettingsPage() {
  return (
    <SettingsSection
      description="Смена пароля находится здесь: это часть доступа, а не публичного профиля."
      icon={KeyRound}
      title="Пароль и аутентификация"
    >
      <div className="max-w-xl">
        <ChangePasswordForm />
      </div>
    </SettingsSection>
  );
}

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

      setSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionToClose.id));
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
            disabled={isLoading || isMutating || sessions.filter((session) => !session.isCurrent).length === 0}
            onClick={() => setIsCloseAllOpen(true)}
            type="button"
            variant="destructive"
          >
            Завершить остальные сеансы
          </Button>
        </div>

        <div className="grid gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-[82px] animate-pulse rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)]"
                key={index}
              />
            ))
          ) : null}

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

          {!isLoading && !errorMessage ? sessions.map((session) => {
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
          }) : null}
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

const deviceIconByType: Record<ActiveUserSession["type"], LucideIcon> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

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

export function SettingsNotFoundPage() {
  return (
    <SettingsSection
      description="Такого раздела настроек пока нет. Можно вернуться в профиль настроек."
      icon={ShieldCheck}
      title="Раздел не найден"
    >
      <Button asChild className="rounded-2xl">
        <Link href="/account/settings/profile">Открыть профиль</Link>
      </Button>
    </SettingsSection>
  );
}

function SettingsSection({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="surface-card rounded-[30px] p-6 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon aria-hidden="true" size={20} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-black text-[var(--brand-deep)]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-[var(--danger)]">{message}</p>;
}

function ConfirmActionDialog({
  actionLabel,
  description,
  isOpen,
  onConfirm,
  onOpenChange,
  title,
}: {
  actionLabel: string;
  description: string;
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            Отменить
          </Button>
          <Button onClick={onConfirm} type="button" variant="destructive">
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
