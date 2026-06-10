import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
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
  const response = await api.post<ApiDataResponse<unknown>>("/listings", payload);

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ создания объявления не соответствует ожидаемому формату.",
  );
}
