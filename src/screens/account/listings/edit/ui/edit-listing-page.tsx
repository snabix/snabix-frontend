"use client";

import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import { toast } from "sonner";
import type { ListingItem } from "@/src/entities/listing";
import { showListing, updateListing, type UpdateListingPayload } from "@/src/features/listing/api";
import { ListingForm } from "@/src/features/listing/ui/listing-form";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

type EditListingPageProps = {
  listingId: string;
};

export function EditListingPage({ listingId }: EditListingPageProps) {
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        toast.error(extractApiError(error, "Не удалось загрузить объявление."));
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

  if (isLoading) {
    return <SkeletonPanel className="min-h-80" />;
  }

  if (listing === null) {
    return (
      <EmptyState
        description="Проверьте ссылку или вернитесь к списку своих объявлений."
        icon={SearchX}
        title="Объявление не найдено"
      />
    );
  }

  return (
    <ListingForm
      initialListing={listing}
      mode="edit"
      onSubmitAction={(payload) => updateListing(listing.id, payload as UpdateListingPayload)}
    />
  );
}
