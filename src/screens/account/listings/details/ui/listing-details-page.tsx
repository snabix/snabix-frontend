"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, MapPin, MoreHorizontal, Pencil, SearchX, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListingMediaGallery, type ListingItem } from "@/src/entities/listing";
import { deleteListing, showListing, submitListingForReview } from "@/src/features/listing/api";
import { DeleteListingDialog } from "@/src/features/listing/ui/delete-listing-dialog";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

type ListingDetailsPageProps = {
  listingId: string;
};

export function ListingDetailsPage({ listingId }: ListingDetailsPageProps) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);

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
        toast.error(
            extractApiError(
                error,
                "Не удалось загрузить объявление."
            )
        );
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

  const handleDeleteConfirm = async () => {
    if (listing === null) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteListing(listing.id);
      setIsDeleteDialogOpen(false);
      toast.success("Объявление удалено.");
      router.push("/account/listings");
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось удалить объявление."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (listing === null) {
      return;
    }

    try {
      setIsSubmittingForReview(true);
      const updatedListing = await submitListingForReview(listing.id);

      setListing(updatedListing);
      toast.success("Объявление отправлено на проверку.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить объявление на проверку."));
    } finally {
      setIsSubmittingForReview(false);
    }
  };

  if (isLoading) {
    return <SkeletonPanel className="min-h-80" />;
  }

  if (listing === null) {
    return (
      <EmptyState
        description="Возможно, объявление удалено, скрыто или у вас больше нет доступа к нему."
        icon={SearchX}
        title="Объявление не найдено"
      />
    );
  }

  const categoryPath = buildCategoryPath(listing);
  const fullLocation = buildFullLocation(listing);
  const publishedAt = formatListingDate(listing.publishedAt);
  const expiresAt = formatListingDate(listing.expiresAt);

  return (
    <>
      <article className="grid gap-6">
        <section className="surface-card overflow-hidden rounded-[32px] p-6 sm:p-8">
          <Button asChild variant="ghost">
            <Link href="/account/listings">
              <ArrowLeft size={17} />
              К списку
            </Link>
          </Button>

          <nav aria-label="Категория объявления" className="mt-6 flex flex-wrap items-center gap-2 text-sm font-black text-[var(--text-muted)]">
            <Link className="transition-colors hover:text-[var(--brand-deep)]" href="/account/listings">
              Мои объявления
            </Link>
            {categoryPath.map((segment) => (
              <span className="inline-flex items-center gap-2" key={segment}>
                <ChevronRight size={15} />
                <span>{segment}</span>
              </span>
            ))}
          </nav>

          <div className="mt-6 flex items-start justify-between gap-4">
            <h1 className="font-heading max-w-5xl text-4xl font-black leading-tight text-[var(--brand-deep)] sm:text-5xl">
              {listing.title}
            </h1>

            <ListingActionsMenu
              editHref={`/account/listings/${listing.id}/edit`}
              isDeleting={isDeleting}
              isDraft={listing.status === 1}
              isSubmittingForReview={isSubmittingForReview}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onSubmitForReview={handleSubmitForReview}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px]">
            <ListingMediaGallery
              imageUrl={listing.imageUrl}
              imageUrls={listing.imageUrls}
              mode="details"
              title={listing.title}
            />

            <aside className="rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                  {listing.statusLabel}
                </span>
                <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {listing.typeLabel}
                </span>
              </div>

              <dl className="mt-6 grid gap-3 text-sm">
                <Detail label="Цена" value={listing.price === null ? "Цена не указана" : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "RUB"}`} />
                <Detail label="Статус" value={listing.statusLabel} />
                <Detail label="Тип объявления" value={listing.typeLabel} />
                <Detail label="Локация" value={fullLocation} />
              </dl>

              <div className="mt-5 inline-flex items-start gap-2 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--brand-deep)]">
                <MapPin className="mt-0.5 shrink-0" size={17} />
                {fullLocation}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="surface-card rounded-[30px] p-6 sm:p-7">
            <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Описание</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">
              {listing.description}
            </p>
          </div>

          <aside className="surface-card rounded-[30px] p-6 sm:p-7">
            <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Детали</h2>
            <dl className="mt-5 grid gap-3">
              <Detail label="Категория" value={categoryPath.join(" / ") || "—"} />
              <Detail label="Состояние" value={listing.conditionLabel} />
              <Detail label="Торг" value={listing.isNegotiable ? "Разрешен" : "Не указан"} />
              <Detail label="Просмотры" value={String(listing.viewsCount)} />
              <Detail label="Публикация" value={publishedAt} />
              <Detail label="Срок действия" value={expiresAt} />
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

      <DeleteListingDialog
        isDeleting={isDeleting}
        isOpen={isDeleteDialogOpen}
        listingTitle={listing.title}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}

function ListingActionsMenu({
  editHref,
  isDeleting,
  isDraft,
  isSubmittingForReview,
  onDelete,
  onSubmitForReview,
}: {
  editHref: string;
  isDeleting: boolean;
  isDraft: boolean;
  isSubmittingForReview: boolean;
  onDelete: () => void;
  onSubmitForReview: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Открыть меню действий объявления"
          className="shrink-0 rounded-2xl"
          size="icon"
          type="button"
          variant="outline"
        >
          <MoreHorizontal size={19} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="listing-actions-dropdown min-w-56"
      >
        <DropdownMenuItem asChild>
          <Link className="flex items-center gap-2" href={editHref}>
            <Pencil size={16} />
            <span>Редактировать</span>
          </Link>
        </DropdownMenuItem>
        {isDraft ? (
          <DropdownMenuItem
            disabled={isSubmittingForReview}
            onClick={onSubmitForReview}
          >
            <ChevronRight size={16} />
            <span>{isSubmittingForReview ? "Отправляем..." : "Отправить на проверку"}</span>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          className="text-[var(--danger)] focus:text-[var(--danger)]"
          disabled={isDeleting}
          onClick={onDelete}
        >
          <Trash2 size={16} />
          <span>Удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildCategoryPath(listing: ListingItem): string[] {
  if (listing.category === null) {
    return [];
  }

  const rawPath = listing.category.fullName ?? listing.category.path ?? listing.category.name;

  return rawPath
    .split(/[/>]/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function buildFullLocation(listing: ListingItem): string {
  if (listing.fullLocation) {
    return listing.fullLocation;
  }

  return [
    listing.region,
    listing.city,
    listing.addressLine ?? [listing.street, listing.house].filter(Boolean).join(", "),
  ].filter(Boolean).join(", ") || "Локация не указана";
}

function formatListingDate(value: string | null): string {
  if (value === null) {
    return "Не указано";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    second: "2-digit",
    year: "numeric",
  }).format(date);
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
