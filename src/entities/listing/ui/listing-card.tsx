import Link from "next/link";
import type { MouseEvent } from "react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { cn } from "@/src/shared/lib/utils";
import { ListingCardGridLayout } from "./listing-card-grid-layout";
import { ListingCardMedia } from "./listing-card-media";
import { buildListingCardPresentation } from "./listing-card-presentation";

const initialTransform = "perspective(900px) rotateX(0deg) rotateY(0deg)";

type ListingCardProps = {
  detailsHref?: string;
  isFavorite?: boolean;
  isSelected?: boolean;
  listing: ListingItem | PublicListingItem;
  onFavoriteToggleAction?: (listingId: string) => void;
  onSelectToggleAction?: (listingId: string) => void;
  showStatus?: boolean;
};

export function ListingCard({
  detailsHref,
  isFavorite,
  isSelected = false,
  listing,
  onFavoriteToggleAction,
  onSelectToggleAction,
}: ListingCardProps) {
  const href = detailsHref ?? `/account/listings/${listing.id}`;
  const favorite = isFavorite ?? listing.isFavorite ?? false;
  const presentation = buildListingCardPresentation({
    favorite,
    listing,
    onFavoriteToggleAction,
  });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 8;

    event.currentTarget.style.transform =
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  }

  function handleMouseLeave(event: MouseEvent<HTMLElement>) {
    event.currentTarget.style.transform = initialTransform;
  }

  const media = (
    <ListingCardMedia
      detailsHref={href}
      favoriteButton={presentation.favoriteButton}
      imageUrl={listing.imageUrl}
      imageUrls={listing.imageUrls}
      isSelected={isSelected}
      listingId={listing.id}
      onSelectToggleAction={onSelectToggleAction}
      title={listing.title}
    />
  );

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 hover:border-[var(--accent)]",
        "hover:-translate-y-1",
        isSelected && "border-[var(--accent)] ring-4 ring-[var(--accent-soft)]",
        "mx-auto grid h-[490px] w-full max-w-[360px] overflow-hidden grid-rows-[270px_minmax(0,1fr)]",
      )}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ transform: initialTransform }}
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
