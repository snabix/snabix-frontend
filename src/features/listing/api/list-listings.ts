import type { ListingItem } from "@/src/entities/listing";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export async function listListings(): Promise<ListingItem[]> {
  const response = await api.get<ApiDataResponse<ListingItem[]>>("/listings");

  return unwrapApiData(response.data);
}
