"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ListingItem } from "@/src/entities/listing";
import { deleteListing, showListing } from "@/src/features/listing/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";

type ListingDetailsPageProps = {
  listingId: string;
};

export function ListingDetailsPage({ listingId }: ListingDetailsPageProps) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadListing = async () => {
      try {
        setIsLoading(true);
        const item = await showListing(listingId);

        if (isMounted) {
          setListing(item);
        }
      } catch (error) {
        toast.error(extractApiError(error, "Не удалось загрузить объявление."));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadListing();

    return () => {
      isMounted = false;
    };
  }, [listingId]);

  const handleDelete = async () => {
    if (listing === null || !window.confirm("Удалить объявление?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteListing(listing.id);
      toast.success("Объявление удалено.");
      router.push("/account/listings");
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось удалить объявление."));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="surface-card flex min-h-80 items-center justify-center gap-3 rounded-[30px] text-sm font-semibold text-[var(--text-muted)]">
        <LoaderCircle className="animate-spin" size={18} />
        Загружаем объявление
      </div>
    );
  }

  if (listing === null) {
    return (
      <div className="surface-card rounded-[30px] p-8 text-center text-[var(--brand-deep)]">
        Объявление не найдено или недоступно.
      </div>
    );
  }

  return (
    <article className="grid gap-6">
          <section className="surface-card overflow-hidden rounded-[32px]">
            <div className="min-h-56 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_20%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_12%,var(--surface)))]" />
            <div className="p-6 sm:p-8">
              <Button asChild variant="ghost">
                <Link href="/account/listings">
                  <ArrowLeft size={17} />
                  К списку
                </Link>
              </Button>

              <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                      {listing.statusLabel}
                    </span>
                    <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {listing.typeLabel}
                    </span>
                  </div>
                  <h1 className="font-heading mt-5 max-w-4xl text-4xl font-black leading-tight text-[var(--brand-deep)]">
                    {listing.title}
                  </h1>
                  <p className="mt-4 text-2xl font-black text-[var(--brand-deep)]">
                    {listing.price === null ? "Цена не указана" : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "RUB"}`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/account/listings/${listing.id}/edit`}>
                      <Pencil size={17} />
                      Редактировать
                    </Link>
                  </Button>
                  <Button disabled={isDeleting} onClick={handleDelete} type="button" variant="destructive">
                    <Trash2 size={17} />
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="surface-card rounded-[30px] p-6 sm:p-7">
              <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Описание</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">
                {listing.description}
              </p>
            </div>

            <aside className="surface-card rounded-[30px] p-6 sm:p-7">
              <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Детали</h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <Detail label="Категория" value={listing.category?.name ?? "—"} />
                <Detail label="Состояние" value={listing.conditionLabel} />
                <Detail label="Торг" value={listing.isNegotiable ? "Разрешен" : "Не указан"} />
                <Detail label="Просмотры" value={String(listing.viewsCount)} />
              </dl>
            </aside>
          </section>

          {listing.attributeValues.length > 0 ? (
            <section className="surface-card rounded-[30px] p-6 sm:p-7">
              <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Характеристики</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {listing.attributeValues.map((attribute) => (
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4" key={attribute.attributeDefinitionId}>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {attribute.name ?? "Параметр"}
                    </p>
                    <p className="mt-2 font-black text-[var(--brand-deep)]">
                      {attribute.displayValue ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
    </article>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className="font-black text-[var(--brand-deep)]">{value}</dd>
    </div>
  );
}
