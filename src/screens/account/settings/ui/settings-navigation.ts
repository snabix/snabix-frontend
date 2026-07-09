import {
  Bell,
  Database,
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
}> = [
  {
    items: [
      { href: "/account/settings/profile", icon: UserRound, label: "Профиль" },
      { href: "/account/settings/account", icon: ShieldCheck, label: "Аккаунт" },
      { href: "/account/settings/privacy", icon: Database, label: "Конфиденциальность\nи данные" },
      { href: "/account/settings/notifications", icon: Bell, label: "Уведомления" },
      { href: "/account/settings/addresses", icon: MapPin, label: "Мои адреса" },
      { href: "/account/settings/sessions", icon: MonitorSmartphone, label: "Сессии" },
    ],
  },
];
