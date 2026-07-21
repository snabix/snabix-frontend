import "server-only";

import type { PublicListingItem } from "@/src/entities/listing";
import {
  publicListingItemSchema,
  type ApiPaginatedData,
} from "@/src/shared/api";
import {
  serverGetData,
  serverGetPaginated,
} from "@/src/shared/api/server-request";
import {
  type ListPublicListingsParams,
  publicListingQuery,
} from "./public-listing-query";

const publicListingsRevalidateSeconds = 60;

export async function listPublicListingsServer(
  params: ListPublicListingsParams = {},
): Promise<ApiPaginatedData<PublicListingItem>> {
  const categoryTag = params.categoryId === undefined
    ? "public-listings:all"
    : `public-listings:category:${params.categoryId}`;

  return serverGetPaginated(publicListingItemSchema, "/public/listings", {
    errorMessage: "Не удалось загрузить публичную витрину объявлений.",
    query: publicListingQuery(params),
    revalidate: publicListingsRevalidateSeconds,
    tags: ["public-listings", categoryTag],
  });
}

export async function showPublicListingServer(
  listingId: string,
): Promise<PublicListingItem> {
  return serverGetData(
    publicListingItemSchema,
    `/public/listings/${encodeURIComponent(listingId)}`,
    {
      errorMessage: "Не удалось загрузить публичное объявление.",
      revalidate: publicListingsRevalidateSeconds,
      tags: ["public-listings", `public-listing:${listingId}`],
    },
  );
}
