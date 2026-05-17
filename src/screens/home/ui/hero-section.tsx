import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { heroStats } from "@/src/shared/lib/mock-data";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";

export function HeroSection() {
  return (
    <section className="hero-shell relative overflow-hidden rounded-[44px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
      <div className="animate-orb absolute -right-12 top-0 h-56 w-56 rounded-full bg-[rgba(0,70,67,0.12)] blur-3xl dark:bg-[rgba(250,250,250,0.1)]" />
      <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[rgba(0,70,67,0.08)] blur-3xl dark:bg-[rgba(250,250,250,0.08)]" />

      <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
            Платформа нового поколения для объявлений и услуг
          </div>

          <h1 className="font-heading mt-6 max-w-4xl text-4xl font-extrabold leading-[1.02] text-[var(--brand-deep)] sm:text-5xl lg:text-6xl">
            Мы строим современный marketplace, где продавать и находить нужное проще и приятнее.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            Snabix — это будущая платформа объявлений, товаров и услуг с
            чистым интерфейсом, понятным опытом и сильной архитектурной
            основой под реальный коммерческий продукт.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up">
              <Button
                className="active-button h-12 rounded-[18px] px-6 font-semibold"
              >
                Начать сейчас
              </Button>
            </Link>
            <Link href="#about">
              <Button
                className="h-12 rounded-[18px] px-6 font-semibold"
                variant="outline"
              >
                Узнать больше
              </Button>
            </Link>
          </div>
        </div>

        <div className="surface-card rounded-[34px] p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Быстрый старт
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
            Первая точка входа в продукт
          </h2>
          <div className="mt-6">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]"
                strokeWidth={2.2}
              />
              <Input
                className="h-14 rounded-[20px] pl-12"
                placeholder="Поиск по товарам, услугам и категориям"
              />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] px-5 py-5"
              >
                <p className="font-heading text-3xl font-extrabold text-[var(--brand-deep)]">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            Смотреть roadmap главной
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
