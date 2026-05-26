import type { PublicListingItem } from "@/src/entities/listing";
import {
  api,
  paginatedContractSchema,
  parseApiContract,
  publicListingItemSchema,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiPagination,
} from "@/src/shared/api";

export type ListPublicListingsParams = {
  page?: number;
  perPage?: number;
  categoryId?: number;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
};

export async function listPublicListings(params: ListPublicListingsParams = {}): Promise<ApiPaginatedData<PublicListingItem>> {
  const response = await api.get<ApiDataResponse<unknown>>("/public/listings", {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 15,
      categoryId: params.categoryId,
      type: params.type,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort,
    },
  });

  return parseApiContract(
    paginatedContractSchema(publicListingItemSchema),
    unwrapApiPagination(response.data as ApiDataResponse<ApiPaginatedData<unknown>>),
    "Ответ публичного списка объявлений не соответствует ожидаемому формату.",
  ) as ApiPaginatedData<PublicListingItem>;
}
