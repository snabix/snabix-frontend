import Link from "next/link";
import {
  BadgeCheck,
  BookOpenCheck,
  Compass,
  Handshake,
  Layers3,
  MapPinned,
  Megaphone,
  MessagesSquare,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { Container } from "@/src/shared/ui/container";
import { Button } from "@/src/shared/ui/shadcn/button";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";

const roadmapItems = [
  {
    badge: "Сейчас",
    description: "Строим основу: аккаунты, профиль, объявления, категории, характеристики и аккуратную витрину товаров и услуг.",
    icon: Store,
    title: "Запуск ядра marketplace",
  },
  {
    badge: "Следом",
    description: "Развиваем карточки объявлений, медиа, избранное, фильтры, отзывы и понятные сценарии управления публикациями.",
    icon: Layers3,
    title: "Удобные объявления",
  },
  {
    badge: "Рост",
    description: "Добавим больше доверия: рейтинги продавцов, историю действий, модерацию, безопасные подсказки и прозрачные статусы.",
    icon: ShieldCheck,
    title: "Marketplace доверия",
  },
  {
    badge: "Будущее",
    description: "Подготовим продвижение, бизнес-витрины, локальные подборки, уведомления, улучшенный поиск и инструменты для продавцов.",
    icon: Rocket,
    title: "Коммерческая платформа",
  },
];

const useSteps = [
  {
    description: "Выберите товар или услугу, откройте каталог и сузьте выдачу через понятные фильтры.",
    icon: Search,
    title: "Найдите нужное",
  },
  {
    description: "Оцените фото, цену, город, характеристики и доверительные сигналы продавца.",
    icon: BadgeCheck,
    title: "Проверьте объявление",
  },
  {
    description: "Свяжитесь с продавцом, уточните детали и договоритесь о формате сделки.",
    icon: MessagesSquare,
    title: "Договоритесь напрямую",
  },
  {
    description: "Размещайте свои предложения, управляйте ими в личном кабинете и развивайте локальные продажи.",
    icon: Megaphone,
    title: "Публикуйте своё",
  },
];

const trustPrinciples = [
  "Понятная структура объявления: фото, цена, категория, характеристики и локация без визуального шума.",
  "Разделение товаров и услуг, чтобы форма публикации подстраивалась под реальный тип предложения.",
  "Акцент на профиле продавца, рейтинге, отзывах и прозрачной истории действий.",
  "Модерация и статусы публикаций, чтобы пользователь понимал, что происходит с объявлением.",
];

const productBlocks = [
  {
    description: "Snabix помогает находить товары и услуги рядом, не проваливая пользователя в перегруженный интерфейс.",
    icon: MapPinned,
    title: "Локальная платформа",
  },
  {
    description: "Категории и характеристики проектируются гибко: электроника, авто, услуги и недвижимость могут иметь разные поля.",
    icon: Compass,
    title: "Гибкий каталог",
  },
  {
    description: "Мы строим не просто доску объявлений, а продукт, где доверие продавцу видно уже в интерфейсе.",
    icon: Handshake,
    title: "Фокус на доверии",
  },
];

export function AboutPage() {
  return (
    <PublicLayout>
      <main className="pb-16 pt-6">
        <Container>
          <HeroRoadmap />
          <ProductIntro />
          <RoadmapSection />
          <HowToUseSection />
          <TrustSection />
          <FinalCta />
        </Container>
      </main>
    </PublicLayout>
  );
}

function HeroRoadmap() {
  return (
    <section className="hero-shell relative overflow-hidden rounded-[40px] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-[color-mix(in_srgb,var(--brand)_38%,transparent)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-8 h-32 w-72 rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
            О компании и продукте
          </p>
          <h1 className="font-heading mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-[var(--brand-deep)] sm:text-6xl">
            Snabix строится как понятный marketplace доверия для локальных сделок.
          </h1>
          <p className="section-copy mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            Это платформа объявлений, где пользователи смогут продавать товары,
            предлагать услуги, находить нужные предложения рядом и принимать
            решение быстрее: по карточке, профилю продавца, рейтингу и прозрачной
            структуре объявления.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/account/listings/create">
              <Button className="active-button rounded-[18px] px-6 py-6">
                Разместить объявление
              </Button>
            </Link>
            <Link href="/">
              <Button className="rounded-[18px] px-6 py-6" variant="outline">
                Смотреть витрину
              </Button>
            </Link>
          </div>
        </div>

        <div className="surface-card relative overflow-hidden rounded-[34px] p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_70%)]" />
          <div className="relative grid gap-4">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  className="grid grid-cols-[auto_1fr] gap-4 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-4"
                  key={item.title}
                >
                  <div className="grid justify-items-center gap-2">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[var(--active-button-bg)] text-[var(--active-button-text)]">
                      <Icon size={20} />
                    </div>
                    {index < roadmapItems.length - 1 ? (
                      <span className="h-10 w-px bg-[var(--border-strong)]" />
                    ) : null}
                  </div>
                  <div>
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                      {item.badge}
                    </span>
                    <h2 className="mt-3 font-heading text-xl font-black text-[var(--brand-deep)]">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductIntro() {
  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-3">
      {productBlocks.map((block) => {
        const Icon = block.icon;

        return (
          <article className="surface-card interactive-lift rounded-[30px] p-6" key={block.title}>
            <div className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
              <Icon size={22} />
            </div>
            <h2 className="font-heading mt-5 text-2xl font-black text-[var(--brand-deep)]">
              {block.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              {block.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}

function RoadmapSection() {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div className="surface-card sticky top-24 rounded-[32px] p-7">
        <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
          Дорожная карта
        </p>
        <h2 className="font-heading mt-4 text-3xl font-black tracking-[-0.03em] text-[var(--brand-deep)]">
          Мы двигаемся от чистой доски объявлений к полноценной платформе для локальной торговли.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
          Roadmap помогает держать продукт в фокусе: сначала стабильное ядро,
          затем доверие, удобство продавца, модерация, продвижение и более
          умный поиск.
        </p>
      </div>

      <div className="grid gap-4">
        {roadmapItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <article className="surface-card rounded-[30px] p-6" key={`roadmap-${item.title}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex items-center gap-3 sm:w-44">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
                    <Icon size={20} />
                  </span>
                  <span className="font-heading text-2xl font-black text-[var(--brand-deep)]">
                    0{index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HowToUseSection() {
  return (
    <section className="mt-10 surface-card rounded-[36px] p-7 sm:p-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
            Как пользоваться
          </p>
          <h2 className="font-heading mt-3 max-w-3xl text-3xl font-black tracking-[-0.03em] text-[var(--brand-deep)]">
            Сценарий должен быть простым: найти, оценить, связаться, договориться.
          </h2>
        </div>
        <BookOpenCheck className="text-[var(--accent)]" size={46} />
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {useSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article className="rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-5" key={step.title}>
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-[var(--active-button-bg)] text-[var(--active-button-text)]">
                  <Icon size={20} />
                </span>
                <span className="text-sm font-black text-[var(--text-muted)]">
                  шаг {index + 1}
                </span>
              </div>
              <h3 className="font-heading mt-5 text-xl font-black text-[var(--brand-deep)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <article className="surface-card rounded-[34px] p-7 sm:p-9">
        <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
          Наша идея
        </p>
        <h2 className="font-heading mt-4 text-3xl font-black tracking-[-0.03em] text-[var(--brand-deep)]">
          Marketplace доверия: пользователь должен понимать, кому он пишет и почему этому можно уделить время.
        </h2>
        <p className="mt-5 text-base leading-8 text-[var(--text-muted)]">
          У объявления мало времени, чтобы убедить человека открыть детали.
          Поэтому Snabix делает ставку на чистую карточку, понятную категорию,
          фотографии, характеристики и сигналы продавца. Чем меньше хаоса,
          тем быстрее пользователь принимает решение.
        </p>
      </article>

      <article className="surface-card rounded-[34px] p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[var(--accent)]" size={26} />
          <h3 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
            Что важно в продукте
          </h3>
        </div>
        <div className="mt-5 grid gap-3">
          {trustPrinciples.map((principle) => (
            <div
              className="rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-4 py-3 text-sm leading-7 text-[var(--brand-deep)]"
              key={principle}
            >
              {principle}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mt-10 overflow-hidden rounded-[36px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_42%,var(--surface)),color-mix(in_srgb,var(--background)_82%,var(--accent)))] p-7 shadow-[var(--shadow-soft)] sm:p-9">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
            Дальше будет больше
          </p>
          <h2 className="font-heading mt-3 text-3xl font-black tracking-[-0.03em] text-[var(--brand-deep)]">
            Snabix развивается как аккуратная, масштабируемая и коммерчески готовая платформа.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            Сейчас мы закладываем фундамент: архитектуру, каталог, объявления,
            профиль, медиа и доверительные механики. Это база, на которой можно
            строить поиск, продвижение, отзывы, модерацию и витрины бизнеса.
          </p>
        </div>

        <Link href="/">
          <Button className="active-button w-full rounded-[20px] px-7 py-6 lg:w-auto">
            Перейти к объявлениям
          </Button>
        </Link>
      </div>
    </section>
  );
}
