import type { ReactNode } from "react";
import { ListingMediaGallery } from "@/src/entities/listing/ui/listing-media-gallery";
import { ListingSelectToggle } from "./listing-card-actions";

type ListingCardMediaProps = {
  detailsHref: string;
  favoriteButton: ReactNode;
  imageUrl?: string | null;
  imageUrls?: string[];
  isSelected: boolean;
  listingId: string;
  onSelectToggleAction?: (listingId: string) => void;
  title: string;
};

export function ListingCardMedia({
  detailsHref,
  favoriteButton,
  imageUrl,
  imageUrls,
  isSelected,
  listingId,
  onSelectToggleAction,
  title,
}: ListingCardMediaProps) {
  return (
    <div className="pointer-events-none relative min-h-[270px] overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_18%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_10%,var(--surface)))]">
      <ListingMediaGallery
        detailsHref={detailsHref}
        imageUrl={imageUrl}
        imageUrls={imageUrls}
        title={title}
      />

      <div className="absolute right-4 top-4 z-30">
        {favoriteButton}
      </div>

      {onSelectToggleAction ? (
        <ListingSelectToggle
          isSelected={isSelected}
          listingId={listingId}
          onSelectToggleAction={onSelectToggleAction}
        />
      ) : null}
    </div>
  );
}
