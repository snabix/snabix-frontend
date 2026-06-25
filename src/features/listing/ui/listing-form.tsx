import type { ListingItem } from "@/src/entities/listing";
import type {
  CreateListingPayload,
  UpdateListingPayload,
} from "@/src/features/listing/api";
import { useListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { ListingEditorForm } from "@/src/features/listing/ui/listing-editor-form";

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

  return <ListingEditorForm mode={mode} state={state} />;
}
