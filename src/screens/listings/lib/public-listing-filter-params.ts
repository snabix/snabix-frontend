import type { ListPublicListingsParams } from "@/src/features/listing/api/public-listing-query";
import type { PublicListingFiltersState } from "@/src/screens/home/ui/public-listing-filters";

export function toPublicListingParams(filters: PublicListingFiltersState): ListPublicListingsParams {
  return {
    cityQuery: toOptionalString(filters.cityQuery),
    maxPrice: toOptionalNumber(filters.maxPrice),
    minPrice: toOptionalNumber(filters.minPrice),
    regionQuery: toOptionalString(filters.regionQuery),
    isNegotiable: filters.isNegotiable ? true : undefined,
    sort: filters.sort,
    type: toOptionalNumber(filters.type),
  };
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
