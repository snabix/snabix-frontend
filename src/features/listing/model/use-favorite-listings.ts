"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import {
  addListingFavorite,
  FAVORITE_LISTINGS_MAX_PER_PAGE,
  listFavoriteListings,
  removeListingFavorite,
} from "@/src/features/listing/api/favorite-listing";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { useMutationThrottle } from "@/src/shared/lib/use-mutation-throttle";

const defaultFavoriteListingIds: string[] = [];

export function useFavoriteListings(initialIds: string[] = defaultFavoriteListingIds) {
  const user = useUserStore((state) => state.user);
  const userId = user?.id ?? null;
  const runMutation = useMutationThrottle();
  const [favoriteListingIds, setFavoriteListingIds] = useState<Set<string>>(
    () => new Set(initialIds),
  );
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId === null) {
      return;
    }

    let isMounted = true;

    const loadFavoriteIds = async () => {
      try {
        const ids = new Set<string>();
        let page = 1;
        let lastPage = 1;

        do {
          const result = await listFavoriteListings({
            page,
            perPage: FAVORITE_LISTINGS_MAX_PER_PAGE,
          });

          result.items.forEach((item) => ids.add(item.id));
          lastPage = result.meta.lastPage;
          page += 1;
        } while (page <= lastPage);

        if (isMounted) {
          setFavoriteListingIds(ids);
        }
      } catch {
        if (isMounted) {
          setFavoriteListingIds(new Set(initialIds));
        }
      }
    };

    void loadFavoriteIds();

    return () => {
      isMounted = false;
    };
  }, [initialIds, userId]);

  const toggleFavorite = async (listingId: string) => {
    if (user === null) {
      toast.info("Войдите в аккаунт, чтобы добавлять объявления в избранное.");
      return;
    }

    const result = await runMutation(`listing:${listingId}:favorite`, async () => {
      if (pendingFavoriteIds.has(listingId)) {
        return;
      }

      const shouldRemove = favoriteListingIds.has(listingId);

      setPendingFavoriteIds((currentIds) => new Set(currentIds).add(listingId));
      setFavoriteListingIds((currentIds) => {
        const nextIds = new Set(currentIds);

        if (shouldRemove) {
          nextIds.delete(listingId);
        } else {
          nextIds.add(listingId);
        }

        return nextIds;
      });

      try {
        if (shouldRemove) {
          await removeListingFavorite(listingId);
        } else {
          await addListingFavorite(listingId);
        }
      } catch (error) {
        setFavoriteListingIds((currentIds) => {
          const nextIds = new Set(currentIds);

          if (shouldRemove) {
            nextIds.add(listingId);
          } else {
            nextIds.delete(listingId);
          }

          return nextIds;
        });
        toast.error(extractApiError(error, "Не удалось обновить избранное."));
      } finally {
        setPendingFavoriteIds((currentIds) => {
          const nextIds = new Set(currentIds);

          nextIds.delete(listingId);

          return nextIds;
        });
      }
    });

    if (!result.started) {
      return;
    }
  };

  return {
    favoriteListingIds: userId === null ? new Set(initialIds) : favoriteListingIds,
    setFavoriteListingIds,
    toggleFavorite,
  };
}
