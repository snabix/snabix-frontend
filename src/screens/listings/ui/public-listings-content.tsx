import type { Dispatch, SetStateAction } from "react";
import { PackageOpen, RefreshCw } from "lucide-react";
import { ListingCard, type PublicListingItem } from "@/src/entities/listing";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { Button } from "@/src/shared/ui/shadcn/button";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

type PublicListingsContentProps = {
  errorMessage: string | null;
  favoriteListingIds: Set<string>;
  isLoading: boolean;
  items: PublicListingItem[];
  meta: ApiPaginationMeta;
  onFavoriteToggle: (listingId: string) => Promise<void>;
  onPageChange: Dispatch<SetStateAction<number>>;
  page: number;
};

export function PublicListingsContent({
  errorMessage,
  favoriteListingIds,
  isLoading,
  items,
  meta,
  onFavoriteToggle,
  onPageChange,
  page,
}: PublicListingsContentProps) {
  if (isLoading) {
    return <SkeletonPanel className="min-h-[280px]" />;
  }

  if (errorMessage !== null) {
    return (
      <EmptyState
        action={
          <Button
            className="rounded-[18px] px-5 py-6"
            onClick={() => window.location.reload()}
            type="button"
          >
            Обновить страницу
          </Button>
        }
        description="Мы не смогли получить объявления с сервера. Можно обновить страницу чуть позже."
        icon={RefreshCw}
        title="Витрина временно недоступна"
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        description="Для выбранной категории пока нет опубликованных товаров или услуг."
        icon={PackageOpen}
        title="Пока нет объявлений"
      />
    );
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <ListingCard
            detailsHref={`/listings/${item.id}`}
            isFavorite={favoriteListingIds.has(item.id)}
            key={item.id}
            listing={item}
            onFavoriteToggle={onFavoriteToggle}
            showStatus={false}
          />
        ))}
      </div>

      <Pagination
        isLoading={isLoading}
        meta={meta}
        onPageChange={onPageChange}
        page={page}
      />
    </>
  );
}
