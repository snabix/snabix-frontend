import type { ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  patchData,
} from "@/src/shared/api";
import type { CreateListingPayload } from "./create-listing";

export type UpdateListingPayload = Omit<CreateListingPayload, "saveAsDraft">;

export async function updateListing(
  listingId: string,
  payload: UpdateListingPayload,
): Promise<ListingItem> {
  return patchData(
    listingItemSchema,
    `/listings/${listingId}`,
    payload,
    { errorMessage: "Ответ обновления объявления не соответствует ожидаемому формату." },
  );
}
