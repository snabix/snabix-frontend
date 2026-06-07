import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  Layers3,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/src/shared/ui/container";
import { Button } from "@/src/shared/ui/shadcn/button";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";

const stats = [
  { label: "категорий", value: "120+" },
  { label: "сценариев сделок", value: "15+" },
  { label: "доступность", value: "24/7" },
];

const featureCards = [
  {
    description: "Каталог, фильтры и карточки объявлений помогают быстро перейти от идеи к подходящему предложению.",
    icon: Search,
    title: "Быстрый поиск",
  },
  {
    description: "Профили, отзывы, статусы и аккуратная модерация делают взаимодействие спокойнее и понятнее.",
    icon: ShieldCheck,
    inverted: true,
    title: "Доверие к продавцу",
  },
  {
    description: "Избранное, уведомления и личный кабинет помогают не терять важные объявления и действия.",
    icon: BellRing,
    title: "Живой кабинет",
  },
  {
    description: "Категории и характеристики проектируются так, чтобы товары и услуги имели разные формы.",
    icon: Layers3,
    title: "Гибкая структура",
  },
];

const principles = [
  {
    icon: Store,
    title: "Для товаров и услуг",
    text: "Snabix создается как единая платформа локальных предложений: от техники и вещей до услуг, вакансий и аренды.",
  },
  {
    icon: MapPinned,
    title: "Рядом с пользователем",
    text: "Фокус на региональности помогает быстрее находить предложения поблизости и договариваться без лишних барьеров.",
  },
  {
    icon: UsersRound,
    title: "Понятный продавец",
    text: "Интерфейс должен сразу отвечать на вопрос: кто продает, насколько он надежен и стоит ли ему писать.",
  },
];

export function AboutPage() {
  return (
    <PublicLayout>
      <main className="pb-16 pt-6">
        <Container>
          <section className="overflow-hidden rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-4">
            <div className="rounded-[28px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_72%,var(--palette-light-gray)),color-mix(in_srgb,var(--surface)_92%,transparent))] p-4 text-[var(--brand-deep)] dark:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,var(--palette-midnight)),var(--surface))] sm:p-6 lg:p-8">
              <HeroSection />
              <ManifestSection />
              <FeaturesSection />
              <WhySection />
            </div>
          </section>
        </Container>
      </main>
    </PublicLayout>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[26px]">
      <div className="grid gap-5 lg:grid-cols-[1fr_170px]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em]">
            <span className="rounded-full border border-[var(--border-strong)] px-4 py-2">
              Marketplace доверия
            </span>
            <span className="text-[var(--text-muted)]">
              Товары · услуги · локальные предложения
            </span>
          </div>

          <h1 className="font-heading relative z-10 max-w-[980px] text-[clamp(4.6rem,14vw,13rem)] font-black uppercase leading-[0.76] tracking-[-0.11em] text-[var(--brand-deep)]">
            Snabix
            <span className="block pl-[18vw] text-[clamp(3.7rem,12vw,11rem)]">
              Market
            </span>
          </h1>

          <p className="mt-5 max-w-sm text-[11px] font-bold uppercase leading-5 tracking-[0.08em] text-[var(--text-muted)]">
            Современная платформа объявлений и локальных предложений, где чистый интерфейс помогает быстрее найти, договориться и совершить сделку.
          </p>
        </div>

        <div className="grid content-start gap-5 pt-10 text-right max-lg:grid-cols-3 max-lg:pt-0 max-sm:grid-cols-1 max-sm:text-left">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-4xl font-black leading-none tracking-[-0.08em]">
                {stat.value}
              </div>
              <div className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--brand)_18%,var(--surface))] shadow-[var(--shadow-card)]">
        <MarketplaceVisual />
        <div className="absolute bottom-5 left-5 max-w-[260px] text-white">
          <p className="font-heading text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">
            Будущее локальных сделок
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] opacity-80">
            with Snabix
          </p>
        </div>
      </div>
    </section>
  );
}

function MarketplaceVisual() {
    return (
        <div className="relative min-h-[420px] overflow-hidden bg-[linear-gradient(135deg,var(--palette-midnight),var(--palette-dark-gray)_50%,var(--palette-silver))]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,color-mix(in_srgb,var(--palette-silver)_46%,transparent),transparent_24rem),radial-gradient(circle_at_82%_18%,color-mix(in_srgb,var(--palette-orange)_28%,transparent),transparent_20rem)]" />

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.55))]" />

            <div className="absolute inset-x-0 bottom-16 h-28 skew-y-[-4deg] bg-[color-mix(in_srgb,var(--palette-silver)_72%,transparent)] blur-[1px]" />

            <div className="absolute left-[18%] top-[16%] h-44 w-[38%] overflow-hidden rounded-[30px] border border-white/55 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--palette-silver)_84%,transparent),color-mix(in_srgb,var(--palette-orange)_18%,transparent))] shadow-[0_34px_80px_rgba(0,0,0,0.36)] backdrop-blur-sm" />
            <div className="absolute left-[43%] top-[8%] h-52 w-[34%] overflow-hidden rounded-[30px] border border-white/50 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--palette-silver)_72%,transparent),color-mix(in_srgb,var(--palette-light-gray)_22%,transparent))] shadow-[0_34px_80px_rgba(0,0,0,0.34)] backdrop-blur-sm" />
            <div className="absolute left-[25%] top-[42%] h-40 w-[30%] overflow-hidden rounded-[28px] border border-white/45 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--palette-midnight)_82%,transparent),color-mix(in_srgb,var(--palette-orange)_16%,transparent))] shadow-[0_34px_70px_rgba(0,0,0,0.42)] backdrop-blur-sm" />
            <div className="absolute left-[52%] top-[39%] h-36 w-[27%] overflow-hidden rounded-[28px] border border-white/40 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--palette-midnight)_74%,transparent),color-mix(in_srgb,var(--palette-silver)_16%,transparent))] shadow-[0_34px_70px_rgba(0,0,0,0.38)] backdrop-blur-sm" />
            <div className="absolute right-8 top-8 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl">
                Все рядом
            </div>
        </div>
    );
}

