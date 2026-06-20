import type { ListingItem } from "@/src/entities/listing";
import {
  deleteData,
  getPaginated,
  listingItemSchema,
  postData,
  type ApiPaginatedData,
} from "@/src/shared/api";

export type ListFavoriteListingsParams = {
  page?: number;
  perPage?: number;
};

export const FAVORITE_LISTINGS_MAX_PER_PAGE = 48;

export async function listFavoriteListings(
  params: ListFavoriteListingsParams = {},
): Promise<ApiPaginatedData<ListingItem>> {
  return getPaginated(listingItemSchema, "/listings/favorites", {
    config: {
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 12,
      },
    },
    errorMessage: "Ответ списка избранных объявлений не соответствует ожидаемому формату.",
  });
}

export async function addListingFavorite(listingId: string): Promise<ListingItem> {
  return postData(listingItemSchema, `/listings/${listingId}/favorite`, undefined, {
    errorMessage: "Ответ добавления в избранное не соответствует ожидаемому формату.",
  });
}

export async function removeListingFavorite(listingId: string): Promise<ListingItem> {
  return deleteData(listingItemSchema, `/listings/${listingId}/favorite`, {
    errorMessage: "Ответ удаления из избранного не соответствует ожидаемому формату.",
  });
}
