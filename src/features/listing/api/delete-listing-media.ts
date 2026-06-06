import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function deleteListingMedia(
  listingId: string,
  mediaId: number,
): Promise<ListingItem> {
  const response = await api.delete<ApiDataResponse<unknown>>(
    `/listings/${listingId}/media/${mediaId}`,
  );

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ удаления изображения объявления не соответствует ожидаемому формату.",
  );
}
