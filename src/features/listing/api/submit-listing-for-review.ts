import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function submitListingForReview(listingId: string): Promise<ListingItem> {
  const response = await api.post<ApiDataResponse<unknown>>(`/listings/${listingId}/submit-for-review`);

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ отправки объявления на проверку не соответствует ожидаемому формату.",
  );
}
