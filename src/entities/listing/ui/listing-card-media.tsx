import type { ReactNode } from "react";
import { ListingMediaGallery } from "@/src/entities/listing/ui/listing-media-gallery";
import { cn } from "@/src/shared/lib/utils";
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
  viewMode: "grid" | "list";
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
  viewMode,
}: ListingCardMediaProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_18%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_10%,var(--surface)))]",
        viewMode === "list"
          ? "min-h-[320px] rounded-[26px] md:min-h-[320px] md:w-[340px] md:shrink-0 xl:min-h-[340px] xl:w-[390px]"
          : "min-h-[270px]",
      )}
    >
      <ListingMediaGallery
        detailsHref={detailsHref}
        imageUrl={imageUrl}
        imageUrls={imageUrls}
        title={title}
      />

      {viewMode === "grid" ? (
        <div className="absolute right-4 top-4 z-30">
          {favoriteButton}
        </div>
      ) : null}

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
