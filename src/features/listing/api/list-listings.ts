import type { ListingItem } from "@/src/entities/listing";
import {
  getPaginated,
  listingItemSchema,
  type ApiPaginatedData,
} from "@/src/shared/api";

export type ListListingsParams = {
  categoryId?: string | number | null;
  page?: number;
  perPage?: number;
  status?: number | null;
  type?: number | null;
};

export async function listListings(params: ListListingsParams = {}): Promise<ApiPaginatedData<ListingItem>> {
  return getPaginated(listingItemSchema, "/listings", {
    config: { params },
    errorMessage: "Ответ списка объявлений пользователя не соответствует ожидаемому формату.",
  });
}
