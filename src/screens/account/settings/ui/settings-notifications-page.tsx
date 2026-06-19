"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Clock3,
  Eye,
  Heart,
  Mail,
  Megaphone,
  MessageCircle,
  RotateCcw,
  Save,
  ShieldCheck,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Switch } from "@/src/shared/ui/shadcn/switch";
import { SettingsSection } from "./settings-shared";

type NotificationChannel = "site" | "email";

type NotificationCategory = "all" | "listings" | "messages" | "activity" | "system";

type NotificationPreferenceItem = {
  key: string;
  category: Exclude<NotificationCategory, "all">;
  title: string;
  description: string;
  icon: LucideIcon;
  channels: Record<NotificationChannel, boolean>;
  isRequired?: boolean;
};

const notificationTabs: Array<{
  key: NotificationCategory;
  label: string;
}> = [
  { key: "all", label: "Все" },
  { key: "listings", label: "Объявления" },
  { key: "messages", label: "Сообщения" },
  { key: "activity", label: "Активность" },
  { key: "system", label: "Система" },
];

const defaultNotificationPreferences: NotificationPreferenceItem[] = [
  {
    key: "new_messages",
    category: "messages",
    title: "Новые сообщения",
    description: "Получать уведомления о новых сообщениях от покупателей и продавцов.",
    icon: Bell,
    channels: { site: true, email: true },
  },
  {
    key: "listing_replies",
    category: "listings",
    title: "Ответы на объявления",
    description: "Получать уведомления об ответах, откликах и важных действиях по объявлениям.",
    icon: MessageCircle,
    channels: { site: true, email: true },
  },
  {
    key: "favorite_listings",
    category: "activity",
    title: "Избранные объявления",
    description: "Уведомлять об изменениях в объявлениях, которые вы добавили в избранное.",
    icon: Heart,
    channels: { site: true, email: false },
  },
  {
    key: "listing_views",
    category: "activity",
    title: "Просмотры объявления",
    description: "Уведомлять, когда ваше объявление активно просматривают.",
    icon: Eye,
    channels: { site: false, email: false },
  },
  {
    key: "recommendations",
    category: "activity",
    title: "Подборки и рекомендации",
    description: "Получать персональные рекомендации, интересные предложения и подборки.",
    icon: Star,
    channels: { site: true, email: false },
  },
  {
    key: "price_changes",
    category: "activity",
    title: "Изменение цены",
    description: "Уведомлять об изменении цены в избранных объявлениях.",
    icon: Tag,
    channels: { site: true, email: true },
  },
  {
    key: "listing_expiration",
    category: "listings",
    title: "Окончание срока публикации",
    description: "Напоминать, когда объявление скоро будет снято с публикации.",
    icon: Clock3,
    channels: { site: true, email: true },
  },
  {
    key: "security_login",
    category: "system",
    title: "Безопасность и вход",
    description: "Уведомления о входе в аккаунт, смене пароля и важных действиях.",
    icon: ShieldCheck,
    channels: { site: true, email: true },
    isRequired: true,
  },
  {
    key: "promotions_news",
    category: "system",
    title: "Акции и новости",
    description: "Получать новости о возможностях платформы, обновлениях и акциях.",
    icon: Megaphone,
    channels: { site: false, email: false },
  },
  {
    key: "email_digest",
    category: "system",
    title: "Email-рассылка",
    description: "Получать полезные подборки и важные новости на электронную почту.",
    icon: Mail,
    channels: { site: false, email: true },
  },
];

