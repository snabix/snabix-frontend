import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  paginatedContractSchema,
  parseApiContract,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiData,
  unwrapApiPagination,
} from "@/src/shared/api";

export type ListFavoriteListingsParams = {
  page?: number;
  perPage?: number;
};

export async function listFavoriteListings(
  params: ListFavoriteListingsParams = {},
): Promise<ApiPaginatedData<ListingItem>> {
  const response = await api.get<ApiDataResponse<ApiPaginatedData<unknown>>>(
    "/listings/favorites",
    {
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 12,
      },
    },
  );

  return parseApiContract(
    paginatedContractSchema(listingItemSchema),
    unwrapApiPagination(response.data),
    "Ответ списка избранных объявлений не соответствует ожидаемому формату.",
  ) as ApiPaginatedData<ListingItem>;
}

export async function addListingFavorite(listingId: string): Promise<ListingItem> {
  const response = await api.post<ApiDataResponse<unknown>>(`/listings/${listingId}/favorite`);

  return parseFavoriteListingResponse(response.data, "Ответ добавления в избранное не соответствует ожидаемому формату.");
}

export async function removeListingFavorite(listingId: string): Promise<ListingItem> {
  const response = await api.delete<ApiDataResponse<unknown>>(`/listings/${listingId}/favorite`);

  return parseFavoriteListingResponse(response.data, "Ответ удаления из избранного не соответствует ожидаемому формату.");
}

function parseFavoriteListingResponse(
  response: ApiDataResponse<unknown>,
  fallbackMessage: string,
): ListingItem {
  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response),
    fallbackMessage,
  );
}
