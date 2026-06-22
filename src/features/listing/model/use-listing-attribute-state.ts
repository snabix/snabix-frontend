import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/src/entities/category";
import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";
import {
  filterVisibleAttributes,
  groupAttributesByName,
  pruneHiddenAttributeValues,
  valuesFromListing,
} from "@/src/features/listing/model/attribute-values";

export function useListingAttributeState(
  categoryId: string | null,
  initialListing?: ListingItem,
) {
  const categoryAttributes = useCategoryStore((state) => state.categoryAttributes);
  const categoryAttributeStatuses = useCategoryStore((state) => state.categoryAttributeStatuses);
  const categoryAttributeErrorMessages = useCategoryStore((state) => state.categoryAttributeErrorMessages);
  const loadCategoryAttributes = useCategoryStore((state) => state.loadCategoryAttributes);
  const [attributeValues, setAttributeValues] = useState<Record<string, ListingAttributeValue>>(
    () => valuesFromListing(initialListing),
  );

  useEffect(() => {
    if (categoryId !== null) {
      void loadCategoryAttributes(categoryId);
    }
  }, [categoryId, loadCategoryAttributes]);

  useEffect(() => {
    if (
      categoryId !== null
      && categoryAttributeStatuses[categoryId] === "error"
      && categoryAttributeErrorMessages[categoryId] !== null
    ) {
      toast.error(categoryAttributeErrorMessages[categoryId]);
    }
  }, [categoryAttributeErrorMessages, categoryAttributeStatuses, categoryId]);

  const attributes = useMemo(
    () => (categoryId !== null ? categoryAttributes[categoryId] ?? [] : []),
    [categoryAttributes, categoryId],
  );
  const visibleAttributes = useMemo(
    () => filterVisibleAttributes(attributes, attributeValues),
    [attributes, attributeValues],
  );
  const groupedAttributes = useMemo(
    () => groupAttributesByName(visibleAttributes),
    [visibleAttributes],
  );
  const isLoadingAttributes = categoryId !== null
    && (
      categoryAttributeStatuses[categoryId] === undefined
      || categoryAttributeStatuses[categoryId] === "loading"
    );

  const handleAttributeChange = (attributeId: number, value: ListingAttributeValue) => {
    setAttributeValues((currentValues) => pruneHiddenAttributeValues(attributes, {
      ...currentValues,
      [String(attributeId)]: value,
    }));
  };

  const handleMultiselectChange = (
    attributeId: number,
    optionValue: string,
    checked: boolean,
  ) => {
    setAttributeValues((currentValues) => {
      const attributeKey = String(attributeId);
      const current = Array.isArray(currentValues[attributeKey])
        ? currentValues[attributeKey] as string[]
        : [];

      return pruneHiddenAttributeValues(attributes, {
        ...currentValues,
        [attributeKey]: checked
          ? Array.from(new Set([...current, optionValue]))
          : current.filter((item) => item !== optionValue),
      });
    });
  };

  return {
    attributeValues,
    groupedAttributes,
    handleAttributeChange,
    handleMultiselectChange,
    isLoadingAttributes,
    resetAttributeValues: () => setAttributeValues({}),
    visibleAttributes,
  };
}
