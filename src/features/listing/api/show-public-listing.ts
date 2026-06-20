import type { PublicListingItem } from "@/src/entities/listing";
import {
  getData,
  publicListingItemSchema,
} from "@/src/shared/api";

export async function showPublicListing(listingId: string): Promise<PublicListingItem> {
  return getData(
    publicListingItemSchema,
    `/public/listings/${listingId}`,
    { errorMessage: "Ответ публичной детальной страницы объявления не соответствует ожидаемому формату." },
  );
}
