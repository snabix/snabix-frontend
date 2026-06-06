import Link from "next/link";
import { Eye, Heart, MapPin, ShieldCheck, Star, UserRound } from "lucide-react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { cn } from "@/src/shared/lib/utils";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { ListingMediaGallery } from "./listing-media-gallery";

type ListingCardProps = {
  detailsHref?: string;
  isFavorite?: boolean;
  isSelected?: boolean;
  listing: ListingItem | PublicListingItem;
  onFavoriteToggle?: (listingId: string) => void;
  onSelectToggle?: (listingId: string) => void;
  showStatus?: boolean;
  viewMode?: "grid" | "list";
};

export function ListingCard({
  detailsHref,
  isFavorite,
  isSelected = false,
  listing,
  onFavoriteToggle,
  onSelectToggle,
  showStatus = true,
  viewMode = "grid",
}: ListingCardProps) {
  const href = detailsHref ?? `/account/listings/${listing.id}`;
  const favorite = isFavorite ?? listing.isFavorite ?? false;
  const formattedPrice = listing.price === null
    ? "Цена не указана"
    : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "RUB"}`;
  const city = listing.city ?? "Город не указан";
  const fullLocation = (
    listing.fullLocation
    ?? [listing.region, listing.city].filter(Boolean).join(", ")
  ) || city;
  const sellerRating = listing.sellerRating === null || listing.sellerRating === undefined
    ? "Нет рейтинга"
    : listing.sellerRating.toFixed(1);
  const sellerName = resolveSellerName(listing);
  const publishedDate = formatListingDate(listing.publishedAt);
  const highlightedAttributes = listing.attributeValues
    .filter((attribute) => attribute.name !== null && attribute.displayValue !== null)
    .slice(0, viewMode === "list" ? 3 : 2);

  const favoriteButton = (
    <button
      aria-label={favorite ? "Удалить объявление из избранного" : "Добавить объявление в избранное"}
      className={cn(
        "pointer-events-auto z-30 grid size-11 place-items-center rounded-full border shadow-[var(--shadow-card)] transition-colors",
        favorite
          ? "border-[color-mix(in_srgb,var(--danger)_36%,transparent)] bg-[color-mix(in_srgb,var(--danger)_14%,var(--surface))] text-[var(--danger)]"
          : "border-[color-mix(in_srgb,var(--surface)_54%,transparent)] bg-[color-mix(in_srgb,var(--brand-deep)_34%,transparent)] text-white hover:bg-[color-mix(in_srgb,var(--brand-deep)_48%,transparent)]",
      )}
      onClick={() => onFavoriteToggle?.(listing.id)}
      type="button"
    >
      <Heart
        fill={favorite ? "currentColor" : "none"}
        size={19}
        strokeWidth={2.4}
      />
    </button>
  );

  const imageBlock = (
    <div
      className={cn(
        "pointer-events-none relative overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_18%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_10%,var(--surface)))]",
        viewMode === "list" ? "min-h-[220px] md:m-4 md:min-h-0 md:w-[238px] md:shrink-0 md:rounded-[22px] xl:w-[260px]" : "min-h-[340px]",
      )}
    >
      <ListingMediaGallery
        imageUrl={listing.imageUrl}
        imageUrls={listing.imageUrls}
        title={listing.title}
      />

      {viewMode === "grid" ? (
        <div className="absolute right-4 top-4 z-30">
          {favoriteButton}
        </div>
      ) : null}

      {onSelectToggle ? (
        <label className="pointer-events-auto absolute left-4 top-4 z-30 grid size-11 cursor-pointer place-items-center rounded-full border border-[color-mix(in_srgb,var(--surface)_54%,transparent)] bg-[color-mix(in_srgb,var(--brand-deep)_34%,transparent)] shadow-[var(--shadow-card)]">
          <span className="sr-only">
            {isSelected ? "Снять выбор объявления" : "Выбрать объявление"}
          </span>
          <Checkbox
            checked={isSelected}
            className="border-[color-mix(in_srgb,var(--surface)_82%,transparent)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)]"
            onCheckedChange={() => onSelectToggle(listing.id)}
          />
        </label>
      ) : null}

      {showStatus ? (
        <div className="absolute bottom-4 left-4 rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
          {listing.statusLabel}
        </div>
      ) : null}
    </div>
  );

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]",
        isSelected && "border-[var(--accent)] ring-4 ring-[var(--accent-soft)]",
        viewMode === "list"
          ? "grid min-h-[252px] md:grid-cols-[auto_minmax(0,1fr)]"
          : "grid h-[490px] grid-rows-[7fr_3fr]",
      )}
    >
      <Link
        aria-label={`Открыть объявление ${listing.title}`}
        className="absolute inset-0 z-10"
        href={href}
      />
      {imageBlock}

      <div
        className={cn(
          "pointer-events-none relative px-3 pb-[5px] pt-3",
          viewMode === "list"
            ? "grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_190px] md:py-5 md:pl-1 md:pr-5 xl:grid-cols-[minmax(0,1fr)_210px]"
            : "grid gap-2",
        )}
      >
        <div className="grid min-w-0 content-between gap-4">
          <div className="min-w-0">
          {viewMode === "list" ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]">
              {listing.category ? (
                <span className="text-[var(--accent)]">
                  {listing.category.name}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
                <ShieldCheck className="text-[var(--accent)]" size={13} />
                {listing.conditionLabel}
              </span>
              {listing.isFeatured ? (
                <span className="rounded-full bg-[var(--brand-deep)] px-2.5 py-0.5 text-[var(--background)]">
                  выделено
                </span>
              ) : null}
            </div>
          ) : null}

            <h3 className={cn(
              "line-clamp-2 font-black leading-tight text-[var(--brand-deep)]",
              viewMode === "list" ? "font-heading text-xl tracking-[-0.02em] xl:text-2xl" : "text-base",
            )}>
              {listing.title}
            </h3>

          {viewMode === "list" ? (
            <p className="mt-2 line-clamp-2 max-w-3xl text-sm font-semibold leading-6 text-[var(--text-muted)]">
              {listing.description}
            </p>
          ) : null}

          {viewMode === "grid" ? (
            <p className="mt-1.5 text-base font-black text-[var(--brand-deep)]">
              {formattedPrice}
            </p>
          ) : null}

          <div className={cn(
            "mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[var(--text-muted)]",
            viewMode === "list" && "mt-3",
          )}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} />
              {viewMode === "list" ? fullLocation : city}
            </span>
            {viewMode === "grid" ? (
              <span className="inline-flex items-center gap-1.5">
                <Star className="text-[var(--accent)]" fill="currentColor" size={16} />
                {sellerRating}
              </span>
            ) : null}
            {viewMode === "list" ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={15} />
                  {new Intl.NumberFormat("ru-RU").format(listing.viewsCount)} просмотров
                </span>
                {publishedDate ? <span>{publishedDate}</span> : null}
              </>
            ) : null}
          </div>
          </div>

          {viewMode === "list" ? (
            <div className="flex flex-wrap items-center gap-2">
              {highlightedAttributes.length > 0 ? (
                <>
                {highlightedAttributes.map((attribute) => (
                  <span
                    className="rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_40%,transparent)] px-3 py-1.5 text-xs font-bold text-[var(--brand-deep)]"
                    key={attribute.attributeDefinitionId}
                  >
                    <span className="text-[var(--text-muted)]">{attribute.name}</span>
                    {" "}
                    {attribute.displayValue}
                  </span>
                ))}
                </>
              ) : null}
              <span className="rounded-full border border-transparent px-1 text-xs font-bold text-[var(--text-muted)]">
                {listing.typeLabel}
              </span>
            </div>
          ) : null}
        </div>

        {viewMode === "list" ? (
          <aside className="pointer-events-none grid content-between gap-4 border-t border-[var(--border-soft)] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <div className="grid justify-items-start gap-2 md:justify-items-end">
              <div className="flex w-full items-start justify-between gap-3 md:justify-end">
                <p className="font-heading text-2xl font-black leading-none tracking-[-0.05em] text-[var(--brand-deep)] md:text-right xl:text-3xl">
                {formattedPrice}
              </p>
                {favoriteButton}
              </div>
              {listing.isNegotiable ? (
                <p className="text-xs font-bold text-[var(--text-muted)]">
                  Возможен торг
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-3 md:justify-end">
              <div className="grid size-10 place-items-center rounded-full bg-[var(--active-button-bg)] text-[var(--active-button-text)]">
                  <UserRound size={18} />
                </div>
              <div className="min-w-0 md:text-right">
                <p className="truncate text-sm font-black text-[var(--brand-deep)]">
                    {sellerName}
                  </p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--text-muted)]">
                    <Star className="text-[var(--accent)]" fill="currentColor" size={14} />
                    {sellerRating} по отзывам
                  </p>
                </div>
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  );
}

function resolveSellerName(listing: ListingItem | PublicListingItem): string {
  const optionalSeller = listing as ListingItem & {
    sellerName?: string | null;
  };

  return optionalSeller.contactName
    ?? optionalSeller.sellerName
    ?? "Продавец SNABIX";
}

function formatListingDate(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}
