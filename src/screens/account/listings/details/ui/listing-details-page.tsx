"use client";

import { SearchX } from "lucide-react";
import { DeleteListingDialog } from "@/src/features/listing/ui/delete-listing-dialog";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Container } from "@/src/shared/ui/container";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";
import {
  buildCategoryBreadcrumbs,
  buildFullLocation,
  buildListingDetailPairs,
  formatDateTime,
  formatListingPrice,
} from "../lib/listing-details-formatters";
import { useListingDetailsPage } from "../model/use-listing-details-page";
import { ListingDetailsBreadcrumbs } from "./listing-details-breadcrumbs";
import { ListingDetailsDescription } from "./listing-details-description";
import { ListingDetailsHero } from "./listing-details-hero";
import { ListingDetailsStatusCard } from "./listing-details-status-card";

type ListingDetailsPageProps = {
  listingId: string;
};

export function ListingDetailsPage({ listingId }: ListingDetailsPageProps) {
  const {
    handleArchive,
    handleDeleteConfirm,
    handleSubmitForReview,
    isArchiving,
    isDeleteDialogOpen,
    isDeleting,
    isLoading,
    isSubmittingForReview,
    listing,
    setIsDeleteDialogOpen,
  } = useListingDetailsPage(listingId);

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

  const categoryBreadcrumbs = buildCategoryBreadcrumbs(listing);
  const detailPairs = buildListingDetailPairs(listing);
  const expiresAt = formatDateTime(listing.expiresAt);
  const fullLocation = buildFullLocation(listing);
  const priceLabel = formatListingPrice(listing);
  const publishedAt = formatDateTime(listing.publishedAt);

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_28%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand)_7%,transparent),transparent_24%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_62%,transparent),var(--background))]">
        <Container className="py-8">
          <div className="grid gap-6">
            <ListingDetailsBreadcrumbs categoryBreadcrumbs={categoryBreadcrumbs} />

            <ListingDetailsHero
              fullLocation={fullLocation}
              isArchiving={isArchiving}
              isDeleting={isDeleting}
              isSubmittingForReview={isSubmittingForReview}
              listing={listing}
              onArchiveAction={handleArchive}
              onDeleteAction={() => setIsDeleteDialogOpen(true)}
              onSubmitForReviewAction={handleSubmitForReview}
              priceLabel={priceLabel}
            />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
              <ListingDetailsDescription description={listing.description} detailPairs={detailPairs} />

              <div className="grid gap-6">
                <ListingDetailsStatusCard
                  expiresAt={expiresAt}
                  publishedAt={publishedAt}
                  statusLabel={listing.statusLabel}
                />
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
