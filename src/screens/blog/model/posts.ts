import { BadgeCheck, BookOpen, ShieldCheck, Sparkles, Store } from "lucide-react";

export const blogPosts = [
  {
    category: "Новости",
    date: "30 мая 2026",
    description: "Рассказываем, почему Snabix строится вокруг доверия, аккуратных карточек и понятного локального каталога.",
    icon: Sparkles,
    readingTime: "4 мин",
    slug: "marketplace-doveriya",
    title: "Marketplace доверия: каким мы видим Snabix",
  },
  {
    category: "Инструкция",
    date: "30 мая 2026",
    description: "Короткий гид по созданию объявления: категория, фото, цена, характеристики и отправка на проверку.",
    icon: BookOpen,
    readingTime: "5 мин",
    slug: "kak-sozdat-obyavlenie",
    title: "Как подготовить объявление, которое хочется открыть",
  },
  {
    category: "Безопасность",
    date: "30 мая 2026",
    description: "Какие сигналы помогут покупателю быстрее понять, стоит ли писать продавцу.",
    icon: ShieldCheck,
    readingTime: "3 мин",
    slug: "doverie-k-prodavcu",
    title: "Доверие к продавцу: что важно показать в профиле",
  },
  {
    category: "Продукт",
    date: "30 мая 2026",
    description: "Почему товары и услуги должны жить в одной платформе, но использовать разные формы и характеристики.",
    icon: Store,
    readingTime: "4 мин",
    slug: "tovary-i-uslugi",
    title: "Товары и услуги: как мы проектируем каталог",
  },
  {
    category: "Обновления",
    date: "30 мая 2026",
    description: "Избранное, медиа объявлений, фильтры и будущие отзывы постепенно складываются в личный кабинет продавца.",
    icon: BadgeCheck,
    readingTime: "2 мин",
    slug: "lichnyy-kabinet",
    title: "Личный кабинет как центр управления объявлениями",
  },
] as const;
