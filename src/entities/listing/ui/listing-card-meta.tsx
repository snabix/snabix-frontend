import { CalendarDays, Eye } from "lucide-react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";
import { ListingCardLocation } from "./listing-card-location";
import type { ListingCardPresentation } from "./listing-card-types";

type ListingCardMetaProps = {
  listing: ListingItem | PublicListingItem;
  presentation: ListingCardPresentation;
};

export function ListingCardMeta({ listing, presentation }: ListingCardMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-[var(--text-muted)]">
      <ListingCardLocation location={presentation.fullLocation} />

      <span className="text-[var(--text-muted)]/60">•</span>

      {presentation.publishedDate ? (
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={18} />
          Опубликовано {presentation.publishedDate}
        </span>
      ) : null}

      <span className="text-[var(--text-muted)]/60">•</span>

      <span className="inline-flex items-center gap-2">
        <Eye size={17} />
        {new Intl.NumberFormat("ru-RU").format(listing.viewsCount)} просмотров
      </span>
    </div>
  );
}
