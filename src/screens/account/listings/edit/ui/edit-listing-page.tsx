"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import type { ListingItem } from "@/src/entities/listing";
import { showListing, updateListing } from "@/src/features/listing/api";
import { ListingForm } from "@/src/features/listing/ui/listing-form";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

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
    return (
      <div className="surface-card flex min-h-80 items-center justify-center gap-3 rounded-[30px] text-sm font-semibold text-[var(--text-muted)]">
        <LoaderCircle className="animate-spin" size={18} />
        Загружаем объявление
      </div>
    );
  }

  if (listing === null) {
    return (
      <div className="surface-card rounded-[30px] p-8 text-center text-[var(--brand-deep)]">
        Объявление не найдено или недоступно.
      </div>
    );
  }

  return (
    <ListingForm
      initialListing={listing}
      mode="edit"
      onSubmit={(payload) => updateListing(listing.id, payload)}
    />
  );
}
