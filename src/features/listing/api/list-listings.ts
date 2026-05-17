import { api } from "@/src/shared/api";
import type { ListingItem } from "@/src/features/listing/api/create-listing";

type ListListingsResponse = {
  data: ListingItem[];
};

export async function listListings(): Promise<ListingItem[]> {
  const response = await api.get<ListListingsResponse>("/listings");

  return response.data.data;
}
