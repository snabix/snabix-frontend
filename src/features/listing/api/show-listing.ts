import type { ListingItem } from "@/src/entities/listing";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export async function showListing(listingId: string): Promise<ListingItem> {
  const response = await api.get<ApiDataResponse<ListingItem>>(`/listings/${listingId}`);

  return unwrapApiData(response.data);
}
