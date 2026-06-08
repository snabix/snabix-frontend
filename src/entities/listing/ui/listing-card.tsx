import Link from "next/link";
import type { MouseEvent } from "react";
import { CalendarDays, CheckCircle2, ChevronRight, Eye, Heart, MapPin, Package2, ShieldCheck, Star, XCircle } from "lucide-react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { cn } from "@/src/shared/lib/utils";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Avatar, AvatarFallback } from "@/src/shared/ui/shadcn/avatar";
import { ListingMediaGallery } from "@/src/entities/listing";

const initialTransform = "perspective(900px) rotateX(0deg) rotateY(0deg)";

type ListingCardProps = {
    detailsHref?: string;
    isFavorite?: boolean;
    isSelected?: boolean;
    listing: ListingItem | PublicListingItem;
    onFavoriteToggleAction?: (listingId: string) => void;
    onSelectToggleAction?: (listingId: string) => void;
    showStatus?: boolean;
    viewMode?: "grid" | "list";
};

export function ListingCard({
                                detailsHref,
                                isFavorite,
                                isSelected = false,
                                listing,
                                onFavoriteToggleAction,
                                onSelectToggleAction,
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
    const ratingValue = listing.sellerRating ?? 3;

    const reviewCount = (listing as ListingItem & {
        sellerReviewCount?: number | null;
    }).sellerReviewCount ?? 111;

    const highlightedAttributes = listing.attributeValues
        .filter((attribute) => attribute.name !== null && attribute.displayValue !== null)
        .slice(0, viewMode === "list" ? 3 : 2);

    function handleMouseMove(event: MouseEvent<HTMLElement>) {
        if (viewMode === "list") {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 10;
        const rotateX = (0.5 - y) * 8;

        event.currentTarget.style.transform =
            `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    }

    function handleMouseLeave(event: MouseEvent<HTMLElement>) {
        if (viewMode === "list") {
            event.currentTarget.style.transform = "none";
            return;
        }

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
            onClick={(event) => handleFavoriteClick(event, listing.id, onFavoriteToggleAction)}
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
                viewMode === "list"
                    ? "min-h-[320px] rounded-[26px] md:min-h-[320px] md:w-[340px] md:shrink-0 xl:min-h-[340px] xl:w-[390px]"
                    : "min-h-[270px]",
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

            {onSelectToggleAction ? (
                <label className="pointer-events-auto absolute left-4 top-4 z-30 grid size-11 cursor-pointer place-items-center rounded-full border border-[color-mix(in_srgb,var(--surface)_54%,transparent)] bg-[color-mix(in_srgb,var(--brand-deep)_34%,transparent)] shadow-[var(--shadow-card)]">
          <span className="sr-only">
            {isSelected ? "Снять выбор объявления" : "Выбрать объявление"}
          </span>

                    <Checkbox
                        checked={isSelected}
                        className="border-[color-mix(in_srgb,var(--surface)_82%,transparent)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)]"
                        onCheckedChange={() => onSelectToggleAction(listing.id)}
                    />
                </label>
            ) : null}

            {viewMode === "grid" ? (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[14px] bg-[linear-gradient(135deg,var(--accent),color-mix(in_srgb,var(--accent)_82%,var(--brand)))] px-2.5 py-1.5 text-white shadow-[var(--shadow-card)]">
                    <Package2 size={13} />

                    <span className="text-[0.72rem] font-semibold leading-none text-white">
            {listing.typeLabel}
          </span>
                </div>
            ) : null}
        </div>
    );

    return (
        <article
            className={cn(
                "group relative overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 hover:border-[var(--accent)]",
                viewMode === "grid" && "hover:-translate-y-1",
                isSelected && "border-[var(--accent)] ring-4 ring-[var(--accent-soft)]",
                viewMode === "list"
                    ? "p-4 md:p-5"
                    : "mx-auto grid h-[490px] w-full max-w-[360px] overflow-hidden grid-rows-[270px_minmax(0,1fr)]",
            )}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ transform: viewMode === "grid" ? initialTransform : "none" }}
        >
            <Link
                aria-label={`Открыть объявление ${listing.title}`}
                className="absolute inset-0 z-10"
                href={href}
            />

            {viewMode === "list" ? (
                <div className="pointer-events-none relative z-20 grid gap-4">
                    <div className="grid gap-5 md:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] md:items-stretch">
                        {imageBlock}

                        <div className="grid min-w-0 content-start gap-4">
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

                                    <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] px-4 py-2 text-sm font-bold text-[var(--brand-deep)]">
                                      {listing.isNegotiable ? (
                                        <CheckCircle2 className="text-[var(--accent)]" size={16} />
                                      ) : (
                                        <XCircle className="text-[var(--danger)]" size={16} />
                                      )}
                                      {listing.isNegotiable ? "Торг уместен" : "Без торга"}
                                    </span>
                                </div>

                                {!onFavoriteToggleAction ? (
                                    favoriteButton
                                ) : (
                                    <div className="pointer-events-auto relative z-30 hidden md:block">
                                        {favoriteButton}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="font-heading text-3xl font-black leading-none tracking-[-0.05em] text-[var(--accent)] xl:text-4xl">
                                    {formattedPrice}
                                </p>

                                {listing.isNegotiable ? (
                                    <p className="mt-2 text-sm font-bold text-[var(--text-muted)]">
                                        Возможен торг
                                    </p>
                                ) : null}
                            </div>

                            <div className="min-w-0">
                                <h3 className="line-clamp-2 font-heading text-2xl font-black leading-[1.05] tracking-[-0.045em] text-[var(--brand-deep)] xl:text-3xl">
                                    {listing.title}
                                </h3>

                                <p className="mt-3 line-clamp-2 max-w-3xl text-base font-medium leading-7 text-[var(--text-muted)]">
                                    {listing.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-start justify-end gap-4">
                                {onFavoriteToggleAction ? (
                                    <div className="pointer-events-auto relative z-30 md:hidden">
                                        {favoriteButton}
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {highlightedAttributes.map((attribute) => (
                                    <span
                                        className="rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_40%,white)] px-3.5 py-2 text-xs font-bold text-[var(--brand-deep)]"
                                        key={attribute.attributeDefinitionId}
                                    >
                    <span className="text-[var(--text-muted)]">
                      {attribute.name}
                    </span>{" "}
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

                    <Link
                        className="group/seller pointer-events-auto relative z-20 flex min-w-0 items-center justify-between gap-4 rounded-[22px] border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[linear-gradient(135deg,var(--accent),color-mix(in_srgb,var(--accent)_74%,var(--brand)))] px-4 py-3 text-white shadow-[var(--shadow-card)] transition hover:border-[color-mix(in_srgb,var(--accent)_54%,white)] hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_84%,var(--brand)),var(--brand))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                        href={sellerHref}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="size-12 border border-[var(--border-soft)] shadow-[var(--shadow-card)]">
                                <AvatarFallback className="text-sm font-black">
                                    {sellerInitials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                                <p className="truncate text-lg font-black tracking-[-0.03em] text-white">
                                    {sellerName}
                                </p>

                                <p className="mt-0.5 inline-flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/80">
                                    <Star className="text-white" fill="currentColor" size={15} />

                                    <span className="font-bold text-white">
                    {sellerRating}
                  </span>

                                    <span>рейтинг продавца</span>
                                </p>
                            </div>
                        </div>

                        <ChevronRight
                            className="shrink-0 text-white/80 transition group-hover/seller:translate-x-1 group-hover/seller:text-white"
                            size={28}
                            strokeWidth={1.8}
                        />
                    </Link>
                </div>
            ) : (
                <>
                    {imageBlock}

                    <div className="pointer-events-none relative grid gap-2 overflow-hidden px-4 pb-4 pt-3">
                        <div className="grid min-w-0 content-between gap-2 overflow-hidden">
                            <div className="min-w-0 overflow-hidden">
                                <p className="truncate font-heading text-[1.2rem] font-black leading-none tracking-[-0.03em] text-[var(--accent)]">
                                    {formattedPrice}
                                </p>

                                <h3 className="mt-2 line-clamp-2 overflow-hidden font-heading text-[1rem] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--brand-deep)]">
                                    {listing.title}
                                </h3>

                                <div className="mt-3 h-px bg-[var(--border-soft)]" />

                                <div className="mt-3 grid gap-2 overflow-hidden">
                  <span className="inline-flex min-w-0 items-center gap-2 text-[0.8rem] font-medium text-[var(--text-muted)]">
                    <MapPin size={15} className="shrink-0" />
                    <span className="truncate">{city}</span>
                  </span>

                                    <span className="inline-flex min-w-0 flex-wrap items-center gap-2 text-[0.8rem] font-medium text-[var(--text-muted)]">
                    <StarRow rating={ratingValue} />

                    <span className="font-semibold text-[var(--brand-deep)]">
                      {sellerRating === "Нет рейтинга" ? "3.0" : sellerRating}
                    </span>

                    <span>•</span>

                    <span className="truncate">{reviewCount} отзывов</span>
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

function StarRow({ rating }: { rating: number }) {
    const activeStars = Math.max(0, Math.min(5, Math.round(rating)));

    return (
        <span className="inline-flex shrink-0 items-center gap-1 text-[var(--accent)]">
      {Array.from({ length: 5 }).map((_, index) => (
          <Star
              className={index < activeStars ? "text-[var(--accent)]" : "text-[color-mix(in_srgb,var(--text-muted)_34%,white)]"}
              fill="currentColor"
              key={index}
              size={14}
          />
      ))}
    </span>
    );
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
    onFavoriteToggleAction?: (listingId: string) => void,
): void {
    event.preventDefault();
    event.stopPropagation();
    onFavoriteToggleAction?.(listingId);
}
