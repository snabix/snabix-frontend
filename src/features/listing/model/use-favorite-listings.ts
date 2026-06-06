"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import {
  addListingFavorite,
  removeListingFavorite,
} from "@/src/features/listing/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function useFavoriteListings(initialIds: string[] = []) {
  const user = useUserStore((state) => state.user);
  const [favoriteListingIds, setFavoriteListingIds] = useState<Set<string>>(
    () => new Set(initialIds),
  );
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<Set<string>>(new Set());

  const toggleFavorite = async (listingId: string) => {
    if (user === null) {
      toast.info("Войдите в аккаунт, чтобы добавлять объявления в избранное.");
      return;
    }

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
  };

  return {
    favoriteListingIds,
    setFavoriteListingIds,
    toggleFavorite,
  };
}
