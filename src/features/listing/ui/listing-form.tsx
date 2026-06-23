import type { ListingItem } from "@/src/entities/listing";
import type {
  CreateListingPayload,
  UpdateListingPayload,
} from "@/src/features/listing/api";
import { useListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { CreateListingForm } from "@/src/features/listing/ui/create-listing-form";
import { EditListingForm } from "@/src/features/listing/ui/edit-listing-form";

type ListingFormProps = {
  initialListing?: ListingItem;
  mode: "create" | "edit";
  onSubmitAction: (
    payload: CreateListingPayload | UpdateListingPayload,
  ) => Promise<ListingItem>;
};

export function ListingForm({
  initialListing,
  mode,
  onSubmitAction,
}: ListingFormProps) {
  const state = useListingFormState({
    initialListing,
    mode,
    onSubmit: onSubmitAction,
  });

  return mode === "create"
    ? <CreateListingForm state={state} />
    : <EditListingForm state={state} />;
}
