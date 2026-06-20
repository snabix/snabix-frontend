import type { ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  patchData,
} from "@/src/shared/api";

export async function setMainListingMedia(
  listingId: string,
  mediaId: number,
): Promise<ListingItem> {
  return patchData(
    listingItemSchema,
    `/listings/${listingId}/media/${mediaId}/main`,
    undefined,
    { errorMessage: "Ответ выбора главного изображения объявления не соответствует ожидаемому формату." },
  );
}
