import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function reorderListingMedia(
  listingId: string,
  mediaIds: number[],
): Promise<ListingItem> {
  const response = await api.patch<ApiDataResponse<unknown>>(
    `/listings/${listingId}/media/reorder`,
    { mediaIds },
  );

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ сортировки изображений объявления не соответствует ожидаемому формату.",
  );
}
