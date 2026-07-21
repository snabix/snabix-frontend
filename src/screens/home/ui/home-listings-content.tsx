import type { Dispatch, SetStateAction } from "react";
import { PackageOpen, RefreshCw } from "lucide-react";
import { ListingCard, type PublicListingItem } from "@/src/entities/listing";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { Button } from "@/src/shared/ui/shadcn/button";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

type HomeListingsContentProps = {
  errorMessage: string | null;
  favoriteListingIds: Set<string>;
  isLoading: boolean;
  items: PublicListingItem[];
  meta: ApiPaginationMeta;
  onFavoriteToggle: (listingId: string) => Promise<void>;
  onPageChange: Dispatch<SetStateAction<number>>;
  page: number;
};

export function HomeListingsContent({
  errorMessage,
  favoriteListingIds,
  isLoading,
  items,
  meta,
  onFavoriteToggle,
  onPageChange,
  page,
}: HomeListingsContentProps) {
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
        description="Мы не смогли получить объявления с сервера. Можно обновить страницу чуть позже или перейти в личный кабинет, если нужно продолжить работу с объявлениями."
        icon={RefreshCw}
        title="Витрина временно недоступна"
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        description="После запуска первых публикаций здесь появится живая витрина товаров и услуг."
        icon={PackageOpen}
        title="Пока нет опубликованных объявлений"
      />
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4">
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
