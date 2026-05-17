import type { PublicListingItem } from "@/src/entities/listing";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export async function listPublicListings(limit = 24): Promise<PublicListingItem[]> {
  const response = await api.get<ApiDataResponse<PublicListingItem[]>>("/public/listings", {
    params: { limit },
  });

  return unwrapApiData(response.data);
}
