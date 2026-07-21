import type { ListingKind } from "@/src/entities/listing";

export type ListPublicListingsParams = {
  page?: number;
  perPage?: number;
  categoryId?: string | number;
  listingKind?: ListingKind;
  minPriceAmountMinor?: number;
  maxPriceAmountMinor?: number;
  regionId?: number;
  cityId?: number;
  regionQuery?: string;
  cityQuery?: string;
  isNegotiable?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
};

export function publicListingQuery(
  params: ListPublicListingsParams = {},
): Record<string, boolean | number | string | undefined> {
  return {
    page: params.page ?? 1,
    perPage: params.perPage ?? 15,
    categoryId: params.categoryId,
    listingKind: params.listingKind,
    minPriceAmountMinor: params.minPriceAmountMinor,
    maxPriceAmountMinor: params.maxPriceAmountMinor,
    regionId: params.regionId,
    cityId: params.cityId,
    regionQuery: params.regionQuery?.trim() || undefined,
    cityQuery: params.cityQuery?.trim() || undefined,
    isNegotiable: params.isNegotiable,
    sort: params.sort,
  };
}
