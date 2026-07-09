import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/src/entities/category";
import type { PublicListingItem } from "@/src/entities/listing";
import { listPublicListings } from "@/src/features/listing/api";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import {
  defaultPublicListingFilters,
  type PublicListingFiltersState,
} from "@/src/screens/home/ui/public-listing-filters";
import { toPublicListingParams } from "../lib/public-listing-filter-params";

const publicListingsPerPage = 15;

export const defaultPublicListingsPaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: publicListingsPerPage,
  to: null,
  total: 0,
};

export function usePublicListings(initialCategoryId?: string) {
  const [items, setItems] = useState<PublicListingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { favoriteListingIds, setFavoriteListingIds, toggleFavorite } = useFavoriteListings();
  const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultPublicListingsPaginationMeta);
  const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(draftFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [, startFiltersTransition] = useTransition();
  const branches = useCategoryStore((state) => state.branches);
  const branchStatuses = useCategoryStore((state) => state.branchStatuses);
  const branchErrorMessages = useCategoryStore((state) => state.branchErrorMessages);
  const loadBranch = useCategoryStore((state) => state.loadBranch);
  const selectedCategory = initialCategoryId ? branches[initialCategoryId] ?? null : null;
  const selectedCategoryStatus = initialCategoryId ? branchStatuses[initialCategoryId] ?? "idle" : "idle";
  const selectedCategoryError = initialCategoryId ? branchErrorMessages[initialCategoryId] ?? null : null;

  useEffect(() => {
    if (initialCategoryId) {
      void loadBranch(initialCategoryId);
    }
  }, [initialCategoryId, loadBranch]);

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
    let isMounted = true;

    const loadItems = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const listings = await listPublicListings({
          ...toPublicListingParams(appliedFilters),
          categoryId: initialCategoryId,
          page,
          perPage: publicListingsPerPage,
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
        setPaginationMeta(defaultPublicListingsPaginationMeta);
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
    selectedCategory,
    selectedCategoryError,
    selectedCategoryStatus,
    setDraftFilters,
    setPage,
    toggleFavorite,
  };
}
