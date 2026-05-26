"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { ChevronRight, LayoutGrid, List, PackageOpen, RefreshCw, Tags } from "lucide-react";
import { toast } from "sonner";
import { type CategoryNode, useCategoryStore } from "@/src/entities/category";
import { ListingCard, type PublicListingItem } from "@/src/entities/listing";
import { listPublicListings, type ListPublicListingsParams } from "@/src/features/listing/api";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Container } from "@/src/shared/ui/container";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { Skeleton, SkeletonPanel } from "@/src/shared/ui/skeleton";
import {
  defaultPublicListingFilters,
  PublicListingFilters,
  type PublicListingFiltersState,
} from "@/src/screens/home/ui/public-listing-filters";

const publicListingsPerPage = 15;

const defaultPaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: publicListingsPerPage,
  to: null,
  total: 0,
};

type PublicListingsPageProps = {
  initialCategoryId?: number;
};

export function PublicListingsPage({
  initialCategoryId,
}: PublicListingsPageProps) {
  const [items, setItems] = useState<PublicListingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [favoriteListingIds, setFavoriteListingIds] = useState<Set<string>>(new Set());
  const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultPaginationMeta);
  const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(draftFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [, startFiltersTransition] = useTransition();
  const branches = useCategoryStore((state) => state.branches);
  const branchStatuses = useCategoryStore((state) => state.branchStatuses);
  const branchErrorMessages = useCategoryStore((state) => state.branchErrorMessages);
  const loadBranch = useCategoryStore((state) => state.loadBranch);
  const selectedCategory = initialCategoryId ? branches[initialCategoryId] ?? null : null;
  const selectedCategoryStatus = initialCategoryId ? branchStatuses[initialCategoryId] ?? "idle" : "idle";
  const selectedCategoryError = initialCategoryId ? branchErrorMessages[initialCategoryId] ?? null : null;

  useEffect(() => {
    if (initialCategoryId) {
      void loadBranch(initialCategoryId);
    }
  }, [initialCategoryId, loadBranch]);

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
          categoryId: initialCategoryId,
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
  }, [appliedFilters, initialCategoryId, page]);

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

          <div className="relative max-w-4xl">
            <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
              Публичная витрина
            </p>

            <h1 className="font-heading mt-4 text-4xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)] sm:text-5xl">
              {selectedCategory?.name ?? "Все товары и услуги"}
            </h1>

            <p className="section-copy mt-5 max-w-2xl text-base leading-8">
              Уточните цену и тип объявления. Если вы пришли из каталога,
              ниже покажем выбранную ветку и вложенные разделы для быстрого
              перехода.
            </p>
          </div>
        </section>

        <CategoryBranchPanel
          branch={selectedCategory}
          errorMessage={selectedCategoryError}
          selectedCategoryId={initialCategoryId}
          status={selectedCategoryStatus}
        />

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
                  description="Мы не смогли получить объявления с сервера. Можно обновить страницу чуть позже."
                  icon={RefreshCw}
                  title="Витрина временно недоступна"
                />
              ) : items.length === 0 ? (
                <EmptyState
                  description="Для выбранной категории пока нет опубликованных товаров или услуг."
                  icon={PackageOpen}
                  title="Пока нет объявлений"
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

                  <Pagination
                    isLoading={isLoading}
                    meta={paginationMeta}
                    onPageChange={setPage}
                    page={page}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}

function CategoryBranchPanel({
  branch,
  errorMessage,
  selectedCategoryId,
  status,
}: {
  branch: CategoryNode | null;
  errorMessage: string | null;
  selectedCategoryId?: number;
  status: "idle" | "loading" | "success" | "error";
}) {
  if (!selectedCategoryId) {
    return null;
  }

  if (status === "loading" && branch === null) {
    return (
      <section className="mt-6 rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_74%,transparent)] p-5">
        <Skeleton className="h-6 w-2/5" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </section>
    );
  }

  if (status === "error" && branch === null) {
    return (
      <section className="mt-6 rounded-[30px] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_74%,transparent)] p-5 text-sm font-semibold text-[var(--text-muted)]">
        {errorMessage ?? "Не удалось загрузить ветку категории."}
      </section>
    );
  }

  if (branch === null) {
    return null;
  }

  const breadcrumbs = findCategoryPath(branch, selectedCategoryId) ?? [branch];

  return (
    <section className="mt-6 rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--text-muted)]">
        <Link className="hover:text-[var(--brand-deep)]" href="/listings">
          Все объявления
        </Link>
        {breadcrumbs.map((category, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div
              className="contents"
              key={category.id}
            >
              <ChevronRight aria-hidden="true" size={15} />
              {isLast ? (
                <span className="text-[var(--brand-deep)]">{category.name}</span>
              ) : (
                <Link
                  className="transition hover:text-[var(--brand-deep)]"
                  href={`/listings?categoryId=${category.id}`}
                >
                  {category.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {branch.children.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {branch.children.map((category) => (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--brand-deep)] transition hover:border-[var(--brand)] hover:bg-[var(--accent-soft)]"
              href={`/listings?categoryId=${category.id}`}
              key={category.id}
            >
              <Tags aria-hidden="true" size={15} />
              {category.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
          Это конечная категория. Ниже показаны товары и услуги из выбранного раздела.
        </p>
      )}
    </section>
  );
}

function findCategoryPath(
  category: CategoryNode,
  targetCategoryId: number | undefined,
  path: CategoryNode[] = [],
): CategoryNode[] | null {
  const nextPath = [...path, category];

  if (category.id === targetCategoryId) {
    return nextPath;
  }

  for (const child of category.children) {
    const childPath = findCategoryPath(child, targetCategoryId, nextPath);

    if (childPath !== null) {
      return childPath;
    }
  }

  return null;
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
