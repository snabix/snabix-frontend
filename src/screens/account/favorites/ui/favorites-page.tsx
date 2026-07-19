"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ListingCard, type ListingItem } from "@/src/entities/listing";
import { listFavoriteListings } from "@/src/features/listing/api";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { Button } from "@/src/shared/ui/shadcn/button";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

const defaultPaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: 12,
  to: null,
  total: 0,
};

export function FavoritesPage() {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(defaultPaginationMeta);
  const [isLoading, setIsLoading] = useState(true);
  const { favoriteListingIds, setFavoriteListingIds, toggleFavorite } = useFavoriteListings();

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const result = await listFavoriteListings({
          page,
          perPage: paginationMeta.perPage,
        });

        if (!isMounted) {
          return;
        }

        setItems(result.items);
        setPaginationMeta(result.meta);
        setFavoriteListingIds(new Set(result.items.map((item) => item.id)));
      } catch (error) {
        if (isMounted) {
          toast.error(extractApiError(error, "Не удалось загрузить избранные объявления."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [page, paginationMeta.perPage, setFavoriteListingIds]);

  const handleFavoriteToggle = async (listingId: string) => {
    await toggleFavorite(listingId);
    setItems((currentItems) => currentItems.filter((item) => item.id !== listingId));
    setPaginationMeta((currentMeta) => ({
      ...currentMeta,
      total: Math.max(currentMeta.total - 1, 0),
    }));
  };

  return (
    <div className="grid gap-6">
      <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_70%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
            <Heart size={15} fill="currentColor" />
            Избранное
          </div>
          <h1 className="font-heading mt-5 max-w-3xl text-4xl font-black leading-[1.04] text-[var(--brand-deep)] sm:text-5xl">
            Сохраняйте объявления, к которым хотите вернуться позже.
          </h1>
        </div>
      </section>

      <section className="surface-card rounded-[30px] p-6 sm:p-7">
        {isLoading ? (
          <SkeletonPanel className="min-h-60 border border-dashed border-[var(--border-soft)] shadow-none" />
        ) : items.length === 0 ? (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/">Смотреть объявления</Link>
              </Button>
            }
            description="Нажимайте на сердечко в карточке объявления, и оно появится здесь."
            icon={RefreshCw}
            title="Избранных объявлений пока нет"
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
              <ListingCard
                detailsHref={`/listings/${item.id}`}
                isFavorite={favoriteListingIds.has(item.id)}
                key={item.id}
                listing={item}
                onFavoriteToggle={handleFavoriteToggle}
                showStatus={false}
              />
            ))}
          </div>
        )}

        <Pagination
          align="between"
          isLoading={isLoading}
          meta={paginationMeta}
          onPageChange={setPage}
          page={page}
          showRange
        />
      </section>
    </div>
  );
}
