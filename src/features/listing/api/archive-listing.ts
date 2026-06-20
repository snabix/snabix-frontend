import type { ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  postData,
} from "@/src/shared/api";

export async function archiveListing(listingId: string): Promise<ListingItem> {
  return postData(
    listingItemSchema,
    `/listings/${listingId}/archive`,
    undefined,
    { errorMessage: "Ответ архивирования объявления не соответствует ожидаемому формату." },
  );
}
