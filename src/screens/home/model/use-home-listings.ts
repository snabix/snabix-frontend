import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { PublicListingItem } from "@/src/entities/listing";
import { listPublicListings } from "@/src/features/listing/api";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import {
  defaultPublicListingFilters,
  type PublicListingFiltersState,
} from "@/src/screens/home/ui/public-listing-filters";
import { toPublicListingParams } from "@/src/screens/listings/lib/public-listing-filter-params";

const homeListingsPerPage = 16;

const defaultHomePaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: homeListingsPerPage,
  to: null,
  total: 0,
};

export function useHomeListings(initialCategoryId?: string) {
  const [items, setItems] = useState<PublicListingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { favoriteListingIds, setFavoriteListingIds, toggleFavorite } = useFavoriteListings();
  const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultHomePaginationMeta);
  const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [, startFiltersTransition] = useTransition();

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
    document.body.style.overflow = isFiltersOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFiltersOpen]);

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
          perPage: homeListingsPerPage,
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
        setPaginationMeta(defaultHomePaginationMeta);
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
    isFiltersOpen,
    isLoading,
    items,
    page,
    paginationMeta,
    setDraftFilters,
    setIsFiltersOpen,
    setPage,
    setViewMode,
    toggleFavorite,
    viewMode,
  };
}
