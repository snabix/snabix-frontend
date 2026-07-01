import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ListingItem, ListingMediaItem } from "@/src/entities/listing";
import {
  deleteListingMedia,
  reorderListingMedia,
  setMainListingMedia,
  uploadListingMedia,
} from "@/src/features/listing/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { useMutationThrottle } from "@/src/shared/lib/use-mutation-throttle";

const MEDIA_UPLOAD_ERROR = "Объявление сохранено, но фотографии пока не загрузились. Проверьте соединение и повторите попытку.";

export function useListingMediaState(initialListing?: ListingItem) {
  const router = useRouter();
  const runMutation = useMutationThrottle();
  const [existingMedia, setExistingMedia] = useState<ListingMediaItem[]>(
    () => initialListing?.media ?? [],
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mediaRetryListingId, setMediaRetryListingId] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const syncExistingMedia = (listing: ListingItem) => {
    setExistingMedia(listing.media ?? []);
  };

  const handleDeleteExistingMedia = async (mediaId: number) => {
    if (initialListing === undefined) {
      return;
    }

    await runMutation(`listing:${initialListing.id}:media:${mediaId}:delete`, async () => {
      const previousMedia = existingMedia;
      setExistingMedia((items) => items.filter((item) => item.id !== mediaId));

      try {
        syncExistingMedia(await deleteListingMedia(initialListing.id, mediaId));
        toast.success("Изображение удалено.");
      } catch (error) {
        setExistingMedia(previousMedia);
        toast.error(extractApiError(error, "Не удалось удалить изображение."));
      }
    });
  };

  const handleSetMainExistingMedia = async (mediaId: number) => {
    if (initialListing === undefined) {
      return;
    }

    await runMutation(`listing:${initialListing.id}:media:${mediaId}:main`, async () => {
      const nextMedia = moveMediaToFront(existingMedia, mediaId);
      const previousMedia = existingMedia;
      setExistingMedia(markMainMedia(nextMedia));

      try {
        syncExistingMedia(await setMainListingMedia(initialListing.id, mediaId));
        toast.success("Главное фото обновлено.");
      } catch (error) {
        setExistingMedia(previousMedia);
        toast.error(extractApiError(error, "Не удалось выбрать главное фото."));
      }
    });
  };

  const handleReorderExistingMedia = async (
    mediaId: number,
    direction: "left" | "right",
  ) => {
    if (initialListing === undefined) {
      return;
    }

    await runMutation(`listing:${initialListing.id}:media:reorder`, async () => {
      const previousMedia = existingMedia;
      const nextMedia = reorderMediaLocally(existingMedia, mediaId, direction);

      if (nextMedia === existingMedia) {
        return;
      }

      setExistingMedia(markMainMedia(nextMedia));

      try {
        syncExistingMedia(await reorderListingMedia(
          initialListing.id,
          nextMedia.map((media) => media.id),
        ));
      } catch (error) {
        setExistingMedia(previousMedia);
        toast.error(extractApiError(error, "Не удалось изменить порядок изображений."));
      }
    });
  };

  const uploadPendingMedia = async (listingId: string): Promise<boolean> => {
    if (imageFiles.length === 0) {
      return true;
    }

    const result = await runMutation(`listing:${listingId}:media:upload`, async () => {
      try {
        setIsUploadingMedia(true);
        await uploadListingMedia(listingId, imageFiles);
        setImageFiles([]);
        setMediaRetryListingId(null);
        return true;
      } catch (error) {
        setMediaRetryListingId(listingId);
        toast.error(extractApiError(error, MEDIA_UPLOAD_ERROR));
        return false;
      } finally {
        setIsUploadingMedia(false);
      }
    });

    return result.started ? result.value : false;
  };

  const retryMediaUpload = async () => {
    if (mediaRetryListingId === null || imageFiles.length === 0) {
      return;
    }

    const listingId = mediaRetryListingId;
    const uploaded = await uploadPendingMedia(listingId);

    if (uploaded) {
      toast.success("Фотографии объявления загружены.");
      router.push(`/account/listings/${listingId}`);
      router.refresh();
    }
  };

  return {
    existingMedia,
    handleDeleteExistingMedia,
    handleReorderExistingMedia,
    handleSetMainExistingMedia,
    imageFiles,
    isUploadingMedia,
    mediaRetryListingId,
    retryMediaUpload,
    setImageFiles,
    uploadPendingMedia,
  };
}

function moveMediaToFront(media: ListingMediaItem[], mediaId: number): ListingMediaItem[] {
  const selectedMedia = media.find((item) => item.id === mediaId);

  return selectedMedia === undefined
    ? media
    : [selectedMedia, ...media.filter((item) => item.id !== mediaId)];
}

function reorderMediaLocally(
  media: ListingMediaItem[],
  mediaId: number,
  direction: "left" | "right",
): ListingMediaItem[] {
  const currentIndex = media.findIndex((item) => item.id === mediaId);
  const nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex === -1 || nextIndex < 0 || nextIndex >= media.length) {
    return media;
  }

  const nextMedia = [...media];
  const currentMediaItem = nextMedia[currentIndex];
  const nextMediaItem = nextMedia[nextIndex];

  if (currentMediaItem === undefined || nextMediaItem === undefined) {
    return media;
  }

  nextMedia[currentIndex] = nextMediaItem;
  nextMedia[nextIndex] = currentMediaItem;

  return nextMedia;
}

function markMainMedia(media: ListingMediaItem[]): ListingMediaItem[] {
  return media.map((item, index) => ({
    ...item,
    isMain: index === 0,
    order: index + 1,
  }));
}
