"use client";

import { Bell, Eye, Globe2, LockKeyhole, Mail, Moon, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/src/shared/ui/theme-switcher";

const notificationSettings = [
  { description: "Отклики, статусы объявлений и важные события аккаунта.", icon: Bell, title: "Уведомления в интерфейсе" },
  { description: "Письма о безопасности, восстановлении доступа и важных изменениях.", icon: Mail, title: "Email-уведомления" },
  { description: "Подсказки и рекомендации по улучшению объявлений.", icon: SlidersHorizontal, title: "Продуктовые подсказки" },
];

const privacySettings = [
  { description: "Показывать имя и рейтинг в карточках объявлений.", icon: Eye, title: "Публичный профиль" },
  { description: "Защищать важные действия дополнительными подтверждениями.", icon: LockKeyhole, title: "Безопасные действия" },
  { description: "Готовим настройки языка и регионального отображения.", icon: Globe2, title: "Язык и регион" },
];

export function SettingsPage() {
  const [enabledItems, setEnabledItems] = useState<Set<string>>(
    () => new Set(["Уведомления в интерфейсе", "Email-уведомления", "Публичный профиль", "Безопасные действия"]),
  );

  const toggleItem = (title: string) => {
    setEnabledItems((currentItems) => {
      const nextItems = new Set(currentItems);

      if (nextItems.has(title)) {
        nextItems.delete(title);
      } else {
        nextItems.add(title);
      }

      return nextItems;
    });
  };

  return (
    <div className="grid gap-6">
      <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_70%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
            <ShieldCheck size={15} />
            Настройки аккаунта
          </div>
          <h1 className="font-heading mt-5 max-w-3xl text-4xl font-black leading-[1.04] text-[var(--brand-deep)] sm:text-5xl">
            Управляйте темой, уведомлениями и приватностью в одном месте.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Это макет будущего центра настроек. Сейчас переключатели работают локально, а дальше их можно подключить к backend-профилю пользователя.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card rounded-[30px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                Тема
              </p>
              <h2 className="font-heading mt-3 text-2xl font-black text-[var(--brand-deep)]">
                Светлая или темная
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Переключатель темы остаётся единым для всего интерфейса.
              </p>
            </div>
            <Moon className="text-[var(--accent)]" size={28} />
          </div>
          <div className="mt-6 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5">
            <ThemeSwitcher />
          </div>
        </article>

        <SettingsGroup
          items={notificationSettings}
          onToggle={toggleItem}
          selectedItems={enabledItems}
          title="Уведомления"
        />
      </section>

      <SettingsGroup
        columns="lg:grid-cols-3"
        items={privacySettings}
        onToggle={toggleItem}
        selectedItems={enabledItems}
        title="Приватность и доступность"
      />
    </div>
  );
}

function SettingsGroup({
  columns = "md:grid-cols-2",
  items,
  onToggle,
  selectedItems,
  title,
}: {
  columns?: string;
  items: typeof notificationSettings;
  onToggle: (title: string) => void;
  selectedItems: Set<string>;
  title: string;
}) {
  return (
    <section className="surface-card rounded-[30px] p-6 sm:p-7">
      <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
        {title}
      </h2>
      <div className={`mt-5 grid gap-4 ${columns}`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isEnabled = selectedItems.has(item.title);

          return (
            <button
              className={[
                "rounded-[24px] border p-5 text-left transition-colors",
                isEnabled
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)]",
              ].join(" ")}
              key={item.title}
              onClick={() => onToggle(item.title)}
              type="button"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-2xl bg-[var(--active-button-bg)] text-[var(--active-button-text)]">
                  <Icon size={19} />
                </span>
                <span className={`h-6 w-11 rounded-full p-1 transition-colors ${isEnabled ? "bg-[var(--active-button-bg)]" : "bg-[var(--border-soft)]"}`}>
                  <span className={`block size-4 rounded-full bg-[var(--surface)] transition-transform ${isEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-black text-[var(--brand-deep)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
