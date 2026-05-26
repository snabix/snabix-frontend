import type { ListingItem } from "@/src/entities/listing";
import {
  api,
  listingItemSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function uploadListingMedia(
  listingId: string,
  images: File[],
): Promise<ListingItem> {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images[]", image);
  });

  const response = await api.post<ApiDataResponse<unknown>>(
    `/listings/${listingId}/media`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return parseApiContract(
    listingItemSchema,
    unwrapApiData(response.data),
    "Ответ загрузки изображений объявления не соответствует ожидаемому формату.",
  );
}
