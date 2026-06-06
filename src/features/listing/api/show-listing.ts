import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function showListing(listingId: string): Promise<ListingItem> {
  const response = await api.get<ApiDataResponse<unknown>>(`/listings/${listingId}`);

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ детальной страницы объявления не соответствует ожидаемому формату.",
  );
}
