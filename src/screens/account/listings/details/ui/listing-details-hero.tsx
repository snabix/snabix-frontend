import { MapPin } from "lucide-react";
import { ListingMediaGallery, type ListingItem } from "@/src/entities/listing";
import { ListingManagementMenu } from "@/src/features/listing/ui/listing-management-menu";

type ListingDetailsHeroProps = {
  fullLocation: string;
  isArchiving: boolean;
  isDeleting: boolean;
  isSubmittingForReview: boolean;
  listing: ListingItem;
  onArchiveAction: () => void;
  onDeleteAction: () => void;
  onSubmitForReviewAction: () => void;
  priceLabel: string;
};

export function ListingDetailsHero({
  fullLocation,
  isArchiving,
  isDeleting,
  isSubmittingForReview,
  listing,
  onArchiveAction,
  onDeleteAction,
  onSubmitForReviewAction,
  priceLabel,
}: ListingDetailsHeroProps) {
  return (
    <section className="rounded-[34px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-4 shadow-[var(--shadow-card)] sm:p-6">
      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <ListingMediaGallery
          imageUrl={listing.imageUrl}
          imageUrls={listing.imageUrls}
          mode="details"
          title={listing.title}
        />

        <div className="grid gap-5">
          <div className="relative">
            <div className="absolute right-0 top-0 z-30">
              <ListingManagementMenu
                editHref={`/account/listings/${listing.id}/edit`}
                isArchiving={isArchiving}
                isDeleting={isDeleting}
                isSubmittingForReview={isSubmittingForReview}
                listing={listing}
                onArchiveAction={onArchiveAction}
                onDeleteAction={onDeleteAction}
                onSubmitForReviewAction={onSubmitForReviewAction}
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
  );
}
