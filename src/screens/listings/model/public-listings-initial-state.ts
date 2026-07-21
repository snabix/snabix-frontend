import type { PublicListingItem } from "@/src/entities/listing";
import type {
  ApiPaginatedData,
  ApiPaginationMeta,
} from "@/src/shared/api";

export const HOME_LISTINGS_PER_PAGE = 16;
export const CATEGORY_LISTINGS_PER_PAGE = 15;

export type PublicListingsInitialState = {
  data: ApiPaginatedData<PublicListingItem>;
  errorMessage: string | null;
};

export function emptyPublicListingsData(
  perPage: number,
): ApiPaginatedData<PublicListingItem> {
  return {
    items: [],
    meta: emptyPaginationMeta(perPage),
  };
}

function emptyPaginationMeta(perPage: number): ApiPaginationMeta {
  return {
    currentPage: 1,
    from: null,
    lastPage: 1,
    perPage,
    to: null,
    total: 0,
  };
}
