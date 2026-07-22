import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";

type ListingWithSeller = ListingItem & {
  sellerReviewCount?: number | null;
};

export function formatListingPrice(listing: ListingItem | PublicListingItem): string {
  if (listing.priceAmountMinor === null) {
    return "Цена не указана";
  }

  return `${new Intl.NumberFormat("ru-RU").format(listing.priceAmountMinor)} ${listing.priceCurrency ?? "RUB"}`;
}

export function formatListingDate(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatReviewCount(count: number): string {
  const normalizedCount = Math.max(0, count);
  const remainder10 = normalizedCount % 10;
  const remainder100 = normalizedCount % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return `${normalizedCount} отзыв`;
  }

  if ([2, 3, 4].includes(remainder10) && ![12, 13, 14].includes(remainder100)) {
    return `${normalizedCount} отзыва`;
  }

  return `${normalizedCount} отзывов`;
}

export function resolveListingLocation(listing: ListingItem | PublicListingItem): string {
  if (listing.location !== null && listing.location !== undefined) {
    const location = [
      listing.location.region.fullName || listing.location.region.name,
      listing.location.city?.name,
      listing.location.addressLine,
    ].filter(Boolean).join(", ");

    if (location) {
      return location;
    }
  }

  const location = [
    listing.region,
    listing.city,
    listing.addressLine ?? [listing.street, listing.house].filter(Boolean).join(", "),
  ].filter(Boolean).join(", ");

  return location || listing.fullLocation || listing.location?.display || "Город не указан";
}

export function resolveSellerReviewCount(listing: ListingItem | PublicListingItem): number {
  return (listing as ListingWithSeller).sellerReviewCount ?? 0;
}
