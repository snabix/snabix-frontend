"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, Eye, EyeOff, MailCheck, Save, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { ChangePasswordForm } from "@/src/features/auth/ui/change-password-form";
import {
  profileContactFormSchema,
  requestProfileDataExport,
  updateProfile,
} from "@/src/features/profile";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { formatPhoneNumber } from "@/src/shared/lib/format-phone-number";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { PhoneInput } from "@/src/shared/ui/phone-input";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { FieldError, SettingsSection } from "./settings-shared";

type ContactFormValues = {
  email: string;
  phoneNumber?: string;
};

export function PrivacySettingsPage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isSubmittingContacts, setIsSubmittingContacts] = useState(false);
  const [isRequestingData, setIsRequestingData] = useState(false);
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
  const initialValues = useMemo<ContactFormValues>(() => ({
    email: user?.email ?? "",
    phoneNumber: formatPhoneNumber(user?.phoneNumber),
  }), [user?.email, user?.phoneNumber]);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(profileContactFormSchema),
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleContactsSubmit = async (values: ContactFormValues) => {
    if (user === null) {
      return;
    }

    const previousUser = user;
    const previousEmail = user.email;
    const nextPhoneNumber = values.phoneNumber?.trim() || null;

    setIsSubmittingContacts(true);

    try {
      const updatedUser = await updateProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: values.email,
        phoneNumber: nextPhoneNumber,
      });

      setUser(updatedUser);

      if (previousEmail !== updatedUser.email && !updatedUser.emailVerifiedAt) {
        openVerificationDialog();
        toast.success("Контактные данные обновлены. Новый email нужно подтвердить.");
      } else {
        toast.success("Контактные данные обновлены.");
      }
    } catch (error) {
      setUser(previousUser);
      toast.error(extractApiError(error, "Не удалось обновить контактные данные."));
    } finally {
      setIsSubmittingContacts(false);
    }
  };

  const handleDataExportRequest = async () => {
    setIsRequestingData(true);

    try {
      const result = await requestProfileDataExport();

      toast.success(result.message);
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить запрос данных."));
    } finally {
      setIsRequestingData(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <SettingsSection
        description="Здесь собраны чувствительные данные аккаунта: контакты, пароль и запрос копии персональных данных."
        icon={ShieldCheck}
        title="Конфиденциальность и данные"
      >
        <div className="grid gap-5">
          <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-black text-[var(--brand-deep)]">
                  Контакты аккаунта
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Email используется для входа, восстановления доступа и системных писем. Телефон хранится как персональный контакт аккаунта.
                </p>
              </div>
              <MailCheck className="shrink-0 text-[var(--accent)]" size={24} />
            </div>

            <div className="mb-5 grid gap-3">
              <SensitiveValueRow
                isVisible={isEmailVisible}
                label="Email"
                maskedValue={maskEmail(user?.email)}
                onToggleAction={() => setIsEmailVisible((value) => !value)}
                value={user?.email ?? "Не указан"}
              />

              <SensitiveValueRow
                isVisible={isPhoneVisible}
                label="Телефон"
                maskedValue={maskPhone(user?.phoneNumber)}
                onToggleAction={() => setIsPhoneVisible((value) => !value)}
                value={formatPhoneNumber(user?.phoneNumber) || "Не указан"}
              />
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit(handleContactsSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="privacy-email">Email</Label>
                  <Input id="privacy-email" placeholder="email@example.com" {...register("email")} />
                  <FieldError message={errors.email?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="privacy-phone-number">Телефон</Label>
                  <PhoneInput id="privacy-phone-number" {...register("phoneNumber")} />
                  <FieldError message={errors.phoneNumber?.message} />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[var(--text-muted)]">
                  {isEmailVerified ? "Email подтвержден." : "Email не подтвержден. После смены адреса потребуется код подтверждения."}
                </p>
                <Button className="w-fit rounded-2xl" disabled={isSubmittingContacts} type="submit">
                  <Save size={17} />
                  {isSubmittingContacts ? "Сохраняем..." : "Сохранить контакты"}
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5">
            <h2 className="font-heading text-xl font-black text-[var(--brand-deep)]">
              Пароль
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Смена пароля относится к конфиденциальности аккаунта, поэтому теперь находится здесь.
            </p>
            <div className="mt-5">
              <ChangePasswordForm />
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="text-[var(--accent)]" size={21} />
                  <h2 className="font-heading text-xl font-black text-[var(--brand-deep)]">
                    Запросить данные
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Мы отправим на email аккаунта письмо с текущей информацией профиля, контактами и сохраненными адресами.
                </p>
              </div>

              <Button
                className="w-fit rounded-2xl"
                disabled={isRequestingData || user === null}
                onClick={handleDataExportRequest}
                type="button"
                variant="secondary"
              >
                {isRequestingData ? "Отправляем..." : "Отправить запрос"}
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {user?.email ? (
        <EmailVerificationDialog
          code={verificationCode}
          cooldownSeconds={resendCooldownSeconds}
          email={user.email}
          isConfirming={isConfirmingVerification}
          isOpen={isVerificationDialogOpen}
          isSending={isResendingVerification}
          onCodeChangeAction={handleVerificationCodeChange}
          onConfirmAction={handleConfirmVerification}
          onOpenChangeAction={setIsVerificationDialogOpen}
          onResendAction={handleResendVerification}
        />
      ) : null}
    </div>
  );
}

function SensitiveValueRow({
  isVisible,
  label,
  maskedValue,
  onToggleAction,
  value,
}: {
  isVisible: boolean;
  label: string;
  maskedValue: string;
  onToggleAction: () => void;
  value: string;
}) {
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-black text-[var(--brand-deep)]">
          {isVisible ? value : maskedValue}
        </p>
      </div>
      <button
        aria-label={isVisible ? `Скрыть ${label}` : `Показать ${label}`}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--border-soft)] text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
        onClick={onToggleAction}
        type="button"
      >
        <Icon size={17} />
      </button>
    </div>
  );
}

function maskEmail(email?: string | null) {
  if (!email) {
    return "Не указан";
  }

  const [localPart, domain] = email.split("@");

  if (!domain) {
    return maskMiddle(email);
  }

  return `${maskMiddle(localPart)}@${maskMiddle(domain)}`;
}

function maskPhone(phone?: string | null) {
  const formatted = formatPhoneNumber(phone);

  if (!formatted) {
    return "Не указан";
  }

  return formatted.replace(/\d(?=\d{2})/g, "•");
}

function maskMiddle(value: string) {
  if (value.length <= 2) {
    return "••";
  }

  return `${value.slice(0, 1)}${"•".repeat(Math.max(value.length - 2, 2))}${value.slice(-1)}`;
}
