import { api } from "@/src/shared/api";
import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";

export type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";

export type CreateListingPayload = {
  categoryId: number;
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
  saveAsDraft?: boolean;
  attributeValues: Record<string, ListingAttributeValue>;
};

type ListingResponse = {
  data: ListingItem;
};

export async function createListing(payload: CreateListingPayload): Promise<ListingItem> {
  const response = await api.post<ListingResponse>("/listings", payload);

  return response.data.data;
}
