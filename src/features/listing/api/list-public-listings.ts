import { api } from "@/src/shared/api";
import type { PublicListingItem } from "@/src/entities/listing";

type ListPublicListingsResponse = {
  data: PublicListingItem[];
};

export async function listPublicListings(limit = 24): Promise<PublicListingItem[]> {
  const response = await api.get<ListPublicListingsResponse>("/public/listings", {
    params: { limit },
  });

  return response.data.data;
}
