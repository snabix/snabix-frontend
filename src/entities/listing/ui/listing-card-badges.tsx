import { CheckCircle2, Package2, ShieldCheck, XCircle } from "lucide-react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";

type ListingCardBadgesProps = {
  listing: ListingItem | PublicListingItem;
};

export function ListingCardBadges({ listing }: ListingCardBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-soft))] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] px-4 py-2 text-sm font-bold text-[var(--brand-deep)]">
        <Package2 size={16} />
        {listing.listingKindLabel}
      </span>

      <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand)_20%,var(--border-soft))] bg-[color-mix(in_srgb,var(--brand)_14%,var(--surface))] px-4 py-2 text-sm font-bold text-[var(--brand-deep)]">
        <ShieldCheck size={16} />
        {listing.itemConditionLabel}
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
  );
}
