import type { ListingItem } from "@/src/entities/listing";
import {
  listingItemSchema,
  postData,
} from "@/src/shared/api";

export async function uploadListingMedia(
  listingId: string,
  images: File[],
): Promise<ListingItem> {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images[]", image);
  });

  return postData(
    listingItemSchema,
    `/listings/${listingId}/media`,
    formData,
    {
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      errorMessage: "Ответ загрузки изображений объявления не соответствует ожидаемому формату.",
    },
  );
}
