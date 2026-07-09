"use client";

import { SlidersHorizontal } from "lucide-react";
import { Container } from "@/src/shared/ui/container";
import { useHomeListings } from "../model/use-home-listings";
import { CategoryShowcaseCarouselSection } from "./category-showcase-carousel-section";
import { HomeFiltersDrawer } from "./home-filters-drawer";
import { HomeListingsContent } from "./home-listings-content";

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
              aria-label="Фильтры"
              className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] shadow-[var(--shadow-card)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              onClick={() => listings.setIsFiltersOpen(true)}
              title="Фильтры"
              type="button"
            >
              <SlidersHorizontal size={18} />
            </button>
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
