import Link from "next/link";
import { ArrowLeft, Compass, Home, SearchX, ShieldCheck } from "lucide-react";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export default function NotFound() {
  return (
    <main className="min-h-screen overflow-hidden py-4">
      <Container className="flex min-h-[calc(100vh-32px)] flex-col">
        <header className="surface-card flex items-center justify-between rounded-[30px] px-4 py-4 sm:px-6">
          <Logo />

          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 text-sm font-black text-[var(--brand-deep)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
            href="/"
          >
            <Home aria-hidden="true" size={17} />
            Главная
          </Link>
        </header>

        <section className="grid flex-1 place-items-center py-10">
          <div className="relative w-full max-w-5xl">
            <div className="pointer-events-none absolute -left-20 top-8 size-72 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_24%,transparent),transparent_68%)]" />
            <div className="pointer-events-none absolute -right-20 bottom-2 size-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand-deep)_10%,transparent),transparent_70%)]" />

            <div className="surface-card relative overflow-hidden rounded-[42px] p-6 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />

              <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-deep)]">
                    <SearchX aria-hidden="true" size={15} />
                    Страница не найдена
                  </div>

                  <h1 className="font-heading mt-6 text-5xl font-black leading-none text-[var(--brand-deep)] sm:text-7xl">
                    404
                  </h1>

                  <p className="mt-5 max-w-2xl text-lg font-black leading-8 text-[var(--brand-deep)]">
                    Похоже, эта страница ушла с витрины.
                  </p>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                    Возможно, ссылка устарела, раздел еще не создан или адрес введен с ошибкой.
                    Вернитесь на главную или продолжите работу в личном кабинете.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      className="active-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black shadow-[var(--shadow-card)]"
                      href="/"
                    >
                      <ArrowLeft aria-hidden="true" size={18} />
                      На главную
                    </Link>

                    <Link
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-5 text-sm font-black text-[var(--brand-deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
                      href="/account/profile"
                    >
                      <Compass aria-hidden="true" size={18} />
                      В профиль
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto grid size-[min(76vw,340px)] place-items-center">
                  <div className="absolute inset-0 rounded-[44px] bg-[linear-gradient(135deg,var(--brand),color-mix(in_srgb,var(--brand)_76%,var(--background)))] shadow-[var(--shadow-soft)]" />
                  <div className="absolute inset-8 rounded-[34px] border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]" />
                  <div className="relative grid size-28 place-items-center rounded-[34px] bg-[color-mix(in_srgb,var(--foreground)_16%,transparent)] text-[var(--foreground)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--foreground)_24%,transparent)]">
                    <ShieldCheck aria-hidden="true" size={48} strokeWidth={1.8} />
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-[color-mix(in_srgb,var(--foreground)_14%,transparent)] px-4 py-3 text-center text-sm font-black text-[color-mix(in_srgb,var(--foreground)_86%,transparent)]">
                    Snabix держит маршрут
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
