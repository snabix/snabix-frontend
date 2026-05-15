import { api } from "@/src/shared/api";
import type { ListingItem } from "@/src/entities/listing";
import type { CreateListingPayload } from "./create-listing";

export type UpdateListingPayload = CreateListingPayload;

type UpdateListingResponse = {
  data: ListingItem;
};

export async function updateListing(
  listingId: string,
  payload: UpdateListingPayload,
): Promise<ListingItem> {
  const response = await api.patch<UpdateListingResponse>(`/listings/${listingId}`, payload);

  return response.data.data;
}
