"use client";

import { Container } from "@/src/shared/ui/container";
import { PublicListingFilters } from "@/src/screens/home/ui/public-listing-filters";
import { usePublicListings } from "../model/use-public-listings";
import { CategoryBranchPanel } from "./category-branch-panel";
import { PublicListingsContent } from "./public-listings-content";
import { PublicListingQuickFilters } from "./public-listing-quick-filters";

type PublicListingsPageProps = {
  initialCategoryId?: string;
};

export function PublicListingsPage({
  initialCategoryId,
}: PublicListingsPageProps) {
  const listings = usePublicListings(initialCategoryId);

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
              {listings.selectedCategory?.name ?? "Все товары и услуги"}
            </h1>

            <p className="section-copy mt-5 max-w-2xl text-base leading-8">
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
                onChangeAction={listings.setDraftFilters}
              />

              <PublicListingsContent
                errorMessage={listings.errorMessage}
                favoriteListingIds={listings.favoriteListingIds}
                isLoading={listings.isLoading}
                items={listings.items}
                meta={listings.paginationMeta}
                onFavoriteToggleAction={listings.toggleFavorite}
                onPageChangeAction={listings.setPage}
                page={listings.page}
              />
            </div>
          ) : (
            <div className="grid gap-5 xl:flex xl:items-start">
              <PublicListingFilters
                filters={listings.draftFilters}
                isLoading={listings.isLoading}
                onChangeAction={listings.setDraftFilters}
                onResetAction={listings.handleFiltersReset}
              />

              <div className="min-w-0 flex-1">
                <PublicListingsContent
                  errorMessage={listings.errorMessage}
                  favoriteListingIds={listings.favoriteListingIds}
                  isLoading={listings.isLoading}
                  items={listings.items}
                  meta={listings.paginationMeta}
                  onFavoriteToggleAction={listings.toggleFavorite}
                  onPageChangeAction={listings.setPage}
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
