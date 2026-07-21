import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import type { CategoryNode } from "@/src/entities/category";
import { listPublicListings } from "@/src/features/listing/api/list-public-listings";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import {
  defaultPublicListingFilters,
  type PublicListingFiltersState,
} from "@/src/screens/home/ui/public-listing-filters";
import { toPublicListingParams } from "../lib/public-listing-filter-params";
import {
  CATEGORY_LISTINGS_PER_PAGE,
  emptyPublicListingsData,
  type PublicListingsInitialState,
} from "./public-listings-initial-state";

const defaultPublicListingsData = emptyPublicListingsData(
  CATEGORY_LISTINGS_PER_PAGE,
);

type UsePublicListingsOptions = {
  initialCategory: CategoryNode | null;
  initialCategoryError: string | null;
  initialCategoryId?: string;
  initialState: PublicListingsInitialState;
};

export function usePublicListings({
  initialCategory,
  initialCategoryError,
  initialCategoryId,
  initialState,
}: UsePublicListingsOptions) {
  const [items, setItems] = useState(initialState.data.items);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialState.errorMessage,
  );
  const { favoriteListingIds, setFavoriteListingIds, toggleFavorite } = useFavoriteListings();
  const [paginationMeta, setPaginationMeta] = useState(initialState.data.meta);
  const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(draftFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [, startFiltersTransition] = useTransition();
  const canRunClientRequest = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startFiltersTransition(() => {
        setPage(1);
        setAppliedFilters(draftFilters);
      });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [draftFilters]);

  useEffect(() => {
    if (!canRunClientRequest.current) {
      const timeoutId = window.setTimeout(() => {
        canRunClientRequest.current = true;
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    let isMounted = true;

    const loadItems = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const listings = await listPublicListings({
          ...toPublicListingParams(appliedFilters),
          categoryId: initialCategoryId,
          page,
          perPage: CATEGORY_LISTINGS_PER_PAGE,
        });

        if (!isMounted) {
          return;
        }

        setItems(listings.items);
        setFavoriteListingIds((currentIds) => {
          const nextIds = new Set(currentIds);

          listings.items.forEach((item) => {
            if (item.isFavorite) {
              nextIds.add(item.id);
            }
          });

          return nextIds;
        });
        setPaginationMeta(listings.meta);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = extractApiError(error, "Не удалось загрузить объявления.");

        setErrorMessage(message);
        setItems([]);
        setPaginationMeta(defaultPublicListingsData.meta);
        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, initialCategoryId, page, setFavoriteListingIds]);

  const handleFiltersReset = () => {
    setDraftFilters(defaultPublicListingFilters);
    setAppliedFilters(defaultPublicListingFilters);
    setPage(1);
  };

  return {
    draftFilters,
    errorMessage,
    favoriteListingIds,
    handleFiltersReset,
    isLoading,
    items,
    page,
    paginationMeta,
    selectedCategory: initialCategory,
    selectedCategoryError: initialCategoryError,
    selectedCategoryStatus: initialCategoryError !== null
      ? ("error" as const)
      : ("success" as const),
    setDraftFilters,
    setPage,
    toggleFavorite,
  };
}
