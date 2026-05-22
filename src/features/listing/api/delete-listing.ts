import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

type DeleteListingPayload = {
  deleted: boolean;
};

export async function deleteListing(listingId: string): Promise<boolean> {
  const response = await api.delete<ApiDataResponse<DeleteListingPayload>>(`/listings/${listingId}`);

  return unwrapApiData(response.data).deleted;
}
