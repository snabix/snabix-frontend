export type ListPublicListingsParams = {
  page?: number;
  perPage?: number;
  categoryId?: string | number;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
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
    type: params.type,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    regionId: params.regionId,
    cityId: params.cityId,
    regionQuery: params.regionQuery?.trim() || undefined,
    cityQuery: params.cityQuery?.trim() || undefined,
    isNegotiable: params.isNegotiable,
    sort: params.sort,
  };
}
