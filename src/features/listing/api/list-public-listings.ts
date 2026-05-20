import type { PublicListingItem } from "@/src/entities/listing";
import {
  api,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiItems,
} from "@/src/shared/api";

export async function listPublicListings(limit = 24): Promise<PublicListingItem[]> {
  const response = await api.get<ApiDataResponse<ApiPaginatedData<PublicListingItem>>>("/public/listings", {
    params: { perPage: limit },
  });

  return unwrapApiItems(response.data);
}
