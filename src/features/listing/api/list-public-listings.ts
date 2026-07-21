import type { PublicListingItem } from "@/src/entities/listing";
import {
  getPaginated,
  publicListingItemSchema,
  type ApiPaginatedData,
} from "@/src/shared/api";
import {
  type ListPublicListingsParams,
  publicListingQuery,
} from "./public-listing-query";

export type { ListPublicListingsParams } from "./public-listing-query";

export async function listPublicListings(params: ListPublicListingsParams = {}): Promise<ApiPaginatedData<PublicListingItem>> {
  return getPaginated(publicListingItemSchema, "/public/listings", {
    config: {
      params: publicListingQuery(params),
    },
    errorMessage: "Ответ публичного списка объявлений не соответствует ожидаемому формату.",
  });
}
