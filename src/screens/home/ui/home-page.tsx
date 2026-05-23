"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ListingCard, type PublicListingItem } from "@/src/entities/listing";
import { listPublicListings } from "@/src/features/listing/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Container } from "@/src/shared/ui/container";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

export function HomePage() {
  const [items, setItems] = useState<PublicListingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [favoriteListingIds, setFavoriteListingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const listings = await listPublicListings({ perPage: 24 });

        if (!isMounted) {
          return;
        }

        setItems(listings.items);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = extractApiError(error, "Не удалось загрузить объявления.");

        setErrorMessage(message);
        setItems([]);
        toast.error(message);
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

  const handleFavoriteToggle = (listingId: string) => {
    setFavoriteListingIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(listingId)) {
        nextIds.delete(listingId);
      } else {
        nextIds.add(listingId);
      }

      return nextIds;
    });
  };

  return (
    <main className="pb-12 pt-6">
        <Container>
          <section className="surface-card relative overflow-hidden rounded-[34px] p-7 sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--brand)_16%,transparent),transparent_72%)]" />

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
              <SkeletonPanel className="min-h-[280px]" />
            ) : errorMessage !== null ? (
              <EmptyState
                action={
                  <Button
                    className="rounded-[18px] px-5 py-6"
                    onClick={() => window.location.reload()}
                    type="button"
                  >
                    Обновить страницу
                  </Button>
                }
                description="Мы не смогли получить объявления с сервера. Можно обновить страницу чуть позже или перейти в личный кабинет, если нужно продолжить работу с объявлениями."
                icon={RefreshCw}
                title="Витрина временно недоступна"
              />
            ) : items.length === 0 ? (
              <EmptyState
                description="После запуска первых публикаций здесь появится живая витрина товаров и услуг."
                icon={PackageOpen}
                title="Пока нет опубликованных объявлений"
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {items.map((item) => (
                  <ListingCard
                    detailsHref={`/account/listings/${item.id}`}
                    isFavorite={favoriteListingIds.has(item.id)}
                    key={item.id}
                    listing={item}
                    onFavoriteToggle={handleFavoriteToggle}
                    showStatus={false}
                  />
                ))}
              </div>
            )}
          </section>
        </Container>
    </main>
  );
}
