import { Container } from "@/src/shared/ui/container";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";
import { AboutSection } from "@/src/screens/home/ui/about-section";
import { BannerCarouselSection } from "@/src/screens/home/ui/banner-carousel-section";
import { BenefitsSection } from "@/src/screens/home/ui/benefits-section";
import { FeaturesSection } from "@/src/screens/home/ui/features-section";
import { HeroSection } from "@/src/screens/home/ui/hero-section";

const pillars = [
  {
    title: "Для кого платформа",
    text: "Для людей и небольших продавцов, которым нужно быстро разместить товар или услугу, найти покупателя и договориться напрямую без сложной встроенной оплаты и тяжёлого процесса публикации.",
  },
  {
    title: "Главная цель",
    text: "Создать современную площадку объявлений, где легко продавать новые и б/у товары, предлагать услуги и находить нужные предложения через понятный каталог и аккуратный интерфейс.",
  },
  {
    title: "Основа каталога",
    text: "Каталог строится вокруг двух больших направлений: товары и услуги. Это важнее, чем каталог компаний, потому что продукт ориентирован именно на публикацию объявлений.",
  },
];

const principles = [
  "Прямой контакт между клиентом и продавцом без обязательной встроенной доставки и оплаты.",
  "Гибкая структура категорий и характеристик, чтобы запчасти, мебель, техника и услуги могли иметь разные поля.",
  "Локальная и понятная навигация: сначала раздел, потом категория, потом фильтры и конкретное объявление.",
  "Архитектура, готовая к росту: модерация, поиск, избранное, продвижение и профиль продавца.",
];

export function AboutPage() {
  return (
    <PublicLayout>
      <main className="pb-14 pt-6">
        <Container>
          <section className="surface-card relative overflow-hidden rounded-[34px] p-7 sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(222,26,26,0.16),transparent_70%)]" />

            <div className="relative max-w-4xl">
              <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                О проекте
              </p>

              <h1 className="font-heading mt-4 text-4xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)] sm:text-5xl">
                SNABIX — современная платформа объявлений для товаров и услуг.
              </h1>

              <p className="section-copy mt-5 max-w-3xl text-base leading-8">
                Проект создаётся как удобная и чистая digital-площадка, где
                можно продавать товары, предлагать услуги и быстро находить
                нужные предложения без перегруженного интерфейса и лишней
                сложности в сценариях публикации.
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <article className="surface-card rounded-[28px] p-6" key={pillar.title}>
                <h2 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
                  {pillar.title}
                </h2>
                <p className="section-copy mt-4 text-sm leading-7">
                  {pillar.text}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="surface-card rounded-[30px] p-7">
              <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                Логика продукта
              </p>

              <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
                Товары и услуги должны жить в одной платформе, но в разных ветках каталога.
              </h2>

              <p className="section-copy mt-4 text-base leading-8">
                Для товара важны цена, состояние, бренд, модель, совместимость,
                размеры и другие характеристики. Для услуги важнее формат
                выполнения, специализация, зона выезда, длительность и условия
                работы. Поэтому backend строится так, чтобы характеристики
                определялись категорией, а не жёстко зашивались в одну таблицу.
              </p>
            </article>

            <article className="surface-card rounded-[30px] p-7">
              <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                Принципы
              </p>

              <div className="mt-4 grid gap-3">
                {principles.map((principle) => (
                  <div className="rounded-[20px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_90%,white)] px-4 py-3 text-sm leading-7 text-[var(--brand-deep)]" key={principle}>
                    {principle}
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-10">
            <HeroSection />
            <AboutSection />
            <BannerCarouselSection />
            <FeaturesSection />
            <BenefitsSection />
          </section>
        </Container>
      </main>
    </PublicLayout>
  );
}
