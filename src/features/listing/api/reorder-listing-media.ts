import type { ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  patchData,
} from "@/src/shared/api";

export async function reorderListingMedia(
  listingId: string,
  mediaIds: number[],
): Promise<ListingItem> {
  return patchData(
    listingItemSchema,
    `/listings/${listingId}/media/reorder`,
    { mediaIds },
    { errorMessage: "Ответ сортировки изображений объявления не соответствует ожидаемому формату." },
  );
}
