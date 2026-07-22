import type { ReactNode } from "react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { formatReviewCount } from "@/src/entities/listing/lib/listing-card-formatters";
import { ListingCardLocation } from "./listing-card-location";
import { ListingCardStarRow } from "./listing-card-rating";
import type { ListingCardPresentation } from "./listing-card-types";

type ListingCardGridLayoutProps = {
  listing: ListingItem | PublicListingItem;
  media: ReactNode;
  presentation: ListingCardPresentation;
};

export function ListingCardGridLayout({
  listing,
  media,
  presentation,
}: ListingCardGridLayoutProps) {
  const ratingLabel = presentation.sellerRating === "Нет рейтинга" ? "3.0" : presentation.sellerRating;

  return (
    <>
      {media}

      <div className="pointer-events-none relative grid gap-2 overflow-hidden px-4 pb-4 pt-3">
        <div className="grid min-w-0 content-between gap-2 overflow-hidden">
          <div className="min-w-0 overflow-hidden">
            <p className="truncate font-heading text-[1.2rem] font-black leading-none tracking-normal text-[var(--accent)]">
              {presentation.formattedPrice}
            </p>

            <h3 className="mt-2 line-clamp-2 overflow-hidden font-heading text-[1rem] font-bold leading-[1.2] tracking-normal text-[var(--brand-deep)]">
              {listing.title}
            </h3>

            <div className="mt-3 h-px bg-[var(--border-soft)]" />

            <div className="mt-3 grid gap-2 overflow-hidden">
              <ListingCardLocation
                className="inline-flex min-w-0 items-center gap-2 text-[0.8rem] font-medium text-[var(--text-muted)]"
                iconSize={15}
                location={presentation.fullLocation}
              />

              <span className="grid min-w-0 gap-1 text-[0.8rem] font-medium text-[var(--text-muted)]">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <ListingCardStarRow rating={presentation.ratingValue} />
                  <span className="font-semibold text-[var(--brand-deep)]">
                    {ratingLabel}
                  </span>
                </span>

                <span className="truncate pl-0.5 text-[0.72rem] font-semibold text-[var(--text-muted)]">
                  {formatReviewCount(presentation.reviewCount)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
