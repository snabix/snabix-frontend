import type { ListingItem } from "@/src/entities/listing";
import {
  deleteData,
  listingItemSchema,
} from "@/src/shared/api";

export async function deleteListingMedia(
  listingId: string,
  mediaId: number,
): Promise<ListingItem> {
  return deleteData(
    listingItemSchema,
    `/listings/${listingId}/media/${mediaId}`,
    { errorMessage: "Ответ удаления изображения объявления не соответствует ожидаемому формату." },
  );
}
