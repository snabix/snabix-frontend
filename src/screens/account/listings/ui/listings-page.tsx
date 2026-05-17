"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle, PackagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ListingCard, type ListingItem } from "@/src/entities/listing";
import { deleteListing } from "@/src/features/listing/api/delete-listing";
import { listListings } from "@/src/features/listing/api/list-listings";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";

export function ListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);

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

  const handleDelete = async (listingId: string) => {
    const shouldDelete = window.confirm("Удалить объявление? Это действие нельзя отменить.");

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingListingId(listingId);
      await deleteListing(listingId);
      setListings((currentListings) => currentListings.filter((listing) => listing.id !== listingId));
      toast.success("Объявление удалено.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось удалить объявление."));
    } finally {
      setDeletingListingId(null);
    }
  };

  return (
    <AccountLayout>
      <div className="grid gap-6">
        <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,rgba(0,70,67,0.18),transparent_70%)]" />
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
                Сетка рассчитана на четыре карточки в ряд на больших экранах.
              </p>
            </div>
            <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--brand-deep)]">
              {listings.length} всего
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex min-h-48 items-center justify-center gap-3 rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-muted)]">
                <LoaderCircle className="animate-spin" size={18} />
                Загружаем ваши объявления
              </div>
            ) : listings.length === 0 ? (
              <div className="grid min-h-56 place-items-center rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] p-8 text-center">
                <div>
                  <p className="font-heading text-2xl font-black text-[var(--brand-deep)]">
                    Объявлений пока нет
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-muted)]">
                    Создайте первый черновик, выберите категорию и заполните подготовленные характеристики.
                  </p>
                  <Button asChild className="mt-5">
                    <Link href="/account/listings/create">Создать объявление</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {listings.map((listing) => (
                  <ListingCard
                    isDeleting={deletingListingId === listing.id}
                    key={listing.id}
                    listing={listing}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}
