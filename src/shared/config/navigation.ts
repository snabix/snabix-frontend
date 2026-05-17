export const accountNavigation = [
    { label: "Профиль", href: "/account/profile", key: "profile" },
    { label: "Объявления", href: "/account/listings", key: "listings" },
    { label: "Отзывы", href: "/account/reviews", key: "reviews" },
    { label: "Настройки", href: "/account/settings", key: "settings" },
    { label: "Экспорт данных", href: "/account/export", key: "export" },
] as const;

export type AccountNavigationKey = (typeof accountNavigation)[number]["key"];
