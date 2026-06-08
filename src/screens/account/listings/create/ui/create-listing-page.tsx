"use client";

import { createListing } from "@/src/features/listing/api";
import { ListingForm } from "@/src/features/listing/ui/listing-form";

export function CreateListingPage() {
  return <ListingForm mode="create" onSubmitAction={createListing} />;
}
