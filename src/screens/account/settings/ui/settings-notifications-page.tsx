"use client";

import { useEffect, useState } from "react";
import { Bell, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import {
  getNotificationPreferences,
  resetNotificationPreferences,
  updateNotificationPreferences,
  type NotificationCategory,
  type NotificationPreference,
} from "@/src/entities/notification";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Switch } from "@/src/shared/ui/shadcn/switch";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";
import { SettingsSection } from "./settings-shared";

const categorySections: Array<{
  key: NotificationCategory;
  title: string;
  description: string;
}> = [
  { key: "messages", title: "Сообщения", description: "Диалоги между покупателями и продавцами." },
  { key: "listings", title: "Объявления", description: "События публикации и отклики на ваши предложения." },
  { key: "activity", title: "Активность", description: "Избранное, цены, просмотры и персональные подборки." },
  { key: "system", title: "Системные", description: "Безопасность аккаунта, новости и email-рассылки." },
];

export function NotificationsSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getNotificationPreferences()
      .then((items) => {
        if (isMounted) setPreferences(items);
      })
      .catch((error) => {
        if (isMounted) toast.error(extractApiError(error, "Не удалось загрузить настройки уведомлений."));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleChannel = (
    itemKey: string,
    channel: "siteEnabled" | "emailEnabled",
    checked: boolean,
  ) => {
    setPreferences((items) => items.map((item) => (
      item.key === itemKey ? { ...item, [channel]: checked } : item
    )));
  };

  const savePreferences = async () => {
    try {
      setIsSaving(true);
      setPreferences(await updateNotificationPreferences(preferences));
      toast.success("Настройки уведомлений сохранены.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сохранить настройки уведомлений."));
    } finally {
      setIsSaving(false);
    }
  };

  const resetPreferences = async () => {
    try {
      setIsResetting(true);
      setPreferences(await resetNotificationPreferences());
      toast.success("Настройки уведомлений сброшены.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сбросить настройки уведомлений."));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <SettingsSection
      description="Выберите доставку внутри сайта, по email или сразу в оба канала."
      icon={Bell}
      title="Уведомления"
    >
      {isLoading ? (
        <SkeletonPanel className="min-h-72" />
      ) : (
        <div>
          {categorySections.map((section) => {
            const items = preferences.filter((item) => item.category === section.key);

            return (
              <section className="border-t border-[var(--border-soft)] py-7" key={section.key}>
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-black text-[var(--brand-deep)]">{section.title}</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{section.description}</p>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_92px_92px] items-center gap-3 border-b border-[var(--border-soft)] pb-3 text-xs font-black uppercase text-[var(--text-muted)] max-sm:hidden">
                  <span>Событие</span>
                  <span className="text-center">На сайте</span>
                  <span className="text-center">Email</span>
                </div>

                <div className="divide-y divide-[var(--border-soft)]">
                  {items.map((item) => (
                    <NotificationPreferenceRow
                      item={item}
                      key={item.key}
                      onToggleAction={toggleChannel}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--border-soft)] pt-6">
            <Button
              disabled={isSaving || isResetting}
              onClick={resetPreferences}
              type="button"
              variant="outline"
            >
              <RotateCcw size={16} />
              {isResetting ? "Сбрасываем..." : "Сбросить настройки"}
            </Button>
            <Button disabled={isSaving || isResetting} onClick={savePreferences} type="button">
              <Save size={16} />
              {isSaving ? "Сохраняем..." : "Сохранить настройки"}
            </Button>
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

function NotificationPreferenceRow({
  item,
  onToggleAction,
}: {
  item: NotificationPreference;
  onToggleAction: (
    key: string,
    channel: "siteEnabled" | "emailEnabled",
    checked: boolean,
  ) => void;
}) {
  return (
    <article className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_92px_92px] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading font-black text-[var(--brand-deep)]">{item.title}</h3>
          {item.isRequired ? (
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">обязательно</span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>
      </div>

      <DeliverySwitch
        checked={item.siteEnabled}
        disabled={item.isRequired}
        label="На сайте"
        onCheckedChange={(checked) => onToggleAction(item.key, "siteEnabled", checked)}
      />
      <DeliverySwitch
        checked={item.emailEnabled}
        disabled={item.isRequired}
        label="Email"
        onCheckedChange={(checked) => onToggleAction(item.key, "emailEnabled", checked)}
      />
    </article>
  );
}

function DeliverySwitch({
  checked,
  disabled = false,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--brand-deep)] sm:justify-center">
      <span className="sm:sr-only">{label}</span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </label>
  );
}