export function NotificationsSettingsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [preferences, setPreferences] = useState(defaultNotificationPreferences);

  const filteredPreferences = useMemo(() => {
    if (activeTab === "all") {
      return preferences;
    }

    return preferences.filter((item) => item.category === activeTab);
  }, [activeTab, preferences]);

  const enabledSiteCount = preferences.filter((item) => item.channels.site).length;
  const enabledEmailCount = preferences.filter((item) => item.channels.email).length;

  const handleToggleChannel = (
    itemKey: string,
    channel: NotificationChannel,
    checked: boolean,
  ) => {
    setPreferences((currentPreferences) =>
      currentPreferences.map((item) => {
        if (item.key !== itemKey) {
          return item;
        }

        if (item.isRequired && channel === "site" && checked === false) {
          toast.info("Системные уведомления на сайте нельзя полностью отключить.");
          return item;
        }

        return {
          ...item,
          channels: {
            ...item.channels,
            [channel]: checked,
          },
        };
      }),
    );
  };

  const handleReset = () => {
    setPreferences(defaultNotificationPreferences);
    setActiveTab("all");
    toast.success("Настройки уведомлений сброшены.");
  };

  const handleSave = () => {
    toast.success("Настройки уведомлений сохранены.");
  };

  return (
    <SettingsSection
      description="Выберите, какие уведомления вы хотите получать. Каждое событие можно отправлять внутри сайта, по email или сразу в оба канала."
      icon={Bell}
      title="Уведомления"
    >
      <div className="grid gap-6">
        <div className="rounded-[30px] border border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_32%),color-mix(in_srgb,var(--surface)_90%,transparent)] p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">
                Центр уведомлений
              </p>
              <h2 className="font-heading mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--brand-deep)]">
                Управляйте тем, что действительно важно
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                На сайте уведомления появятся внутри платформы, а email-уведомления будут отправляться
                на основной адрес аккаунта.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
              <NotificationCounterCard
                count={enabledSiteCount}
                icon={Bell}
                label="На сайте"
                total={preferences.length}
              />
              <NotificationCounterCard
                count={enabledEmailCount}
                icon={Mail}
                label="По email"
                total={preferences.length}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {notificationTabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                className={[
                  "shrink-0 rounded-full px-5 py-3 text-sm font-black transition",
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-[0_14px_30px_color-mix(in_srgb,var(--accent)_24%,transparent)]"
                    : "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] text-[var(--brand-deep)] hover:border-[var(--accent)]",
                ].join(" ")}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <div className="hidden border-b border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-5 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_170px_170px] lg:items-center">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Событие
            </span>
            <span className="text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
              На сайте
            </span>
            <span className="text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Email
            </span>
          </div>

          <div className="divide-y divide-[var(--border-soft)]">
            {filteredPreferences.map((item) => {
              const Icon = item.icon;
              const isSiteEnabled = item.channels.site;
              const isEmailEnabled = item.channels.email;
              const isEnabledSomewhere = isSiteEnabled || isEmailEnabled;

              return (
                <article
                  className="grid gap-5 px-5 py-5 transition hover:bg-[color-mix(in_srgb,var(--accent)_4%,transparent)] lg:grid-cols-[minmax(0,1fr)_170px_170px] lg:items-center"
                  key={item.key}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className={[
                        "grid size-13 shrink-0 place-items-center rounded-[22px] border transition",
                        isEnabledSomewhere
                          ? "border-[color-mix(in_srgb,var(--accent)_22%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] text-[var(--accent)]"
                          : "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] text-[var(--text-muted)]",
                      ].join(" ")}
                    >
                      <Icon aria-hidden="true" size={23} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base font-black text-[var(--brand-deep)]">
                          {item.title}
                        </h3>

                        {item.isRequired ? (
                          <span className="rounded-full border border-[color-mix(in_srgb,var(--accent)_24%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[var(--accent)]">
                            важно
                          </span>
                        ) : null}

                        {!isEnabledSomewhere ? (
                          <span className="rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            отключено
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <NotificationDeliverySwitch
                    checked={isSiteEnabled}
                    disabled={item.isRequired === true}
                    icon={Bell}
                    label="На сайте"
                    onCheckedChange={(checked) => handleToggleChannel(item.key, "site", checked)}
                  />

                  <NotificationDeliverySwitch
                    checked={isEmailEnabled}
                    icon={Mail}
                    label="Email"
                    onCheckedChange={(checked) => handleToggleChannel(item.key, "email", checked)}
                  />
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_34%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] text-[var(--accent)]">
                <Bell aria-hidden="true" size={22} />
              </div>

              <div>
                <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                  Мы уважаем вашу конфиденциальность
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                  Вы можете изменить настройки уведомлений в любое время. Мы не отправляем лишние
                  уведомления и оставляем только важные системные сообщения для безопасности аккаунта.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl" onClick={handleReset} type="button" variant="outline">
                <RotateCcw size={16} />
                Сбросить настройки
              </Button>

              <Button className="rounded-2xl" onClick={handleSave} type="button">
                <Save size={16} />
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

function NotificationCounterCard({
  count,
  icon: Icon,
  label,
  total,
}: {
  count: number;
  icon: LucideIcon;
  label: string;
  total: number;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon aria-hidden="true" size={18} />
          </div>
          <div>
            <p className="text-sm font-black text-[var(--brand-deep)]">{label}</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">Активно</p>
          </div>
        </div>

        <p className="font-heading text-xl font-black text-[var(--brand-deep)]">
          {count}/{total}
        </p>
      </div>
    </div>
  );
}

function NotificationDeliverySwitch({
  checked,
  disabled = false,
  icon: Icon,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 rounded-[22px] border px-4 py-3 transition lg:justify-center lg:border-transparent lg:bg-transparent lg:p-0",
        checked
          ? "border-[color-mix(in_srgb,var(--accent)_36%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--surface))]"
          : "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 lg:hidden">
        <Icon
          aria-hidden="true"
          className={checked ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}
          size={17}
        />
        <span className="text-sm font-black text-[var(--brand-deep)]">{label}</span>
      </div>

      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  );
}