function ManifestSection() {
  return (
    <section className="py-10 text-center sm:py-14">
      <p className="mx-auto max-w-5xl font-heading text-[clamp(2rem,5vw,4.1rem)] font-black uppercase leading-[0.96] tracking-[-0.08em] text-[var(--brand-deep)]">
        Snabix объединяет понятный каталог,
        <span className="block text-[var(--text-muted)]">
          чистые объявления, доверие к продавцу
        </span>
        <span className="block text-[color-mix(in_srgb,var(--brand-deep)_44%,transparent)]">
          и локальную экспертизу
        </span>
      </p>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.92fr_1fr]">
      <div className="grid gap-3">
        {featureCards.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>

      <div className="relative min-h-[560px] overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand)_52%,var(--surface)),color-mix(in_srgb,var(--background)_92%,var(--brand)))] p-5 shadow-[var(--shadow-card)]">
        <div className="absolute inset-0 grayscale">
          <MarketplaceVisual />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.54))]" />
        <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end">
          <div className="rounded-[24px] border border-white/28 bg-white/14 p-5 text-white backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-75">
              Продуктовая идея
            </p>
            <h2 className="font-heading mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.08em]">
              Найти. Проверить. Договориться.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 opacity-82">
              Мы проектируем Snabix как площадку, где у пользователя меньше шума,
              больше контекста и понятный следующий шаг в каждой сделке.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  description,
  icon: Icon,
  inverted = false,
  title,
}: {
  description: string;
  icon: LucideIcon;
  inverted?: boolean;
  title: string;
}) {
  return (
    <article
      className={[
        "group grid min-h-[126px] grid-cols-[1fr_auto] gap-4 rounded-[20px] border p-5 transition-colors",
        inverted
          ? "inverted-surface border-[var(--inverted-surface-border)]"
          : "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,var(--palette-light-gray))] text-[var(--brand-deep)] dark:bg-[color-mix(in_srgb,var(--surface)_84%,var(--palette-midnight))]",
      ].join(" ")}
    >
      <div className="self-end">
        <h3 className="font-heading text-right text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-3xl">
          {title}
        </h3>
        <p
          className={[
            "mt-4 max-w-[330px] text-[10px] font-bold uppercase leading-5 tracking-[0.08em]",
            inverted ? "text-white/68" : "text-[var(--text-muted)]",
          ].join(" ")}
        >
          {description}
        </p>
      </div>
      <div
        className={[
          "grid size-11 place-items-center rounded-full border transition-colors",
          inverted
            ? "border-white/24 text-white"
            : "border-[var(--border-soft)] text-[var(--accent)]",
        ].join(" ")}
      >
        <Icon size={19} />
      </div>
      <ArrowUpRight
        className={[
          "absolute opacity-0 transition-opacity group-hover:opacity-100",
          inverted ? "text-white" : "text-[var(--accent)]",
        ].join(" ")}
        size={18}
      />
    </article>
  );
}

function WhySection() {
  return (
    <section className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative min-h-[300px] overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--brand)_22%,var(--surface))] p-6">
        <div className="absolute -bottom-24 -left-12 h-80 w-[58%] rounded-[48px] border border-[var(--border-soft)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand)_70%,var(--palette-silver)),color-mix(in_srgb,var(--surface)_88%,transparent))] shadow-[var(--shadow-soft)]" />
        <div className="absolute bottom-10 left-[22%] h-32 w-[34%] rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--brand-deep)_78%,transparent)] shadow-[var(--shadow-card)]" />
        <div className="relative z-10 ml-auto max-w-lg text-right">
          <h2 className="font-heading text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.1em] text-[var(--brand-deep)]">
            Why
            <span className="block">Snabix?</span>
          </h2>
          <Link href="/">
            <Button className="mt-5 rounded-full" variant="outline">
              Смотреть объявления
              <ArrowUpRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {principles.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5"
              key={item.title}
            >
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-black uppercase leading-none tracking-[-0.04em] text-[var(--brand-deep)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    {item.text}
                  </p>
                </div>
              </div>
            </article>
          );
        })}

        <div className="inverted-surface rounded-[22px] border p-5">
          <div className="flex items-center gap-3">
            <Sparkles size={20} />
            <p className="text-[10px] font-black uppercase tracking-[0.18em]">
              Следующий шаг
            </p>
          </div>
          <p className="font-heading mt-4 text-2xl font-black uppercase leading-[0.94] tracking-[-0.06em]">
            Делаем продукт, который ощущается не шаблоном, а рабочим коммерческим marketplace.
          </p>
        </div>
      </div>
    </section>
  );
}
