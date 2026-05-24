import type { ListingItem } from "@/src/entities/listing";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";
import type { CreateListingPayload } from "./create-listing";

export type UpdateListingPayload = Omit<CreateListingPayload, "saveAsDraft">;

export async function updateListing(
  listingId: string,
  payload: UpdateListingPayload,
): Promise<ListingItem> {
  const response = await api.patch<ApiDataResponse<ListingItem>>(`/listings/${listingId}`, payload);

  return unwrapApiData(response.data);
}
