"use client";

import { useState } from "react";
import { AlertTriangle, Globe2, Laptop, PauseCircle, Trash2 } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";
import { ThemeSwitcher } from "@/src/shared/ui/theme-switcher";
import { ConfirmActionDialog, SettingsSection } from "./settings-shared";

export function AccountSettingsPage() {
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
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

        <div className="mt-6 grid gap-4">
          <div className="rounded-[26px] border border-[color-mix(in_srgb,var(--accent)_34%,var(--border-soft))] bg-[var(--accent-soft)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--active-button-bg)] text-[var(--active-button-text)]">
                  <PauseCircle aria-hidden="true" size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                    Деактивация аккаунта
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    Добровольная деактивация должна отключать вход и скрывать активность,
                    но сохранять данные до восстановления или удаления. Backend-действие
                    подключим отдельной задачей.
                  </p>
                </div>
              </div>
              <Button
                className="w-fit rounded-2xl"
                onClick={() => setIsDeactivateDialogOpen(true)}
                type="button"
                variant="outline"
              >
                <PauseCircle size={16} />
                Деактивировать
              </Button>
            </div>
          </div>

          <div className="rounded-[26px] border border-[color-mix(in_srgb,var(--danger)_34%,var(--border-soft))] bg-[var(--danger-soft)] p-5">
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
        </div>
      </SettingsSection>

      <ConfirmActionDialog
        actionLabel="Деактивировать"
        description="Сейчас это только UI-подтверждение. Для рабочей деактивации нужно подключить backend: сменить статус пользователя, завершить сессии и скрыть публичную активность."
        isOpen={isDeactivateDialogOpen}
        onConfirmAction={() => setIsDeactivateDialogOpen(false)}
        onOpenChangeAction={setIsDeactivateDialogOpen}
        title="Деактивировать аккаунт?"
      />

      <ConfirmActionDialog
        actionLabel="Удалить аккаунт"
        description="Для безопасности сейчас это только UI-подтверждение. После подключения backend мы отправим запрос удаления аккаунта здесь."
        isOpen={isDeleteDialogOpen}
        onConfirmAction={() => setIsDeleteDialogOpen(false)}
        onOpenChangeAction={setIsDeleteDialogOpen}
        title="Удалить аккаунт?"
      />
    </>
  );
}
