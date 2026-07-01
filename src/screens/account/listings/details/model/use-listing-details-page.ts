import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ListingItem } from "@/src/entities/listing";
import { archiveListing, deleteListing, showListing, submitListingForReview } from "@/src/features/listing/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { useMutationThrottle } from "@/src/shared/lib/use-mutation-throttle";

export function useListingDetailsPage(listingId: string) {
  const router = useRouter();
  const runMutation = useMutationThrottle();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadListing = async () => {
      try {
        setIsLoading(true);
        const item = await showListing(listingId);

        if (isMounted) {
          setListing(item);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(extractApiError(error, "Не удалось загрузить объявление."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadListing();

    return () => {
      isMounted = false;
    };
  }, [listingId]);

  const handleDeleteConfirm = async () => {
    if (listing === null) {
      return;
    }

    try {
      const result = await runMutation(`listing:${listing.id}:delete`, async () => {
        setIsDeleting(true);
        return deleteListing(listing.id);
      });

      if (!result.started) {
        return;
      }

      setIsDeleteDialogOpen(false);
      toast.success("Объявление удалено.");
      router.push("/account/listings");
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось удалить объявление."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (listing === null) {
      return;
    }

    try {
      const result = await runMutation(`listing:${listing.id}:submit-review`, async () => {
        setIsSubmittingForReview(true);
        return submitListingForReview(listing.id);
      });

      if (!result.started) {
        return;
      }

      setListing(result.value);
      toast.success("Объявление отправлено на проверку.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить объявление на проверку."));
    } finally {
      setIsSubmittingForReview(false);
    }
  };

  const handleArchive = async () => {
    if (listing === null) {
      return;
    }

    try {
      const result = await runMutation(`listing:${listing.id}:archive`, async () => {
        setIsArchiving(true);
        return archiveListing(listing.id);
      });

      if (!result.started) {
        return;
      }

      setListing(result.value);
      toast.success("Объявление перенесено в архив.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось архивировать объявление."));
    } finally {
      setIsArchiving(false);
    }
  };

  return {
    handleArchive,
    handleDeleteConfirm,
    handleSubmitForReview,
    isArchiving,
    isDeleteDialogOpen,
    isDeleting,
    isLoading,
    isSubmittingForReview,
    listing,
    setIsDeleteDialogOpen,
  };
}
