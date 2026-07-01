import type { ListingItem } from "@/src/entities/listing";

export const LISTING_STATUS_DRAFT = 1;
export const LISTING_STATUS_ARCHIVED = 5;

export type ListingOwnerActionKey = "archive" | "delete" | "edit" | "submitForReview";

export type ListingOwnerActionsPolicy = Record<
  ListingOwnerActionKey,
  {
    isDisabled: boolean;
    isVisible: boolean;
  }
>;

type BuildListingOwnerActionsPolicyOptions = {
  isArchiving?: boolean;
  isDeleting?: boolean;
  isSubmittingForReview?: boolean;
  listing: Pick<ListingItem, "status">;
};

export function buildListingOwnerActionsPolicy({
  isArchiving = false,
  isDeleting = false,
  isSubmittingForReview = false,
  listing,
}: BuildListingOwnerActionsPolicyOptions): ListingOwnerActionsPolicy {
  const isArchived = listing.status === LISTING_STATUS_ARCHIVED;
  const isDraft = listing.status === LISTING_STATUS_DRAFT;

  return {
    archive: {
      isDisabled: isArchived || isArchiving,
      isVisible: true,
    },
    delete: {
      isDisabled: isDeleting,
      isVisible: true,
    },
    edit: {
      isDisabled: false,
      isVisible: true,
    },
    submitForReview: {
      isDisabled: isSubmittingForReview,
      isVisible: isDraft,
    },
  };
}
