import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ClipboardList,
  Compass,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
} from "lucide-react";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";

const emptySteps = [
  {
    icon: Camera,
    title: "Добавьте фото",
    description: "Первое впечатление решает. Покажите вещь или услугу честно и крупно.",
  },
  {
    icon: Tags,
    title: "Выберите категорию",
    description: "Категории помогут людям быстрее найти объявление рядом с собой.",
  },
  {
    icon: ShieldCheck,
    title: "Опубликуйте безопасно",
    description: "Профиль, история и модерация будут усиливать доверие к объявлению.",
  },
] as const;

const previewCards = [
  { title: "iPhone 14 Pro", meta: "Электроника", price: "72 000 ₽" },
  { title: "Услуги мастера", meta: "Ремонт", price: "от 1 500 ₽" },
  { title: "Детская коляска", meta: "Детские товары", price: "8 900 ₽" },
] as const;

export function ListingsPage() {
  return (
    <AccountLayout>
      <div className="grid gap-6">
        <section className="surface-card relative overflow-hidden rounded-[34px] p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(0,70,67,0.2),transparent_68%)]" />
          <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-2/3 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,70,67,0.12),transparent_70%)]" />

          <div className="relative grid gap-10 xl:grid-cols-[1fr_420px] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-deep)]">
                <Sparkles aria-hidden="true" size={15} />
                Пора создать первое объявление
              </div>

              <h1 className="font-heading mt-6 max-w-3xl text-4xl font-black leading-[1.05] text-[var(--brand-deep)] sm:text-5xl">
                Здесь пока тихо, но скоро появится ваша витрина.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
                Разместите первое объявление, чтобы покупатели увидели ваше предложение.
                Мы подготовим карточку так, чтобы она выглядела чисто, понятно и вызывала доверие.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  className="active-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black shadow-[0_18px_36px_rgba(0,70,67,0.18)]"
                  type="button"
                >
                  <Plus aria-hidden="true" size={18} />
                  Создать объявление
                </button>

                <button
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-5 text-sm font-black text-[var(--brand-deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                  type="button"
                >
                  <Compass aria-hidden="true" size={18} />
                  Посмотреть пример
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="absolute -left-5 top-10 z-10 hidden rotate-[-8deg] rounded-3xl border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:block">
                <Search aria-hidden="true" className="text-[var(--brand-deep)]" size={24} />
              </div>

              <div className="rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-4 shadow-[0_28px_70px_rgba(0,70,67,0.14)]">
                <div className="rounded-[26px] bg-[linear-gradient(135deg,var(--brand),color-mix(in_srgb,var(--brand)_78%,#2AABEE))] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white/14">
                      <ClipboardList aria-hidden="true" size={23} />
                    </div>
                    <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-black">
                      draft
                    </span>
                  </div>

                  <p className="mt-8 text-sm font-semibold text-white/72">Мои объявления</p>
                  <p className="mt-1 text-3xl font-black">0 активных</p>
                </div>

                <div className="mt-4 grid gap-3">
                  {previewCards.map((card, index) => (
                    <div
                      className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-3"
                      key={card.title}
                    >
                      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
                        <span className="text-sm font-black">0{index + 1}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[var(--brand-deep)]">
                          {card.title}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">
                          {card.meta}
                        </p>
                      </div>

                      <p className="text-sm font-black text-[var(--brand-deep)]">{card.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {emptySteps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                className="surface-card group rounded-[30px] p-6 transition-all duration-300 hover:-translate-y-1"
                key={step.title}
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)] transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden="true" size={22} />
                </div>

                <h2 className="font-heading mt-5 text-lg font-black text-[var(--brand-deep)]">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="surface-card flex flex-col gap-4 rounded-[30px] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
              <BadgeCheck aria-hidden="true" size={22} />
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-[var(--brand-deep)]">
                Следующий шаг — категории
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Как только появится справочник категорий, форма объявления сможет стать настоящей.
              </p>
            </div>
          </div>

          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border-soft)] px-5 text-sm font-black text-[var(--brand-deep)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
            type="button"
          >
            Перейти к категориям
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </section>
      </div>
    </AccountLayout>
  );
}
