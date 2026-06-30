import type { useListingAttributeState } from "@/src/features/listing/model/use-listing-attribute-state";
import type { useListingCategoryState } from "@/src/features/listing/model/use-listing-category-state";
import type { useListingMediaState } from "@/src/features/listing/model/use-listing-media-state";
import type { useListingSubmit } from "@/src/features/listing/model/use-listing-submit";

type UseListingFormCoordinatorOptions = {
  attributeState: Pick<
    ReturnType<typeof useListingAttributeState>,
    "isLoadingAttributes" | "resetAttributeValues"
  >;
  categoryState: Pick<
    ReturnType<typeof useListingCategoryState>,
    | "handleCategoryChange"
    | "handleRootChange"
    | "handleTypeChange"
    | "isLoadingBranch"
    | "isLoadingRoots"
  >;
  mediaState: Pick<ReturnType<typeof useListingMediaState>, "isUploadingMedia">;
  submitState: Pick<ReturnType<typeof useListingSubmit>, "isSubmitting">;
};

export function useListingFormCoordinator({
  attributeState,
  categoryState,
  mediaState,
  submitState,
}: UseListingFormCoordinatorOptions) {
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
    handleCategoryChange,
    handleRootChange,
    handleTypeChange,
    isFormBusy,
  };
}
