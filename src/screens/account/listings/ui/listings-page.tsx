"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, PackagePlus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ListingCard, type ListingItem } from "@/src/entities/listing";
import { deleteListing, listListings } from "@/src/features/listing/api";
import { DeleteListingDialog } from "@/src/features/listing/ui/delete-listing-dialog";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Button } from "@/src/shared/ui/shadcn/button";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

export function ListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [favoriteListingIds, setFavoriteListingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListingIds, setSelectedListingIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "single"; listing: ListingItem } | { type: "bulk" } | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      try {
        setIsLoading(true);
        const items = await listListings();

        if (isMounted) {
          setListings(items);
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
  }, []);

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) {
      return;
    }

    try {
      if (deleteTarget.type === "single") {
        setDeletingListingId(deleteTarget.listing.id);
        await deleteListing(deleteTarget.listing.id);
        setListings((currentListings) => currentListings.filter((listing) => listing.id !== deleteTarget.listing.id));
        setSelectedListingIds((currentIds) => {
          const nextIds = new Set(currentIds);

          nextIds.delete(deleteTarget.listing.id);

          return nextIds;
        });
        toast.success("Объявление удалено.");
      } else {
        const idsToDelete = Array.from(selectedListingIds);

        setDeletingListingId("bulk");
        await Promise.all(idsToDelete.map((listingId) => deleteListing(listingId)));
        setListings((currentListings) => currentListings.filter((listing) => !selectedListingIds.has(listing.id)));
        setSelectedListingIds(new Set());
        toast.success("Выбранные объявления удалены.");
      }

      setDeleteTarget(null);
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось удалить выбранные объявления."));
    } finally {
      setDeletingListingId(null);
    }
  };

  const handleFavoriteToggle = (listingId: string) => {
    setFavoriteListingIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(listingId)) {
        nextIds.delete(listingId);
      } else {
        nextIds.add(listingId);
      }

      return nextIds;
    });
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
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                В этом разделе только сетка объявлений. Создание и редактирование вынесены на
                отдельные страницы, чтобы форма не смешивалась с личным кабинетом.
              </p>
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
            <div>
              <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
                Карточки объявлений
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Переключайте компактную сетку и широкий список под текущий сценарий просмотра.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {selectedCount > 0 ? (
                <Button
                  disabled={deletingListingId !== null}
                  onClick={() => setDeleteTarget({ type: "bulk" })}
                  type="button"
                  variant="destructive"
                >
                  <Trash2 size={16} />
                  Удалить выбранные ({selectedCount})
                </Button>
              ) : null}
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
                  Сетка
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
                  Список
                </button>
              </div>
              <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--brand-deep)]">
                {listings.length} всего
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
              <div className={viewMode === "grid" ? "grid gap-5 lg:grid-cols-3" : "grid gap-4"}>
                {listings.map((listing) => (
                  <ListingCard
                    isFavorite={favoriteListingIds.has(listing.id)}
                    isDeleting={deletingListingId === listing.id || (deletingListingId === "bulk" && selectedListingIds.has(listing.id))}
                    isSelected={selectedListingIds.has(listing.id)}
                    key={listing.id}
                    listing={listing}
                    onFavoriteToggle={handleFavoriteToggle}
                    onDelete={() => setDeleteTarget({ type: "single", listing })}
                    onSelectToggle={handleSelectToggle}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <DeleteListingDialog
        isDeleting={deletingListingId !== null}
        isOpen={deleteTarget !== null}
        itemsCount={deleteTarget?.type === "bulk" ? selectedCount : 1}
        listingTitle={deleteTarget?.type === "single" ? deleteTarget.listing.title : null}
        onConfirm={handleDeleteConfirm}
        onOpenChange={(isOpen) => {
          if (!isOpen && deletingListingId === null) {
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}
