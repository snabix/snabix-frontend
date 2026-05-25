"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { LayoutGrid, List, PackageOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ListingCard, type PublicListingItem } from "@/src/entities/listing";
import { listPublicListings, type ListPublicListingsParams } from "@/src/features/listing/api";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Container } from "@/src/shared/ui/container";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";
import {
  defaultPublicListingFilters,
  PublicListingFilters,
  type PublicListingFiltersState,
} from "./public-listing-filters";

const publicListingsPerPage = 15;

const defaultPaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: publicListingsPerPage,
  to: null,
  total: 0,
};

export function HomePage() {
  const [items, setItems] = useState<PublicListingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [favoriteListingIds, setFavoriteListingIds] = useState<Set<string>>(new Set());
  const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultPaginationMeta);
  const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [, startFiltersTransition] = useTransition();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startFiltersTransition(() => {
        setPage(1);
        setAppliedFilters(draftFilters);
      });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [draftFilters]);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const listings = await listPublicListings({
          ...toPublicListingParams(appliedFilters),
          page,
          perPage: publicListingsPerPage,
        });

        if (!isMounted) {
          return;
        }

        setItems(listings.items);
        setPaginationMeta(listings.meta);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = extractApiError(error, "Не удалось загрузить объявления.");

        setErrorMessage(message);
        setItems([]);
        setPaginationMeta(defaultPaginationMeta);
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
  }, [appliedFilters, page]);

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

  const handleFiltersReset = () => {
    setDraftFilters(defaultPublicListingFilters);
    setAppliedFilters(defaultPublicListingFilters);
    setPage(1);
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
            <div className="mb-5 flex justify-end">
              <ViewModeSwitcher
                onChange={setViewMode}
                value={viewMode}
              />
            </div>

            <div className="grid gap-5 xl:flex xl:items-start">
              <PublicListingFilters
                filters={draftFilters}
                isLoading={isLoading}
                onChange={setDraftFilters}
                onReset={handleFiltersReset}
              />

              <div className="min-w-0 flex-1">
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
                  <>
                    <div className={viewMode === "grid" ? "grid gap-5 lg:grid-cols-3" : "grid gap-4"}>
                      {items.map((item) => (
                        <ListingCard
                          detailsHref={`/account/listings/${item.id}`}
                          isFavorite={favoriteListingIds.has(item.id)}
                          key={item.id}
                          listing={item}
                          onFavoriteToggle={handleFavoriteToggle}
                          showStatus={false}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>

                    {paginationMeta.lastPage > 1 ? (
                      <div className="mt-7 flex flex-wrap items-center justify-end gap-4 border-t border-[var(--border-soft)] pt-5">
                        <div className="flex items-center gap-2">
                          <Button
                            disabled={page <= 1 || isLoading}
                            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                            type="button"
                            variant="outline"
                          >
                            Назад
                          </Button>
                          <span className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--brand-deep)]">
                            {paginationMeta.currentPage} / {paginationMeta.lastPage}
                          </span>
                          <Button
                            disabled={page >= paginationMeta.lastPage || isLoading}
                            onClick={() => setPage((currentPage) => Math.min(currentPage + 1, paginationMeta.lastPage))}
                            type="button"
                            variant="outline"
                          >
                            Вперед
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </section>
        </Container>
    </main>
  );
}

function ViewModeSwitcher({
  onChange,
  value,
}: {
  onChange: (value: "grid" | "list") => void;
  value: "grid" | "list";
}) {
  return (
    <div className="flex rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-1">
      <button
        aria-label="Показать объявления сеткой"
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
          value === "grid"
            ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
            : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
        ].join(" ")}
        onClick={() => onChange("grid")}
        type="button"
      >
        <LayoutGrid size={16} />
        Сетка
      </button>
      <button
        aria-label="Показать объявления списком"
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
          value === "list"
            ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
            : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
        ].join(" ")}
        onClick={() => onChange("list")}
        type="button"
      >
        <List size={16} />
        Список
      </button>
    </div>
  );
}

function toPublicListingParams(filters: PublicListingFiltersState): ListPublicListingsParams {
  return {
    maxPrice: toOptionalNumber(filters.maxPrice),
    minPrice: toOptionalNumber(filters.minPrice),
    sort: filters.sort,
    type: toOptionalNumber(filters.type),
  };
}

function toOptionalNumber(value: string): number | undefined {
  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : undefined;
}
