import type {
  ListingItem,
  ListingKind,
  ListingStatus,
} from "@/src/entities/listing";
import {
  getPaginated,
  listingItemSchema,
  type ApiPaginatedData,
} from "@/src/shared/api";

export type ListListingsParams = {
  categoryId?: string | number | null;
  page?: number;
  perPage?: number;
  listingStatus?: ListingStatus | null;
  listingKind?: ListingKind | null;
};

export async function listListings(params: ListListingsParams = {}): Promise<ApiPaginatedData<ListingItem>> {
  return getPaginated(listingItemSchema, "/listings", {
    config: { params },
    errorMessage: "Ответ списка объявлений пользователя не соответствует ожидаемому формату.",
  });
}
