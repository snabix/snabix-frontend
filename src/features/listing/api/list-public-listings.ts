import { api } from "@/src/shared/api";
import type { ListingItem } from "@/src/features/listing/api/create-listing";

type ListPublicListingsResponse = {
  data: ListingItem[];
};

export async function listPublicListings(limit = 24): Promise<ListingItem[]> {
  const response = await api.get<ListPublicListingsResponse>("/public/listings", {
    params: { limit },
  });

  return response.data.data;
}
