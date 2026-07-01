"use client";

import { SlidersHorizontal } from "lucide-react";
import { Container } from "@/src/shared/ui/container";
import { useHomeListings } from "../model/use-home-listings";
import { CategoryShowcaseCarouselSection } from "./category-showcase-carousel-section";
import { HomeFiltersDrawer } from "./home-filters-drawer";
import { HomeListingsContent } from "./home-listings-content";
import { HomeViewModeSwitcher } from "./home-view-mode-switcher";

type HomePageProps = {
  initialCategoryId?: string;
};

export function HomePage({ initialCategoryId }: HomePageProps) {
  const listings = useHomeListings(initialCategoryId);

  return (
    <main className="pb-12 pt-6">
      <Container>
        <CategoryShowcaseCarouselSection />

        <section className="mt-8">
          <div className="mb-5">
            <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
              Живая витрина
            </p>

            <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
              Актуальные предложения рядом
            </h2>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-3 text-sm font-black text-[var(--brand-deep)] shadow-[var(--shadow-card)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              onClick={() => listings.setIsFiltersOpen(true)}
              type="button"
            >
              <SlidersHorizontal size={17} />
              Фильтры
            </button>

            <HomeViewModeSwitcher onChangeAction={listings.setViewMode} value={listings.viewMode} />
          </div>

          <div className="min-w-0">
            <HomeListingsContent
              errorMessage={listings.errorMessage}
              favoriteListingIds={listings.favoriteListingIds}
              isLoading={listings.isLoading}
              items={listings.items}
              meta={listings.paginationMeta}
              onFavoriteToggleAction={listings.toggleFavorite}
              onPageChangeAction={listings.setPage}
              page={listings.page}
              viewMode={listings.viewMode}
            />
          </div>
        </section>
      </Container>

      <HomeFiltersDrawer
        filters={listings.draftFilters}
        isLoading={listings.isLoading}
        isOpen={listings.isFiltersOpen}
        onChangeAction={listings.setDraftFilters}
        onCloseAction={() => listings.setIsFiltersOpen(false)}
        onResetAction={listings.handleFiltersReset}
      />
    </main>
  );
}
