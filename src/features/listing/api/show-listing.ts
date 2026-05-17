import { api } from "@/src/shared/api";
import type { ListingItem } from "@/src/entities/listing";

type ShowListingResponse = {
  data: ListingItem;
};

export async function showListing(listingId: string): Promise<ListingItem> {
  const response = await api.get<ShowListingResponse>(`/listings/${listingId}`);

  return response.data.data;
}
