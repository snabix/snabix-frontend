"use client";

import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { ChangePasswordForm } from "@/src/features/auth/ui/change-password-form";
import { SettingsSection } from "./settings-shared";

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
