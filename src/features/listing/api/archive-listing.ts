import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function archiveListing(listingId: string): Promise<ListingItem> {
  const response = await api.post<ApiDataResponse<unknown>>(`/listings/${listingId}/archive`);

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ архивирования объявления не соответствует ожидаемому формату.",
  );
}
