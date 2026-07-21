import "server-only";

import type { CategoryNode } from "@/src/entities/category";
import {
  listRootCategoriesServer,
  showCategoryBranchServer,
} from "@/src/entities/category/api/server-categories";
import { listPublicListingsServer } from "@/src/features/listing/api/server-public-listings";
import {
  CATEGORY_LISTINGS_PER_PAGE,
  emptyPublicListingsData,
  HOME_LISTINGS_PER_PAGE,
  type PublicListingsInitialState,
} from "@/src/screens/listings/model/public-listings-initial-state";
import { isServerApiError } from "@/src/shared/api/server-request";

type HomeStorefrontData = {
  categories: CategoryNode[];
  categoriesError: string | null;
  listings: PublicListingsInitialState;
};

type CategoryStorefrontData = {
  category: CategoryNode | null;
  categoryError: string | null;
  categoryNotFound: boolean;
  listings: PublicListingsInitialState;
};

export async function loadHomeStorefront(): Promise<HomeStorefrontData> {
  const [listingsResult, categoriesResult] = await Promise.allSettled([
    listPublicListingsServer({
      page: 1,
      perPage: HOME_LISTINGS_PER_PAGE,
    }),
    listRootCategoriesServer(),
  ]);

  return {
    categories: categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [],
    categoriesError: categoriesResult.status === "rejected"
      ? "Не удалось загрузить категории."
      : null,
    listings: listingsResult.status === "fulfilled"
      ? {
          data: listingsResult.value,
          errorMessage: null,
        }
      : {
          data: emptyPublicListingsData(HOME_LISTINGS_PER_PAGE),
          errorMessage: "Не удалось загрузить объявления.",
        },
  };
}

export async function loadCategoryStorefront(
  categoryId: string,
): Promise<CategoryStorefrontData> {
  const [listingsResult, categoryResult] = await Promise.allSettled([
    listPublicListingsServer({
      categoryId,
      page: 1,
      perPage: CATEGORY_LISTINGS_PER_PAGE,
    }),
    showCategoryBranchServer(categoryId),
  ]);
  const categoryError = categoryResult.status === "rejected"
    ? categoryResult.reason
    : null;

  return {
    category: categoryResult.status === "fulfilled"
      ? categoryResult.value
      : null,
    categoryError: categoryError !== null
      ? "Не удалось загрузить раздел каталога."
      : null,
    categoryNotFound: isServerApiError(categoryError)
      && categoryError.status === 404,
    listings: listingsResult.status === "fulfilled"
      ? {
          data: listingsResult.value,
          errorMessage: null,
        }
      : {
          data: emptyPublicListingsData(CATEGORY_LISTINGS_PER_PAGE),
          errorMessage: "Не удалось загрузить объявления.",
        },
  };
}
