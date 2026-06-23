import type { ListingItem } from "@/src/entities/listing";
import type {
  CreateListingPayload,
  UpdateListingPayload,
} from "@/src/features/listing/api";
import {
  useListingAddressState,
  type ListingAddressMode,
} from "@/src/features/listing/model/use-listing-address-state";
import { useListingAttributeState } from "@/src/features/listing/model/use-listing-attribute-state";
import { useListingCategoryState } from "@/src/features/listing/model/use-listing-category-state";
import { useListingMediaState } from "@/src/features/listing/model/use-listing-media-state";
import { useListingSubmit } from "@/src/features/listing/model/use-listing-submit";

type UseListingFormStateOptions = {
  initialListing?: ListingItem;
  mode: "create" | "edit";
  onSubmit: (
    payload: CreateListingPayload | UpdateListingPayload,
  ) => Promise<ListingItem>;
};

export type { ListingAddressMode };

export function useListingFormState({
  initialListing,
  mode,
  onSubmit,
}: UseListingFormStateOptions) {
  const categoryState = useListingCategoryState(initialListing);
  const attributeState = useListingAttributeState(
    categoryState.effectiveSelectedCategoryId,
    initialListing,
  );
  const addressState = useListingAddressState({ initialListing, mode });
  const mediaState = useListingMediaState(initialListing);
  const submitState = useListingSubmit({
    addressState,
    attributeState,
    categoryState,
    initialListing,
    mediaState,
    mode,
    onSubmit,
  });

  const handleTypeChange = (type: number) => {
    categoryState.handleTypeChange(type);
    attributeState.resetAttributeValues();
  };

  const handleRootChange = (rootId: string) => {
    categoryState.handleRootChange(rootId);
    attributeState.resetAttributeValues();
  };

  const handleCategoryChange = (categoryId: string) => {
    categoryState.handleCategoryChange(categoryId);
    attributeState.resetAttributeValues();
  };

  const isFormBusy = submitState.isSubmitting
    || mediaState.isUploadingMedia
    || categoryState.isLoadingRoots
    || categoryState.isLoadingBranch
    || attributeState.isLoadingAttributes;

  return {
    ...categoryState,
    ...attributeState,
    ...addressState,
    ...mediaState,
    ...submitState,
    handleCategoryChange,
    handleRootChange,
    handleTypeChange,
    isFormBusy,
  };
}

export type ListingFormState = ReturnType<typeof useListingFormState>;
