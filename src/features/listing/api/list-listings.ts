import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiItems,
} from "@/src/shared/api";

export async function listListings(): Promise<ListingItem[]> {
  const response = await api.get<ApiDataResponse<ApiPaginatedData<ListingItem>>>("/listings");

  return unwrapApiItems(response.data);
}
