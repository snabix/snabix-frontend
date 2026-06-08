"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleAlert,
  CircleDot,
  MapPin,
  Menu,
  Pencil,
  Plus,
  SearchX,
  Sparkles,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListingMediaGallery, type ListingItem } from "@/src/entities/listing";
import { deleteListing, showListing, submitListingForReview } from "@/src/features/listing/api";
import { DeleteListingDialog } from "@/src/features/listing/ui/delete-listing-dialog";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Container } from "@/src/shared/ui/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const categoryPath = useMemo(() => (listing ? buildCategoryPath(listing) : []), [listing]);
  const fullLocation = useMemo(() => (listing ? buildFullLocation(listing) : "Локация не указана"), [listing]);
  const detailPairs = useMemo(() => {
    if (listing === null) {
      return [] as Array<[string, string]>;
    }

    const primaryCategory = categoryPath[0] ?? "Категория не указана";
    const secondaryCategory = categoryPath.at(-1) ?? primaryCategory;

    const basePairs = [
      ["Тип объявления", listing.typeLabel],
      ["Категория", primaryCategory],
      ["Подкатегория", secondaryCategory],
      ["Состояние", listing.conditionLabel],
      ["Торг уместен", listing.isNegotiable ? "Да" : "Нет"],
    ] as Array<[string, string]>;

    const attributePairs = listing.attributeValues
      .filter((attribute) => attribute.displayValue)
      .slice(0, 4)
      .map((attribute) => [attribute.name ?? "Параметр", attribute.displayValue ?? "—"] as [string, string]);

    return [...basePairs, ...attributePairs];
  }, [categoryPath, listing]);

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

  const publishedAt = formatDateTime(listing.publishedAt);
  const expiresAt = formatDateTime(listing.expiresAt);
  const createdAt = formatDateTime(listing.publishedAt);
  const updatedAt = formatDateTime(listing.publishedAt);
  const priceLabel = listing.price === null
    ? "Цена не указана"
    : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "₽"}`;
  const primaryCategory = categoryPath[0] ?? "Категория не указана";
  const secondaryCategory = categoryPath.at(-1) ?? primaryCategory;

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_28%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand)_7%,transparent),transparent_24%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_62%,transparent),var(--background))]">
        <Container className="py-8">
          <div className="grid gap-6">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--brand-deep)]"
              href="/account/listings"
            >
              <ArrowLeft size={17} />
              К моим объявлениям
            </Link>

            <section className="rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-4 shadow-[var(--shadow-card)] sm:p-6">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
                <div>
                  <ListingMediaGallery
                    imageUrl={listing.imageUrl}
                    imageUrls={listing.imageUrls}
                    mode="details"
                    title={listing.title}
                  />
                </div>

                <div className="grid gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="font-heading text-[clamp(2rem,3vw,3.3rem)] font-black tracking-[-0.06em] text-[var(--brand-deep)]">
                        {listing.title}
                      </h1>
                      <p className="mt-4 text-[2.25rem] font-black tracking-[-0.05em] text-[var(--brand-deep)]">
                        {priceLabel}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--text-muted)]">
                        <span>ID объявления: {listing.id}</span>
                        <span>Создано: {createdAt}</span>
                      </div>
                    </div>

                    <ListingDetailsActions
                      editHref={`/account/listings/${listing.id}/edit`}
                      isDeleting={isDeleting}
                      isDraft={listing.status === 1}
                      isSubmittingForReview={isSubmittingForReview}
                      onDeleteAction={() => setIsDeleteDialogOpen(true)}
                      onSubmitForReviewAction={handleSubmitForReview}
                    />
                  </div>

                  <div className="grid gap-4 rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5 sm:grid-cols-4">
                    <StatusMetric
                      accent
                      label="Статус"
                      value={listing.statusLabel}
                    />
                    <StatusMetric label="Размещено" value={publishedAt} />
                    <StatusMetric label="Обновлено" value={updatedAt} />
                    <StatusMetric label="Действует до" value={expiresAt} />
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
                  <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Категория</h2>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Smartphone size={22} />
                    </span>
                    <div className="flex items-center gap-3 text-sm font-semibold text-[var(--brand-deep)]">
                      <span>{primaryCategory}</span>
                      <ChevronRight size={16} className="text-[var(--text-muted)]" />
                      <span>{secondaryCategory}</span>
                    </div>
                  </div>
                </aside>

                <aside className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
                  <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Местоположение</h2>
                  <div className="mt-6 flex items-start gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <MapPin size={20} />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-[var(--brand-deep)]">{fullLocation}</p>
                      <button className="mt-2 text-sm font-semibold text-[var(--accent)] transition hover:opacity-80" type="button">
                        Показать на карте
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-5 shadow-[var(--shadow-card)] sm:px-6">
              <div className="flex items-start gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <CircleAlert size={22} />
                </span>
                <div>
                  <p className="text-lg font-black text-[var(--brand-deep)]">Совет</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    Регулярно обновляйте объявление и отвечайте на сообщения, чтобы быстрее продать товар.
                  </p>
                </div>
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

function ListingDetailsActions({
  editHref,
  isDeleting,
  isDraft,
  isSubmittingForReview,
  onDeleteAction,
  onSubmitForReviewAction,
}: {
  editHref: string;
  isDeleting: boolean;
  isDraft: boolean;
  isSubmittingForReview: boolean;
  onDeleteAction: () => void;
  onSubmitForReviewAction: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Открыть меню действий объявления"
          className="grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] transition hover:border-[var(--accent)]"
          type="button"
        >
          <Menu size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-64 rounded-[24px] border-[var(--border-soft)] p-2 shadow-[var(--shadow-card)]">
        <DropdownMenuItem asChild className="rounded-2xl">
          <Link className="flex items-center gap-3" href={editHref}>
            <Pencil size={17} />
            <span>Редактировать</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="rounded-2xl" disabled>
          <CircleDot size={17} />
          <span>Архивировать</span>
        </DropdownMenuItem>

        {isDraft ? (
          <DropdownMenuItem
            className="rounded-2xl"
            disabled={isSubmittingForReview}
            onClick={onSubmitForReviewAction}
          >
            <ChevronRight size={17} />
            <span>{isSubmittingForReview ? "Отправляем..." : "Отправить на проверку"}</span>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="rounded-2xl text-[var(--danger)] focus:text-[var(--danger)]"
          disabled={isDeleting}
          onClick={onDeleteAction}
        >
          <Trash2 size={17} />
          <span>Удалить объявление</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
