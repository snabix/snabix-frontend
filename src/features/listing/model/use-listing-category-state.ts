import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/src/entities/category";
import {
  LISTING_CONDITION_NOT_APPLICABLE,
  LISTING_CONDITION_USED,
  LISTING_TYPE_PRODUCT,
  LISTING_TYPE_SERVICE,
  type ListingItem,
} from "@/src/entities/listing";
import { flattenBranchOptions } from "@/src/features/listing/model/category-options";

export function useListingCategoryState(initialListing?: ListingItem) {
  const initialCategoryId =
    initialListing?.category?.id !== undefined && initialListing.category.id !== null
      ? String(initialListing.category.id)
      : null;
  const initialRootId = resolveInitialRootId(initialListing);
  const roots = useCategoryStore((state) => state.roots);
  const rootsStatus = useCategoryStore((state) => state.rootsStatus);
  const rootsErrorMessage = useCategoryStore((state) => state.rootsErrorMessage);
  const branches = useCategoryStore((state) => state.branches);
  const branchStatuses = useCategoryStore((state) => state.branchStatuses);
  const branchErrorMessages = useCategoryStore((state) => state.branchErrorMessages);
  const loadRoots = useCategoryStore((state) => state.loadRoots);
  const loadBranch = useCategoryStore((state) => state.loadBranch);
  const [activeType, setActiveType] = useState(initialListing?.type ?? LISTING_TYPE_PRODUCT);
  const [selectedRootId, setSelectedRootId] = useState<string | null>(initialRootId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);
  const [condition, setCondition] = useState(initialListing?.condition ?? LISTING_CONDITION_USED);

  useEffect(() => {
    void loadRoots();
  }, [loadRoots]);

  useEffect(() => {
    if (rootsStatus === "error" && rootsErrorMessage !== null) {
      toast.error(rootsErrorMessage);
    }
  }, [rootsErrorMessage, rootsStatus]);

  const filteredRoots = useMemo(
    () => roots.filter((root) => root.catalogType === activeType),
    [activeType, roots],
  );

  const effectiveSelectedRootId = useMemo(() => {
    if (selectedRootId !== null && filteredRoots.some((root) => String(root.id) === selectedRootId)) {
      return selectedRootId;
    }

    const inferredRoot = selectedCategoryId === null
      ? undefined
      : filteredRoots.find((root) => containsCategoryId(root, selectedCategoryId));

    if (inferredRoot !== undefined) {
      return String(inferredRoot.id);
    }

    return filteredRoots.length === 1 ? String(filteredRoots[0]?.id ?? "") : null;
  }, [filteredRoots, selectedCategoryId, selectedRootId]);

  useEffect(() => {
    if (effectiveSelectedRootId !== null) {
      void loadBranch(effectiveSelectedRootId);
    }
  }, [effectiveSelectedRootId, loadBranch]);

  useEffect(() => {
    if (
      effectiveSelectedRootId !== null
      && branchStatuses[effectiveSelectedRootId] === "error"
      && branchErrorMessages[effectiveSelectedRootId] !== null
    ) {
      toast.error(branchErrorMessages[effectiveSelectedRootId]);
    }
  }, [branchErrorMessages, branchStatuses, effectiveSelectedRootId]);

  const branch = effectiveSelectedRootId !== null
    ? branches[effectiveSelectedRootId] ?? null
    : null;
  const branchOptions = useMemo(
    () => (branch !== null ? flattenBranchOptions(branch) : []),
    [branch],
  );
  const effectiveSelectedCategoryId = useMemo(() => {
    if (selectedCategoryId !== null && branchOptions.some((option) => String(option.id) === selectedCategoryId)) {
      return selectedCategoryId;
    }

    return branchOptions.length === 1 ? branchOptions[0]?.id ?? null : selectedCategoryId;
  }, [branchOptions, selectedCategoryId]);
  const isLoadingRoots = rootsStatus === "idle" || rootsStatus === "loading";
  const isLoadingBranch = effectiveSelectedRootId !== null
    && (
      branchStatuses[effectiveSelectedRootId] === undefined
      || branchStatuses[effectiveSelectedRootId] === "loading"
    );
  const effectiveCondition = activeType === LISTING_TYPE_SERVICE
    ? LISTING_CONDITION_NOT_APPLICABLE
    : (condition === LISTING_CONDITION_NOT_APPLICABLE ? LISTING_CONDITION_USED : condition);

  const handleTypeChange = (type: number) => {
    setActiveType(type);
    setSelectedRootId(null);
    setSelectedCategoryId(null);
  };

  const handleRootChange = (rootId: string) => {
    setSelectedRootId(rootId);
    setSelectedCategoryId(null);
  };

  return {
    activeType,
    branchOptions,
    condition: effectiveCondition,
    effectiveSelectedCategoryId,
    effectiveSelectedRootId,
    filteredRoots,
    handleCategoryChange: setSelectedCategoryId,
    handleRootChange,
    handleTypeChange,
    isLoadingBranch,
    isLoadingRoots,
    setCondition,
  };
}

function resolveInitialRootId(initialListing?: ListingItem): string | null {
  const category = initialListing?.category;

  if (category === undefined || category === null) {
    return null;
  }

  const firstBreadcrumb = category.breadcrumbs?.[0];

  if (firstBreadcrumb?.id !== undefined && firstBreadcrumb.id !== null) {
    return String(firstBreadcrumb.id);
  }

  if (category.parentId === null) {
    return String(category.id);
  }

  return String(category.parentId);
}

function containsCategoryId(
  root: {
    id: string | number;
    children: Array<{ id: string | number; children: unknown[] }>;
  },
  categoryId: string,
): boolean {
  if (String(root.id) === categoryId) {
    return true;
  }

  return root.children.some((child) => containsCategoryId(
    child as {
      id: string | number;
      children: Array<{ id: string | number; children: unknown[] }>;
    },
    categoryId,
  ));
}
