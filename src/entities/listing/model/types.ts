import type { CategoryAttributeDefinition } from "@/src/entities/category";

export type ListingAttributeValue = string | number | boolean | string[] | null;

export type ListingMediaItem = {
  id: number;
  url: string;
  fileName: string;
  order: number;
  isMain: boolean;
};

export type ListingLocation = {
  source: "profile" | "custom" | string;
  profileAddressId?: string | null;
  label?: string | null;
  region: {
    id: number;
    name: string;
    fullName?: string | null;
    label: string;
  };
  city: {
    id: number;
    name: string;
    label: string;
    lat?: string | null;
    lon?: string | null;
  } | null;
  addressLine: string | null;
  display: string | null;
  coordinates?: {
    lat: number | string | null;
    lng: number | string | null;
  } | null;
  mapProvider?: string | null;
  mapPlaceId?: string | null;
};

export type ListingItem = {
  id: string;
  userId: string;
  category: {
    id: string | number;
    catalogType: number;
    catalogTypeLabel: string;
    parentId: string | number | null;
    name: string;
    slug: string;
    fullName?: string | null;
    path?: string | null;
    breadcrumbs?: Array<{
      id: string | number;
      name: string;
      slug: string;
    }>;
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
  location?: ListingLocation | null;
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
