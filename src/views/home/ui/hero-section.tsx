import Link from "next/link";
import { Button, Input } from "antd";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { heroStats } from "@/src/shared/lib/mock-data";

export function HeroSection() {
  return (
    <section className="hero-shell relative overflow-hidden rounded-[44px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
      <div className="animate-orb absolute -right-12 top-0 h-56 w-56 rounded-full bg-[rgba(147,3,197,0.16)] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[rgba(248,143,34,0.14)] blur-3xl" />

      <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/76 px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
            Платформа нового поколения для объявлений и услуг
          </div>

          <h1 className="font-heading mt-6 max-w-4xl text-4xl font-extrabold leading-[1.02] text-[var(--brand-deep)] sm:text-5xl lg:text-6xl">
            Мы строим современный marketplace, где продавать и находить нужное проще и приятнее.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#52606D] sm:text-lg">
            Snabix — это будущая платформа объявлений, товаров и услуг с
            чистым интерфейсом, понятным опытом и сильной архитектурной
            основой под реальный коммерческий продукт.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up">
              <Button
                className="!h-12 !rounded-[18px] !border-none !bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] !px-6 !font-semibold !text-white"
                type="primary"
              >
                Начать сейчас
              </Button>
            </Link>
            <Link href="#about">
              <Button className="!h-12 !rounded-[18px] !border-[var(--border-soft)] !px-6 !font-semibold">
                Узнать больше
              </Button>
            </Link>
          </div>
        </div>

        <div className="surface-card rounded-[34px] p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7d8597]">
            Быстрый старт
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
            Первая точка входа в продукт
          </h2>
          <div className="mt-6">
            <Input
              className="!h-14 !rounded-[20px]"
              placeholder="Поиск по товарам, услугам и категориям"
              prefix={<Search className="h-4 w-4 text-[var(--accent)]" />}
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[var(--border-soft)] bg-white/72 px-5 py-5"
              >
                <p className="font-heading text-3xl font-extrabold text-[var(--brand-deep)]">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-[#667085]">{item.label}</p>
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
