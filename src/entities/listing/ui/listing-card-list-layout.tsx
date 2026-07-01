import type { ReactNode } from "react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { ListingCardAttributes } from "./listing-card-attributes";
import { ListingCardBadges } from "./listing-card-badges";
import { ListingCardMeta } from "./listing-card-meta";
import { ListingCardSeller } from "./listing-card-seller";
import type { ListingCardPresentation } from "./listing-card-types";

type ListingCardListLayoutProps = {
  listing: ListingItem | PublicListingItem;
  media: ReactNode;
  onFavoriteToggleAction?: (listingId: string) => void;
  presentation: ListingCardPresentation;
};

export function ListingCardListLayout({
  listing,
  media,
  onFavoriteToggleAction,
  presentation,
}: ListingCardListLayoutProps) {
  return (
    <div className="pointer-events-none relative z-20 grid gap-4">
      <div className="grid gap-5 md:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] md:items-stretch">
        {media}

        <div className="grid min-w-0 content-start gap-4">
          <div className="flex items-start justify-between gap-4">
            <ListingCardBadges listing={listing} />

            <div className="pointer-events-auto relative z-30 hidden md:block">
              {presentation.favoriteButton}
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-heading text-3xl font-black leading-none tracking-[-0.05em] text-[var(--accent)] xl:text-4xl">
              {presentation.formattedPrice}
            </p>

            {listing.isNegotiable ? (
              <p className="mt-2 text-sm font-bold text-[var(--text-muted)]">
                Возможен торг
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-2 font-heading text-2xl font-black leading-[1.05] tracking-[-0.045em] text-[var(--brand-deep)] xl:text-3xl">
              {listing.title}
            </h3>

            <p className="mt-3 line-clamp-2 max-w-3xl text-base font-medium leading-7 text-[var(--text-muted)]">
              {listing.description}
            </p>
          </div>

          {onFavoriteToggleAction ? (
            <div className="flex flex-wrap items-start justify-end gap-4 md:hidden">
              <div className="pointer-events-auto relative z-30">
                {presentation.favoriteButton}
              </div>
            </div>
          ) : null}

          <ListingCardAttributes attributes={presentation.highlightedAttributes} />
          <ListingCardMeta listing={listing} presentation={presentation} />
        </div>
      </div>

      <ListingCardSeller
        href={presentation.sellerHref}
        initials={presentation.sellerInitials}
        name={presentation.sellerName}
        ratingLabel={presentation.sellerRating}
        reviewCount={presentation.reviewCount}
      />
    </div>
  );
}
