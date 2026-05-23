import Link from "next/link";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";

type ListingCardProps = {
  detailsHref?: string;
  isFavorite?: boolean;
  isDeleting?: boolean;
  isSelected?: boolean;
  listing: ListingItem | PublicListingItem;
  onFavoriteToggle?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;
  onSelectToggle?: (listingId: string) => void;
  showStatus?: boolean;
  viewMode?: "grid" | "list";
};

export function ListingCard({
  detailsHref,
  isFavorite,
  isDeleting = false,
  isSelected = false,
  listing,
  onFavoriteToggle,
  onDelete,
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

  const imageBlock = (
    <div
      className={cn(
        "pointer-events-none relative overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_18%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_10%,var(--surface)))]",
        viewMode === "list" ? "min-h-44 md:min-h-full md:w-64 md:shrink-0" : "min-h-40",
      )}
    >
      {listing.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={listing.title}
          className="h-full w-full object-cover"
          src={listing.imageUrl}
        />
      ) : (
        <>
          <div className="absolute -right-8 -top-10 size-28 rounded-full bg-[color-mix(in_srgb,var(--foreground)_18%,transparent)] blur-sm" />
          <div className="absolute bottom-5 left-5 h-16 w-32 rounded-[26px] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)]" />
        </>
      )}

      <button
        aria-label={favorite ? "Удалить объявление из избранного" : "Добавить объявление в избранное"}
        className={cn(
          "pointer-events-auto absolute right-4 top-4 z-30 grid size-11 place-items-center rounded-full border shadow-[var(--shadow-card)] transition-colors",
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
        viewMode === "list" ? "grid md:grid-cols-[auto_minmax(0,1fr)]" : "grid min-h-[360px]",
      )}
    >
      <Link
        aria-label={`Открыть объявление ${listing.title}`}
        className="absolute inset-0 z-10"
        href={href}
      />
      {imageBlock}

      <div className="pointer-events-none relative grid gap-4 p-5">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--brand-deep)]">
              {listing.typeLabel}
            </span>
            {listing.category?.name ? (
              <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {listing.category.name}
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight text-[var(--brand-deep)]">
            {listing.title}
          </h3>

          <p className="mt-2 text-lg font-black text-[var(--brand-deep)]">
            {formattedPrice}
          </p>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
            {listing.description}
          </p>

          <div className="mt-3 grid gap-2 text-sm font-semibold text-[var(--text-muted)]">
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

        {onDelete ? (
          <div className="pointer-events-auto relative z-30 mt-auto flex justify-end">
            <Button
              aria-label={`Удалить объявление ${listing.title}`}
              disabled={isDeleting}
              onClick={() => onDelete(listing.id)}
              size="icon"
              type="button"
              variant="destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
