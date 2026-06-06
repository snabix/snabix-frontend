import type { CategoryAttributeDefinition } from "@/src/entities/category";

export type ListingAttributeValue = string | number | boolean | string[] | null;

export type ListingMediaItem = {
  id: number;
  url: string;
  fileName: string;
  order: number;
  isMain: boolean;
};

export type ListingItem = {
  id: string;
  userId: string;
  category: {
    id: number;
    catalogType: number;
    catalogTypeLabel: string;
    parentId: number | null;
    name: string;
    slug: string;
    fullName?: string | null;
    path?: string | null;
  } | null;
  type: number;
  typeLabel: string;
  status: number;
  statusLabel: string;
  condition: number;
  conditionLabel: string;
  title: string;
  slug: string;
  description: string;
  price: number | null;
  currency: string | null;
  isNegotiable: boolean;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  media?: ListingMediaItem[];
  isFavorite?: boolean;
  sellerRating?: number | null;
  city?: string | null;
  region?: string | null;
  street?: string | null;
  house?: string | null;
  addressLine?: string | null;
  fullLocation?: string | null;
  viewsCount: number;
  isFeatured: boolean;
  rejectionReason: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
  attributeValues: Array<{
    attributeDefinitionId: number;
    name: string | null;
    slug: string | null;
    type: CategoryAttributeDefinition["type"] | null;
    typeLabel: string | null;
    value: ListingAttributeValue;
    displayValue: string | null;
  }>;
};

export type PublicListingItem = Omit<
  ListingItem,
  "userId" | "contactName" | "contactPhone" | "contactEmail" | "rejectionReason"
>;
