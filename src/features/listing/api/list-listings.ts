import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  paginatedContractSchema,
  parseApiContract,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiPagination,
} from "@/src/shared/api";

export type ListListingsParams = {
  categoryId?: string | number | null;
  page?: number;
  perPage?: number;
  status?: number | null;
  type?: number | null;
};

export async function listListings(params: ListListingsParams = {}): Promise<ApiPaginatedData<ListingItem>> {
  const response = await api.get<ApiDataResponse<unknown>>("/listings", {
    params,
  });

  return parseApiContract(
    paginatedContractSchema(listingItemSchema),
    unwrapApiPagination(response.data as ApiDataResponse<ApiPaginatedData<unknown>>),
    "Ответ списка объявлений пользователя не соответствует ожидаемому формату.",
  ) as ApiPaginatedData<ListingItem>;
}
