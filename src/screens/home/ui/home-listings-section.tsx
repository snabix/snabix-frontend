"use client";

import { SlidersHorizontal } from "lucide-react";
import type { PublicListingsInitialState } from "@/src/screens/listings/model/public-listings-initial-state";
import { useHomeListings } from "../model/use-home-listings";
import { HomeFiltersDrawer } from "./home-filters-drawer";
import { HomeListingsContent } from "./home-listings-content";

const filtersTriggerId = "home-listings-filters-trigger";

type HomeListingsSectionProps = {
  initialCategoryId?: string;
  initialListings: PublicListingsInitialState;
};

export function HomeListingsSection({
  initialCategoryId,
  initialListings,
}: HomeListingsSectionProps) {
  const listings = useHomeListings(initialCategoryId, initialListings);

  return (
    <>
      <section className="mt-8">
        <div className="mb-5">
          <p className="section-kicker text-sm font-semibold uppercase tracking-normal">
            Живая витрина
          </p>

          <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
            Актуальные предложения рядом
          </h2>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            aria-label="Фильтры"
            className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] focus-visible:outline-none"
            id={filtersTriggerId}
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
            onFavoriteToggle={listings.toggleFavorite}
            onPageChange={listings.setPage}
            page={listings.page}
          />
        </div>
      </section>

      <HomeFiltersDrawer
        filters={listings.draftFilters}
        isLoading={listings.isLoading}
        isOpen={listings.isFiltersOpen}
        onChange={listings.setDraftFilters}
        onClose={() => listings.setIsFiltersOpen(false)}
        onReset={listings.handleFiltersReset}
        triggerId={filtersTriggerId}
      />
    </>
  );
}
