import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function setMainListingMedia(
  listingId: string,
  mediaId: number,
): Promise<ListingItem> {
  const response = await api.patch<ApiDataResponse<unknown>>(
    `/listings/${listingId}/media/${mediaId}/main`,
  );

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ выбора главного изображения объявления не соответствует ожидаемому формату.",
  );
}
