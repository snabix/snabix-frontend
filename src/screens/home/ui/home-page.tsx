"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { listPublicListings } from "@/src/features/listing/api/list-public-listings";
import type { ListingItem } from "@/src/features/listing/api/create-listing";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Container } from "@/src/shared/ui/container";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";

export function HomePage() {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        setIsLoading(true);
        const listings = await listPublicListings();

        if (!isMounted) {
          return;
        }

        setItems(listings);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        toast.error(extractApiError(error, "Не удалось загрузить объявления."));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PublicLayout>
      <main className="pb-12 pt-6">
        <Container>
          <section className="surface-card relative overflow-hidden rounded-[34px] p-7 sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(222,26,26,0.16),transparent_72%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                  Витрина объявлений
                </p>

                <h1 className="font-heading mt-4 text-4xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)] sm:text-5xl">
                  На главной теперь сразу видны актуальные товары и услуги.
                </h1>

                <p className="section-copy mt-5 max-w-2xl text-base leading-8">
                  Пользователь сразу попадает в живую витрину, а не на
                  абстрактный лендинг. Это ближе к реальному сценарию
                  marketplace и лучше готовит продукт к поиску, фильтрам и
                  карточкам объявлений.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/about">
                  <Button className="rounded-[18px] px-5 py-6" variant="outline">
                    О проекте
                  </Button>
                </Link>
                <Link href="/account/listings">
                  <Button className="active-button rounded-[18px] px-5 py-6">
                    Разместить объявление
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                  Последние публикации
                </p>
                <h2 className="font-heading mt-2 text-3xl font-extrabold text-[var(--brand-deep)]">
                  Объявления товаров и услуг
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="surface-card flex min-h-[280px] items-center justify-center rounded-[30px]">
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Данные загружаются...
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="surface-card rounded-[30px] p-8 text-center">
                <p className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
                  Пока нет опубликованных объявлений
                </p>
                <p className="section-copy mt-3 text-sm leading-7">
                  После запуска первых публикаций здесь появится живая витрина
                  товаров и услуг.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article className="surface-card rounded-[28px] p-5" key={item.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                            {item.typeLabel}
                          </span>
                          {item.isFeatured ? (
                            <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                              Рекомендуем
                            </span>
                          ) : null}
                        </div>

                        <h3 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
                          {item.title}
                        </h3>
                      </div>

                      <div className="rounded-full bg-[color-mix(in_srgb,var(--surface)_84%,white)] p-2 text-[var(--accent)]">
                        <BadgeCheck className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                      {item.description}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-[var(--brand-deep)]">
                      <div>
                        <span className="font-semibold">Категория:</span>{" "}
                        {item.category?.name ?? "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Цена:</span>{" "}
                        {item.price !== null ? `${new Intl.NumberFormat("ru-RU").format(item.price)} ${item.currency ?? ""}` : "По договорённости"}
                      </div>
                      <div>
                        <span className="font-semibold">Просмотры:</span>{" "}
                        {item.viewsCount}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Container>
      </main>
    </PublicLayout>
  );
}
