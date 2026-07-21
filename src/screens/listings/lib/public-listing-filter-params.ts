import type { ListPublicListingsParams } from "@/src/features/listing/api/public-listing-query";
import type { ListingKind } from "@/src/entities/listing";
import type { PublicListingFiltersState } from "@/src/screens/home/ui/public-listing-filters";

export function toPublicListingParams(filters: PublicListingFiltersState): ListPublicListingsParams {
  return {
    cityQuery: toOptionalString(filters.cityQuery),
    maxPriceAmountMinor: toOptionalNumber(filters.maxPrice),
    minPriceAmountMinor: toOptionalNumber(filters.minPrice),
    regionQuery: toOptionalString(filters.regionQuery),
    isNegotiable: filters.isNegotiable ? true : undefined,
    sort: filters.sort,
    listingKind: toOptionalListingKind(filters.type),
  };
}

function toOptionalListingKind(value: string): ListingKind | undefined {
  return value === "product" || value === "service" ? value : undefined;
}

function toOptionalString(value: string): string | undefined {
  const normalizedValue = value.trim();

  return normalizedValue === "" ? undefined : normalizedValue;
}

function toOptionalNumber(value: string): number | undefined {
  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : undefined;
}
