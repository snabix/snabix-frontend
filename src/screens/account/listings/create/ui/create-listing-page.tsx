"use client";

import { createListing } from "@/src/features/listing/api/create-listing";
import { ListingForm } from "@/src/features/listing/ui/listing-form";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";

export function CreateListingPage() {
  return (
    <AccountLayout>
      <ListingForm mode="create" onSubmit={createListing} />
    </AccountLayout>
  );
}
