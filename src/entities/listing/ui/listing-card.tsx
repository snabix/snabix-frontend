import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
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

  const favoriteButton = (
    <button
      aria-label={favorite ? "Удалить объявление из избранного" : "Добавить объявление в избранное"}
      className={cn(
        "pointer-events-auto z-30 grid size-11 place-items-center rounded-full border shadow-[var(--shadow-card)] transition-colors",
        favorite
          ? "border-[color-mix(in_srgb,#ef4444_36%,transparent)] bg-[color-mix(in_srgb,#ef4444_14%,var(--surface))] text-[#ef4444]"
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
        viewMode === "list" ? "min-h-[300px] md:min-h-full md:w-[420px] md:shrink-0" : "min-h-[340px]",
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
        viewMode === "list" ? "grid min-h-[300px] md:grid-cols-[auto_minmax(0,1fr)]" : "grid h-[490px] grid-rows-[7fr_3fr]",
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
            ? "grid content-between gap-6 p-5 md:grid-cols-[minmax(0,1fr)_auto]"
            : "grid gap-2",
        )}
      >
        <div className="min-w-0">
          {viewMode === "list" ? (
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Детали товара
            </p>
          ) : null}

          <h3 className="line-clamp-2 text-base font-black leading-tight text-[var(--brand-deep)]">
            {listing.title}
          </h3>

          {viewMode === "grid" ? (
            <p className="mt-1.5 text-base font-black text-[var(--brand-deep)]">
              {formattedPrice}
            </p>
          ) : null}

          <div className="mt-2 grid gap-1 text-xs font-semibold text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} />
              {viewMode === "list" ? fullLocation : city}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="text-[var(--accent)]" fill="currentColor" size={16} />
              {sellerRating}
            </span>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="pointer-events-none flex items-start justify-between gap-3 md:min-w-48 md:justify-end">
            <p className="rounded-2xl bg-[color-mix(in_srgb,var(--accent-soft)_74%,transparent)] px-4 py-2 text-base font-black text-[var(--brand-deep)]">
              {formattedPrice}
            </p>
            {favoriteButton}
          </div>
        ) : null}
      </div>
    </article>
  );
}
