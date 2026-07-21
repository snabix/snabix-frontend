export const LISTING_STATUS_DRAFT = "draft";
export const LISTING_STATUS_PENDING_REVIEW = "pendingReview";
export const LISTING_STATUS_PUBLISHED = "published";
export const LISTING_STATUS_REJECTED = "rejected";
export const LISTING_STATUS_ARCHIVED = "archived";

export const LISTING_TYPE_PRODUCT = "product";
export const LISTING_TYPE_SERVICE = "service";

export const LISTING_CONDITION_NEW = "new";
export const LISTING_CONDITION_USED = "used";
export const LISTING_CONDITION_NOT_APPLICABLE = "notApplicable";

export type ListingKind =
  | typeof LISTING_TYPE_PRODUCT
  | typeof LISTING_TYPE_SERVICE;

export type ListingStatus =
  | typeof LISTING_STATUS_DRAFT
  | typeof LISTING_STATUS_PENDING_REVIEW
  | typeof LISTING_STATUS_PUBLISHED
  | typeof LISTING_STATUS_REJECTED
  | typeof LISTING_STATUS_ARCHIVED;

export type ListingCondition =
  | typeof LISTING_CONDITION_NEW
  | typeof LISTING_CONDITION_USED
  | typeof LISTING_CONDITION_NOT_APPLICABLE;
