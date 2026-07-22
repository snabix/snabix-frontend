"use client";

import type { CategoryNode } from "@/src/entities/category";
import type { PublicListingsInitialState } from "@/src/screens/listings/model/public-listings-initial-state";
import { Container } from "@/src/shared/ui/container";
import { PublicListingFilters } from "@/src/screens/home/ui/public-listing-filters";
import { usePublicListings } from "../model/use-public-listings";
import { CategoryBranchPanel } from "./category-branch-panel";
import { PublicListingsContent } from "./public-listings-content";
import { PublicListingQuickFilters } from "./public-listing-quick-filters";

type PublicListingsPageProps = {
  initialCategory: CategoryNode | null;
  initialCategoryError: string | null;
  initialCategoryId?: string;
  initialListings: PublicListingsInitialState;
};

export function PublicListingsPage({
  initialCategory,
  initialCategoryError,
  initialCategoryId,
  initialListings,
}: PublicListingsPageProps) {
  const listings = usePublicListings({
    initialCategory,
    initialCategoryError,
    initialCategoryId,
    initialState: initialListings,
  });

  return (
    <main className="pb-12 pt-6">
      <Container>
        <section
          className="border-b border-[var(--border-soft)] py-5 sm:py-7"
          data-testid="marketplace-page-header"
        >
          <div className="max-w-4xl">
            <p className="section-kicker text-sm font-semibold uppercase tracking-normal">
              Публичная витрина
            </p>

            <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-normal text-[var(--brand-deep)] sm:text-4xl">
              {listings.selectedCategory?.name ?? "Все товары и услуги"}
            </h1>

            <p className="section-copy mt-3 max-w-2xl text-sm leading-6 sm:text-base">
              Уточните цену и тип объявления. Если вы пришли из каталога,
              ниже покажем выбранную ветку и вложенные разделы для быстрого
              перехода.
            </p>
          </div>
        </section>

        <CategoryBranchPanel
          branch={listings.selectedCategory}
          errorMessage={listings.selectedCategoryError}
          selectedCategoryId={initialCategoryId}
          status={listings.selectedCategoryStatus}
        />

        <section className="mt-8">
          {initialCategoryId ? (
            <div className="grid gap-5">
              <PublicListingQuickFilters
                filters={listings.draftFilters}
                isLoading={listings.isLoading}
                onChange={listings.setDraftFilters}
              />

              <PublicListingsContent
                errorMessage={listings.errorMessage}
                favoriteListingIds={listings.favoriteListingIds}
                isLoading={listings.isLoading}
                items={listings.items}
                meta={listings.paginationMeta}
                onFavoriteToggle={listings.toggleFavorite}
                onPageChange={listings.setPage}
                page={listings.page}
              />
            </div>
          ) : (
            <div className="grid gap-5 xl:flex xl:items-start">
              <PublicListingFilters
                filters={listings.draftFilters}
                isLoading={listings.isLoading}
                onChange={listings.setDraftFilters}
                onReset={listings.handleFiltersReset}
              />

              <div className="min-w-0 flex-1">
                <PublicListingsContent
                  errorMessage={listings.errorMessage}
                  favoriteListingIds={listings.favoriteListingIds}
                  isLoading={listings.isLoading}
                  items={listings.items}
                  meta={listings.paginationMeta}
                  onFavoriteToggle={listings.toggleFavorite}
                  onPageChange={listings.setPage}
                  page={listings.page}
                />
              </div>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
