import {
  Bell,
  KeyRound,
  Mail,
  MapPin,
  MonitorSmartphone,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type SettingsNavigationItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export const settingsNavigation: Array<{
  items: SettingsNavigationItem[];
  title: string;
}> = [
  {
    items: [
      { href: "/account/settings/profile", icon: UserRound, label: "Профиль" },
      { href: "/account/settings/account", icon: ShieldCheck, label: "Аккаунт" },
      { href: "/account/settings/notifications", icon: Bell, label: "Уведомления" },
      { href: "/account/settings/addresses", icon: MapPin, label: "Мои адреса" },
    ],
    title: "Общие",
  },
  {
    items: [
      { href: "/account/settings/emails", icon: Mail, label: "Emails" },
      { href: "/account/settings/password", icon: KeyRound, label: "Пароль и аутентификация" },
      { href: "/account/settings/sessions", icon: MonitorSmartphone, label: "Сессии" },
    ],
    title: "Доступ",
  },
];
