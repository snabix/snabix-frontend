import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import {
  formatListingDate,
  formatListingPrice,
  resolveListingLocation,
  resolveSellerHref,
  resolveSellerInitials,
  resolveSellerName,
  resolveSellerReviewCount,
} from "@/src/entities/listing/lib/listing-card-formatters";
import { ListingFavoriteButton } from "./listing-card-actions";
import type { ListingCardPresentation } from "./listing-card-types";

type BuildListingCardPresentationParams = {
  favorite: boolean;
  listing: ListingItem | PublicListingItem;
  onFavoriteToggle?: (listingId: string) => void;
};

export function buildListingCardPresentation({
  favorite,
  listing,
  onFavoriteToggle,
}: BuildListingCardPresentationParams): ListingCardPresentation {
  const sellerName = resolveSellerName(listing);
  const sellerRating = listing.sellerRating === null || listing.sellerRating === undefined
    ? "Нет рейтинга"
    : listing.sellerRating.toFixed(1);

  return {
    favoriteButton: (
      <ListingFavoriteButton
        isFavorite={favorite}
        listingId={listing.id}
        onFavoriteToggle={onFavoriteToggle}
      />
    ),
    formattedPrice: formatListingPrice(listing),
    fullLocation: resolveListingLocation(listing),
    highlightedAttributes: listing.attributeValues
      .filter((attribute) => attribute.name !== null && attribute.displayValue !== null)
      .slice(0, 2),
    publishedDate: formatListingDate(listing.publishedAt),
    ratingValue: listing.sellerRating ?? 3,
    reviewCount: resolveSellerReviewCount(listing),
    sellerHref: resolveSellerHref(listing, sellerName),
    sellerInitials: resolveSellerInitials(sellerName),
    sellerName,
    sellerRating,
  };
}
