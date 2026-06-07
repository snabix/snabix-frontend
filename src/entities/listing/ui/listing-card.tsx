import Link from "next/link";
import type { MouseEvent } from "react";
import { CalendarDays, ChevronRight, Eye, Heart, MapPin, Package2, ShieldCheck, Star } from "lucide-react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { cn } from "@/src/shared/lib/utils";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Avatar, AvatarFallback } from "@/src/shared/ui/shadcn/avatar";
import { ListingMediaGallery } from "./listing-media-gallery";

const initialTransform = "perspective(900px) rotateX(0deg) rotateY(0deg)";

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
  const sellerInitials = resolveSellerInitials(sellerName);
  const sellerHref = resolveSellerHref(listing, sellerName);
  const highlightedAttributes = listing.attributeValues
    .filter((attribute) => attribute.name !== null && attribute.displayValue !== null)
    .slice(0, viewMode === "list" ? 3 : 2);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 8;

    event.currentTarget.style.transform =
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  }

  function handleMouseLeave(event: MouseEvent<HTMLElement>) {
    event.currentTarget.style.transform = initialTransform;
  }

  const favoriteButton = (
    <button
      aria-label={favorite ? "Удалить объявление из избранного" : "Добавить объявление в избранное"}
      className={cn(
        "pointer-events-auto relative z-30 grid size-11 place-items-center rounded-full border shadow-[var(--shadow-card)] transition-colors",
        favorite
          ? "border-[color-mix(in_srgb,var(--danger)_24%,var(--border-soft))] bg-[color-mix(in_srgb,var(--danger)_10%,var(--surface))] text-[var(--danger)]"
          : "border-[color-mix(in_srgb,var(--surface)_54%,transparent)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--surface)_100%,transparent)]",
      )}
      onClick={(event) => handleFavoriteClick(event, listing.id, onFavoriteToggle)}
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
        viewMode === "list" ? "min-h-[260px] rounded-[26px] md:min-h-0 md:w-[320px] md:shrink-0 xl:w-[360px]" : "min-h-[340px]",
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
        <div className={cn(
          "absolute px-3 py-1 text-xs font-black uppercase tracking-[0.12em]",
          viewMode === "list"
            ? "right-4 top-4 rounded-2xl bg-[linear-gradient(135deg,#67d86f,#3ec95b)] text-white shadow-[var(--shadow-card)]"
            : "bottom-4 left-4 rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-[var(--brand-deep)]",
        )}>
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
          ? "p-5 md:p-6"
          : "grid h-[490px] grid-rows-[7fr_3fr]",
      )}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ transform: initialTransform }}
    >
      <Link
        aria-label={`Открыть объявление ${listing.title}`}
        className="absolute inset-0 z-10"
        href={href}
      />
      {viewMode === "list" ? (
        <div className="relative z-20 grid gap-6">
          <div className="grid gap-5 md:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] md:items-stretch">
            {imageBlock}

            <div className="grid min-w-0 gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] px-4 py-2 text-sm font-bold text-[var(--brand-deep)]">
                    <Package2 size={16} />
                    {listing.typeLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand)_20%,var(--border-soft))] bg-[color-mix(in_srgb,var(--brand)_14%,var(--surface))] px-4 py-2 text-sm font-bold text-[var(--brand-deep)]">
                    <ShieldCheck size={16} />
                    {listing.conditionLabel}
                  </span>
                  {listing.category ? (
                    <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-2 text-sm font-bold text-[var(--text-muted)]">
                      {listing.category.name}
                    </span>
                  ) : null}
                </div>

                {!onFavoriteToggle ? favoriteButton : <div className="pointer-events-auto relative z-30 hidden md:block">{favoriteButton}</div>}
              </div>

              <div className="min-w-0">
                <h3 className="line-clamp-2 font-heading text-3xl font-black leading-[1.05] tracking-[-0.045em] text-[var(--brand-deep)] xl:text-4xl">
                  {listing.title}
                </h3>

                <p className="mt-4 line-clamp-2 max-w-3xl text-lg font-medium leading-8 text-[var(--text-muted)]">
                  {listing.description}
                </p>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-3xl font-black leading-none tracking-[-0.05em] text-[var(--brand-deep)] xl:text-4xl">
                    {formattedPrice}
                  </p>
                  {listing.isNegotiable ? (
                    <p className="mt-2 text-sm font-bold text-[var(--text-muted)]">
                      Возможен торг
                    </p>
                  ) : null}
                </div>

                {onFavoriteToggle ? <div className="pointer-events-auto relative z-30 md:hidden">{favoriteButton}</div> : null}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {highlightedAttributes.map((attribute) => (
                  <span
                    className="rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_40%,white)] px-3.5 py-2 text-xs font-bold text-[var(--brand-deep)]"
                    key={attribute.attributeDefinitionId}
                  >
                    <span className="text-[var(--text-muted)]">{attribute.name}</span>
                    {" "}
                    {attribute.displayValue}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={18} />
                  {fullLocation}
                </span>
                <span className="text-[var(--text-muted)]/60">•</span>
                {publishedDate ? (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={18} />
                    Опубликовано {publishedDate}
                  </span>
                ) : null}
                <span className="text-[var(--text-muted)]/60">•</span>
                <span className="inline-flex items-center gap-2">
                  <Eye size={17} />
                  {new Intl.NumberFormat("ru-RU").format(listing.viewsCount)} просмотров
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-5">
            <Link
              className="pointer-events-auto relative z-20 flex min-w-0 flex-1 items-center gap-4 rounded-[24px] transition hover:bg-[color-mix(in_srgb,var(--background)_72%,white)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              href={sellerHref}
              onClick={(event) => event.stopPropagation()}
            >
              <Avatar className="size-16 border border-[var(--border-soft)] shadow-[var(--shadow-card)]">
                <AvatarFallback className="text-base font-black">
                  {sellerInitials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-2xl font-black tracking-[-0.03em] text-[var(--brand-deep)]">
                  {sellerName}
                </p>
                <p className="mt-1 inline-flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                  <Star className="text-[#f6c343]" fill="currentColor" size={18} />
                  <span className="font-bold text-[var(--brand-deep)]">{sellerRating}</span>
                  <span>рейтинг продавца</span>
                </p>
              </div>
            </Link>

            <div className="pointer-events-none hidden shrink-0 text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-1 md:block">
              <ChevronRight size={34} strokeWidth={1.6} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {imageBlock}

          <div className="pointer-events-none relative grid gap-2 px-3 pb-[5px] pt-3">
            <div className="grid min-w-0 content-between gap-4">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-base font-black leading-tight text-[var(--brand-deep)]">
                  {listing.title}
                </h3>

                <p className="mt-1.5 text-base font-black text-[var(--brand-deep)]">
                  {formattedPrice}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} />
                    {city}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="text-[var(--accent)]" fill="currentColor" size={16} />
                    {sellerRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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

function resolveSellerInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "SN";
}

function resolveSellerHref(listing: ListingItem | PublicListingItem, sellerName: string): string {
  const ownListing = listing as ListingItem;

  if (typeof ownListing.userId === "string" && ownListing.userId.length > 0) {
    return `/sellers/${ownListing.userId}`;
  }

  return `/sellers/${slugifySellerName(sellerName)}`;
}

function slugifySellerName(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "seller";
}

function handleFavoriteClick(
  event: MouseEvent<HTMLButtonElement>,
  listingId: string,
  onFavoriteToggle?: (listingId: string) => void,
): void {
  event.preventDefault();
  event.stopPropagation();
  onFavoriteToggle?.(listingId);
}
