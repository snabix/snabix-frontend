"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  SearchX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListingMediaGallery, type ListingItem } from "@/src/entities/listing";
import { archiveListing, deleteListing, showListing, submitListingForReview } from "@/src/features/listing/api";
import { DeleteListingDialog } from "@/src/features/listing/ui/delete-listing-dialog";
import { ListingManagementMenu } from "@/src/features/listing/ui/listing-management-menu";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { useMutationThrottle } from "@/src/shared/lib/use-mutation-throttle";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Container } from "@/src/shared/ui/container";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

type ListingDetailsPageProps = {
  listingId: string;
};

export function ListingDetailsPage({ listingId }: ListingDetailsPageProps) {
  const router = useRouter();
  const runMutation = useMutationThrottle();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const categoryBreadcrumbs = useMemo(() => (listing ? buildCategoryBreadcrumbs(listing) : []), [listing]);
  const fullLocation = useMemo(() => (listing ? buildFullLocation(listing) : "Локация не указана"), [listing]);
  const detailPairs = useMemo(() => {
    if (listing === null) {
      return [] as Array<[string, string]>;
    }

    const basePairs = [
      ["Тип объявления", listing.typeLabel],
      ["Состояние", listing.conditionLabel],
      ["Торг уместен", listing.isNegotiable ? "Да" : "Нет"],
    ] as Array<[string, string]>;

    const attributePairs = listing.attributeValues
      .filter((attribute) => attribute.displayValue)
      .slice(0, 4)
      .map((attribute) => [attribute.name ?? "Параметр", attribute.displayValue ?? "—"] as [string, string]);

    return [...basePairs, ...attributePairs];
  }, [listing]);

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
        if (isMounted) {
          toast.error(extractApiError(error, "Не удалось загрузить объявление."));
        }
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
      const result = await runMutation(`listing:${listing.id}:delete`, async () => {
        setIsDeleting(true);
        return deleteListing(listing.id);
      });

      if (!result.started) {
        return;
      }

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
      const result = await runMutation(`listing:${listing.id}:submit-review`, async () => {
        setIsSubmittingForReview(true);
        return submitListingForReview(listing.id);
      });

      if (!result.started) {
        return;
      }

      const updatedListing = result.value;
      setListing(updatedListing);
      toast.success("Объявление отправлено на проверку.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить объявление на проверку."));
    } finally {
      setIsSubmittingForReview(false);
    }
  };

  const handleArchive = async () => {
    if (listing === null) {
      return;
    }

    try {
      const result = await runMutation(`listing:${listing.id}:archive`, async () => {
        setIsArchiving(true);
        return archiveListing(listing.id);
      });

      if (!result.started) {
        return;
      }

      const updatedListing = result.value;
      setListing(updatedListing);
      toast.success("Объявление перенесено в архив.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось архивировать объявление."));
    } finally {
      setIsArchiving(false);
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

  const publishedAt = formatDateTime(listing.publishedAt);
  const expiresAt = formatDateTime(listing.expiresAt);
  const priceLabel = listing.price === null
    ? "Цена не указана"
    : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "₽"}`;

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_28%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand)_7%,transparent),transparent_24%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_62%,transparent),var(--background))]">
        <Container className="py-8">
          <div className="grid gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--brand-deep)]"
                href="/account/listings"
              >
                <ArrowLeft size={17} />
                Назад
              </Link>
            </div>

            <nav
              aria-label="Категория объявления"
              className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--text-muted)]"
            >
              <Link className="transition hover:text-[var(--brand-deep)]" href="/">
                Объявления
              </Link>
              {categoryBreadcrumbs.map((category) => (
                <span className="inline-flex items-center gap-2" key={category.id}>
                  <ChevronRight size={15} />
                  <Link
                    className="transition hover:text-[var(--brand-deep)]"
                    href={`/?categoryId=${encodeURIComponent(String(category.id))}`}
                  >
                    {category.name}
                  </Link>
                </span>
              ))}
            </nav>

            <section className="rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-4 shadow-[var(--shadow-card)] sm:p-6">
              <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
                <div>
                  <ListingMediaGallery
                    imageUrl={listing.imageUrl}
                    imageUrls={listing.imageUrls}
                    mode="details"
                    title={listing.title}
                  />
                </div>

                <div className="grid gap-5">
                  <div className="relative">
                    <div className="absolute right-0 top-0 z-30">
                      <ListingManagementMenu
                        editHref={`/account/listings/${listing.id}/edit`}
                        isDeleting={isDeleting}
                        isArchiving={isArchiving}
                        isSubmittingForReview={isSubmittingForReview}
                        listing={listing}
                        onArchiveAction={handleArchive}
                        onDeleteAction={() => setIsDeleteDialogOpen(true)}
                        onSubmitForReviewAction={handleSubmitForReview}
                      />
                    </div>

                    <div>
                      <div className="mb-4 flex max-w-[calc(100%-64px)] flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                          {listing.statusLabel}
                        </span>
                        <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          {listing.typeLabel}
                        </span>
                      </div>
                      <h1 className="font-heading text-[clamp(2rem,3vw,3.3rem)] font-black tracking-[-0.06em] text-[var(--brand-deep)]">
                        {listing.title}
                      </h1>
                      <p className="mt-4 text-[2.25rem] font-black tracking-[-0.05em] text-[var(--brand-deep)]">
                        {priceLabel}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                        <MapPin size={20} />
                      </span>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
                          Местоположение
                        </p>
                        <p className="mt-2 text-base font-semibold leading-6 text-[var(--brand-deep)]">
                          {fullLocation}
                        </p>
                        <button className="mt-2 text-sm font-semibold text-[var(--accent)] transition hover:opacity-80" type="button">
                          Показать на карте
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
              <div className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
                <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Описание</h2>
                <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-[var(--text-muted)]">
                  {listing.description}
                </p>

                <div className="mt-8 border-t border-[var(--border-soft)] pt-6">
                  <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Характеристики</h2>
                  <div className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
                    {detailPairs.map(([label, value]) => (
                      <div className="grid grid-cols-[190px_minmax(0,1fr)] gap-4 border-b border-[var(--border-soft)] pb-3" key={label}>
                        <span className="text-sm text-[var(--text-muted)]">{label}</span>
                        <span className="text-sm font-semibold text-[var(--brand-deep)]">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <aside className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
                  <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Статус и сроки</h2>
                  <div className="mt-6 grid gap-4">
                    <StatusMetric
                      accent
                      label="Статус"
                      value={listing.statusLabel}
                    />
                    <div className="h-px bg-[var(--border-soft)]" />
                    <StatusMetric label="Размещено" value={publishedAt} />
                    <div className="h-px bg-[var(--border-soft)]" />
                    <StatusMetric label="Действует до" value={expiresAt} />
                  </div>
                </aside>
              </div>
            </section>
          </div>
        </Container>
      </div>

      <DeleteListingDialog
        isDeleting={isDeleting}
        isOpen={isDeleteDialogOpen}
        listingTitle={listing.title}
        onConfirmAction={handleDeleteConfirm}
        onOpenChangeAction={setIsDeleteDialogOpen}
      />
    </>
  );
}

function StatusMetric({
  accent = false,
  label,
  value,
}: {
  accent?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <div className="mt-3 flex items-center gap-2">
        {accent ? <span className="size-2.5 rounded-full bg-[#47C266]" /> : null}
        <p className="text-sm font-semibold text-[var(--brand-deep)]">{value}</p>
      </div>
    </div>
  );
}

type CategoryBreadcrumb = {
  id: string | number;
  name: string;
  slug: string;
};

function buildCategoryBreadcrumbs(listing: ListingItem): CategoryBreadcrumb[] {
  if (listing.category === null) {
    return [];
  }

  if (listing.category.breadcrumbs !== undefined && listing.category.breadcrumbs.length > 0) {
    return listing.category.breadcrumbs;
  }

  const rawPath = listing.category.fullName ?? listing.category.path ?? listing.category.name;
  const names = rawPath
    .split(/[/>]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return names.map((name, index) => ({
    id: index === names.length - 1 ? listing.category?.id ?? name : name,
    name,
    slug: name,
  }));
}

function buildFullLocation(listing: ListingItem): string {
  if (listing.location !== null && listing.location !== undefined) {
    return [
      listing.location.region.fullName || listing.location.region.name,
      listing.location.city?.name,
      listing.location.addressLine,
    ].filter(Boolean).join(", ") || "Локация не указана";
  }

  const location = [
    listing.region,
    listing.city,
    listing.addressLine ?? [listing.street, listing.house].filter(Boolean).join(", "),
  ].filter(Boolean).join(", ");

  if (location) {
    return location;
  }

  if (listing.fullLocation) {
    return listing.fullLocation;
  }

  return "Локация не указана";
}

function formatDateTime(value: string | null): string {
  if (value === null) {
    return "Не указано";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
