"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, PackagePlus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  LISTING_STATUS_ARCHIVED,
  LISTING_STATUS_DRAFT,
  LISTING_STATUS_PENDING_REVIEW,
  LISTING_STATUS_PUBLISHED,
  LISTING_STATUS_REJECTED,
  LISTING_TYPE_PRODUCT,
  LISTING_TYPE_SERVICE,
  ListingCard,
  type ListingItem,
} from "@/src/entities/listing";
import { deleteListing, listListings } from "@/src/features/listing/api";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";
import { DeleteListingDialog } from "@/src/features/listing/ui/delete-listing-dialog";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { useMutationThrottle } from "@/src/shared/lib/use-mutation-throttle";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { Button } from "@/src/shared/ui/shadcn/button";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";
import { useAccountSidebarState } from "@/src/widgets/account/ui/account-sidebar-state";

const listingStatusOptions = [
  { label: "Все статусы", value: "" },
  { label: "Черновик", value: String(LISTING_STATUS_DRAFT) },
  { label: "На проверке", value: String(LISTING_STATUS_PENDING_REVIEW) },
  { label: "Опубликовано", value: String(LISTING_STATUS_PUBLISHED) },
  { label: "Отклонено", value: String(LISTING_STATUS_REJECTED) },
  { label: "В архиве", value: String(LISTING_STATUS_ARCHIVED) },
];

const listingTypeOptions = [
  { label: "Все типы", value: "" },
  { label: "Товары", value: String(LISTING_TYPE_PRODUCT) },
  { label: "Услуги", value: String(LISTING_TYPE_SERVICE) },
];

const defaultPaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: 12,
  to: null,
  total: 0,
};

export function ListingsPage() {
  const runMutation = useMutationThrottle();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const { favoriteListingIds, toggleFavorite } = useFavoriteListings();
  const { isCollapsed: isAccountSidebarCollapsed } = useAccountSidebarState();
  const [paginationMeta, setPaginationMeta] = useState<ApiPaginationMeta>(defaultPaginationMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListingIds, setSelectedListingIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<"bulk" | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      try {
        setIsLoading(true);
        const result = await listListings({
          page,
          perPage: paginationMeta.perPage,
          status: statusFilter === "" ? null : Number(statusFilter),
          type: typeFilter === "" ? null : Number(typeFilter),
        });

        if (isMounted) {
          setListings(result.items);
          setPaginationMeta(result.meta);
          setSelectedListingIds(new Set());
        }
      } catch (error) {
        if (isMounted) {
          toast.error(extractApiError(error, "Не удалось загрузить объявления пользователя."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadListings();

    return () => {
      isMounted = false;
    };
  }, [page, paginationMeta.perPage, statusFilter, typeFilter]);

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) {
      return;
    }

    try {
      const idsToDelete = Array.from(selectedListingIds);

      const result = await runMutation("listing:bulk-delete", async () => {
        setDeletingListingId("bulk");
        return Promise.all(idsToDelete.map((listingId) => deleteListing(listingId)));
      });

      if (!result.started) {
        return;
      }

      setListings((currentListings) => currentListings.filter((listing) => !selectedListingIds.has(listing.id)));
      setPaginationMeta((currentMeta) => ({
        ...currentMeta,
        total: Math.max(currentMeta.total - idsToDelete.length, 0),
      }));
      setSelectedListingIds(new Set());
      toast.success("Выбранные объявления удалены.");

      setDeleteTarget(null);
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось удалить выбранные объявления."));
    } finally {
      setDeletingListingId(null);
    }
  };

  const handleSelectToggle = (listingId: string) => {
    setSelectedListingIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(listingId)) {
        nextIds.delete(listingId);
      } else {
        nextIds.add(listingId);
      }

      return nextIds;
    });
  };

  const selectedCount = selectedListingIds.size;

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  return (
    <>
      <div className="grid gap-6">
        <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_70%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
                <Sparkles size={15} />
                Мои объявления
              </div>
              <h1 className="font-heading mt-5 max-w-3xl text-4xl font-black leading-[1.04] text-[var(--brand-deep)] sm:text-5xl">
                Управляйте объявлениями отдельными карточками, без перегруза профиля.
              </h1>
            </div>

            <Button asChild size="lg">
              <Link href="/account/listings/create">
                <PackagePlus size={18} />
                Создать объявление
              </Link>
            </Button>
          </div>
        </section>

        <section className="surface-card rounded-[30px] p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex w-full flex-wrap items-center justify-between gap-3 lg:w-auto">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  aria-label="Фильтр по статусу объявления"
                  className="h-11 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                  onChange={(event) => handleStatusFilterChange(event.target.value)}
                  value={statusFilter}
                >
                  {listingStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Фильтр по типу объявления"
                  className="h-11 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                  onChange={(event) => handleTypeFilterChange(event.target.value)}
                  value={typeFilter}
                >
                  {listingTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {selectedCount > 0 ? (
                  <Button
                    disabled={deletingListingId !== null}
                    onClick={() => setDeleteTarget("bulk")}
                    type="button"
                    variant="destructive"
                  >
                    <Trash2 size={16} />
                    Удалить выбранные ({selectedCount})
                  </Button>
                ) : null}
              </div>

              <div className="flex rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-1">
                <button
                  aria-label="Показать объявления сеткой"
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
                    viewMode === "grid"
                      ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
                  ].join(" ")}
                  onClick={() => setViewMode("grid")}
                  type="button"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  aria-label="Показать объявления списком"
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
                    viewMode === "list"
                      ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
                  ].join(" ")}
                  onClick={() => setViewMode("list")}
                  type="button"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <SkeletonPanel className="min-h-48 border border-dashed border-[var(--border-soft)] shadow-none" />
            ) : listings.length === 0 ? (
              <EmptyState
                action={
                  <Button asChild>
                    <Link href="/account/listings/create">Создать объявление</Link>
                  </Button>
                }
                description="Создайте первый черновик, выберите категорию и заполните подготовленные характеристики."
                icon={PackagePlus}
                title="Объявлений пока нет"
              />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? [
                      "grid gap-5 lg:grid-cols-2",
                      isAccountSidebarCollapsed ? "xl:grid-cols-4" : "xl:grid-cols-3",
                    ].join(" ")
                    : "grid gap-4"
                }
              >
                {listings.map((listing) => (
                  <ListingCard
                    detailsHref={`/account/listings/${listing.id}`}
                    isFavorite={favoriteListingIds.has(listing.id)}
                    isSelected={selectedListingIds.has(listing.id)}
                    key={listing.id}
                    listing={listing}
                    onFavoriteToggleAction={toggleFavorite}
                    onSelectToggleAction={handleSelectToggle}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>

          <Pagination
            align="between"
            isLoading={isLoading}
            meta={paginationMeta}
            onPageChangeAction={setPage}
            page={page}
            showRange
          />
        </section>
      </div>

      <DeleteListingDialog
        isDeleting={deletingListingId !== null}
        isOpen={deleteTarget !== null}
        itemsCount={selectedCount}
        listingTitle={null}
        onConfirmAction={handleDeleteConfirm}
        onOpenChangeAction={(isOpen) => {
          if (!isOpen && deletingListingId === null) {
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}
