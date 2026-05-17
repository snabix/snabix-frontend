import { api } from "@/src/shared/api";

type DeleteListingResponse = {
  data: {
    deleted: boolean;
  };
};

export async function deleteListing(listingId: string): Promise<boolean> {
  const response = await api.delete<DeleteListingResponse>(`/listings/${listingId}`);

  return response.data.data.deleted;
}
