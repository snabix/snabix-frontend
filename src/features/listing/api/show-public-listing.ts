import type { PublicListingItem } from "@/src/entities/listing";
import {
  api,
  parseApiContract,
  publicListingItemSchema,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function showPublicListing(listingId: string): Promise<PublicListingItem> {
  const response = await api.get<ApiDataResponse<unknown>>(`/public/listings/${listingId}`);

  return parseApiContract(
    publicListingItemSchema,
    unwrapApiData(response.data),
    "Ответ публичной детальной страницы объявления не соответствует ожидаемому формату.",
  ) as PublicListingItem;
}
