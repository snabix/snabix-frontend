import type { ListingItem } from "@/src/entities/listing";
import {
  getData,
  listingItemSchema,
} from "@/src/shared/api";

export async function showListing(listingId: string): Promise<ListingItem> {
  return getData(
    listingItemSchema,
    `/listings/${listingId}`,
    { errorMessage: "Ответ детальной страницы объявления не соответствует ожидаемому формату." },
  );
}
