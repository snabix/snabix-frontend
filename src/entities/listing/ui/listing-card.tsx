import Link from "next/link";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { cn } from "@/src/shared/lib/utils";
import { ListingCardGridLayout } from "./listing-card-grid-layout";
import { ListingCardMedia } from "./listing-card-media";
import { buildListingCardPresentation } from "./listing-card-presentation";

type ListingCardProps = {
  detailsHref?: string;
  isFavorite?: boolean;
  isSelected?: boolean;
  listing: ListingItem | PublicListingItem;
  onFavoriteToggle?: (listingId: string) => void;
  onSelectToggle?: (listingId: string) => void;
  showStatus?: boolean;
};

export function ListingCard({
  detailsHref,
  isFavorite,
  isSelected = false,
  listing,
  onFavoriteToggle,
  onSelectToggle,
}: ListingCardProps) {
  const href = detailsHref ?? `/account/listings/${listing.id}`;
  const favorite = isFavorite ?? listing.isFavorite ?? false;
  const presentation = buildListingCardPresentation({
    favorite,
    listing,
    onFavoriteToggle,
  });

  const media = (
    <ListingCardMedia
      detailsHref={href}
      favoriteButton={presentation.favoriteButton}
      imageUrl={listing.imageUrl}
      imageUrls={listing.imageUrls}
      isSelected={isSelected}
      listingId={listing.id}
      onSelectToggle={onSelectToggle}
      title={listing.title}
    />
  );

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-surface)] border border-[var(--border-soft)] bg-[var(--surface)] shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent)] hover:shadow-[var(--shadow-card)]",
        isSelected && "border-[var(--accent)] ring-4 ring-[var(--accent-soft)]",
        "mx-auto grid h-[440px] w-full max-w-[360px] overflow-hidden grid-rows-[240px_minmax(0,1fr)]",
      )}
    >
      <Link
        aria-label={`Открыть объявление ${listing.title}`}
        className="absolute inset-0 z-[25]"
        href={href}
      />

      <ListingCardGridLayout
        listing={listing}
        media={media}
        presentation={presentation}
      />
    </article>
  );
}
