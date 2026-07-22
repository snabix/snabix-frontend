import type { ReactNode } from "react";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing/model/types";

export type ListingCardPresentation = {
  favoriteButton: ReactNode;
  formattedPrice: string;
  fullLocation: string;
  highlightedAttributes: Array<(ListingItem | PublicListingItem)["attributeValues"][number]>;
  publishedDate: string | null;
  ratingValue: number;
  reviewCount: number;
  sellerRating: string;
};
