import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  postData,
} from "@/src/shared/api";

export type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";

export type CreateListingPayload = {
  categoryId: string | number;
  type: number;
  condition: number | null;
  title: string;
  description: string;
  price: number | null;
  currency: string | null;
  isNegotiable: boolean;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  addressMode?: "profile" | "custom" | "none";
  profileAddressId?: string | null;
  regionId?: number | null;
  cityId?: number | null;
  addressLine?: string | null;
  saveAsDraft?: boolean;
  attributeValues: Record<string, ListingAttributeValue>;
};

export async function createListing(payload: CreateListingPayload): Promise<ListingItem> {
  return postData(
    listingItemSchema,
    "/listings",
    payload,
    { errorMessage: "Ответ создания объявления не соответствует ожидаемому формату." },
  );
}
