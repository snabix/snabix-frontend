import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { listPublicListings } from "@/src/features/listing/api/list-public-listings";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import {
  defaultPublicListingFilters,
  type PublicListingFiltersState,
} from "@/src/screens/home/ui/public-listing-filters";
import { toPublicListingParams } from "@/src/screens/listings/lib/public-listing-filter-params";
import {
  emptyPublicListingsData,
  HOME_LISTINGS_PER_PAGE,
  type PublicListingsInitialState,
} from "@/src/screens/listings/model/public-listings-initial-state";

const defaultHomeListingsData = emptyPublicListingsData(HOME_LISTINGS_PER_PAGE);

export function useHomeListings(
  initialCategoryId: string | undefined,
  initialState: PublicListingsInitialState,
) {
  const [items, setItems] = useState(initialState.data.items);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialState.errorMessage,
  );
  const { favoriteListingIds, setFavoriteListingIds, toggleFavorite } = useFavoriteListings();
  const [paginationMeta, setPaginationMeta] = useState(initialState.data.meta);
  const [draftFilters, setDraftFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [appliedFilters, setAppliedFilters] = useState<PublicListingFiltersState>(defaultPublicListingFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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
    document.body.style.overflow = isFiltersOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFiltersOpen]);

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
          perPage: HOME_LISTINGS_PER_PAGE,
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
        setPaginationMeta(defaultHomeListingsData.meta);
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
    toggleFavorite,
  };
}
