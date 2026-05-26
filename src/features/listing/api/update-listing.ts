import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";
import type { CreateListingPayload } from "./create-listing";

export type UpdateListingPayload = Omit<CreateListingPayload, "saveAsDraft">;

export async function updateListing(
  listingId: string,
  payload: UpdateListingPayload,
): Promise<ListingItem> {
  const response = await api.patch<ApiDataResponse<unknown>>(`/listings/${listingId}`, payload);

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ обновления объявления не соответствует ожидаемому формату.",
  );
}
