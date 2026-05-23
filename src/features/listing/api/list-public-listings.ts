import type { PublicListingItem } from "@/src/entities/listing";
import {
  api,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiPagination,
} from "@/src/shared/api";

export type ListPublicListingsParams = {
  page?: number;
  perPage?: number;
};

export async function listPublicListings(params: ListPublicListingsParams = {}): Promise<ApiPaginatedData<PublicListingItem>> {
  const response = await api.get<ApiDataResponse<ApiPaginatedData<PublicListingItem>>>("/public/listings", {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 24,
    },
  });

  return unwrapApiPagination(response.data);
}
