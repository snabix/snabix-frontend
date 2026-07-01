import type { PublicListingItem } from "@/src/entities/listing";
import {
  getPaginated,
  publicListingItemSchema,
  type ApiPaginatedData,
} from "@/src/shared/api";

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

export async function listPublicListings(params: ListPublicListingsParams = {}): Promise<ApiPaginatedData<PublicListingItem>> {
  return getPaginated(publicListingItemSchema, "/public/listings", {
    config: {
      params: {
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
      },
    },
    errorMessage: "Ответ публичного списка объявлений не соответствует ожидаемому формату.",
  });
}
