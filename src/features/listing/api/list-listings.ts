import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiPagination,
} from "@/src/shared/api";

export type ListListingsParams = {
  categoryId?: number | null;
  page?: number;
  perPage?: number;
  status?: number | null;
  type?: number | null;
};

export async function listListings(params: ListListingsParams = {}): Promise<ApiPaginatedData<ListingItem>> {
  const response = await api.get<ApiDataResponse<ApiPaginatedData<ListingItem>>>("/listings", {
    params,
  });

  return unwrapApiPagination(response.data);
}
