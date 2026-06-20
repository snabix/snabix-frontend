import type { ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  postData,
} from "@/src/shared/api";

export async function submitListingForReview(listingId: string): Promise<ListingItem> {
  return postData(
    listingItemSchema,
    `/listings/${listingId}/submit-for-review`,
    undefined,
    { errorMessage: "Ответ отправки объявления на проверку не соответствует ожидаемому формату." },
  );
}
