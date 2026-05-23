import type { ListingItem } from "@/src/entities/listing";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export async function submitListingForReview(listingId: string): Promise<ListingItem> {
  const response = await api.post<ApiDataResponse<ListingItem>>(`/listings/${listingId}/submit-for-review`);

  return unwrapApiData(response.data);
}
