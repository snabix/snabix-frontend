"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ListingItem } from "@/src/entities/listing/model/types";
import { Button } from "@/src/shared/ui/shadcn/button";

type ListingCardProps = {
  isDeleting?: boolean;
  listing: ListingItem;
  onDelete: (listingId: string) => void;
};

export function ListingCard({
  isDeleting = false,
  listing,
  onDelete,
}: ListingCardProps) {
  const formattedPrice = listing.price === null
    ? "Цена не указана"
    : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "RUB"}`;

  return (
    <article className="group grid min-h-[300px] overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]">
      <div className="relative min-h-32 overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_18%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_10%,var(--surface)))]">
        <div className="absolute -right-8 -top-10 size-28 rounded-full bg-[color-mix(in_srgb,var(--foreground)_18%,transparent)] blur-sm" />
        <div className="absolute bottom-4 left-4 rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
          {listing.statusLabel}
        </div>
      </div>

      <div className="grid gap-4 p-5">
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
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link href={`/account/listings/${listing.id}`}>
              <Eye size={16} />
              Смотреть
            </Link>
          </Button>
          <Button asChild className="flex-1" size="sm" variant="outline">
            <Link href={`/account/listings/${listing.id}/edit`}>
              <Pencil size={16} />
              Править
            </Link>
          </Button>
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
      </div>
    </article>
  );
}
