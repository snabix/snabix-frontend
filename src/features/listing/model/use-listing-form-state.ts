import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategoryStore } from "@/src/entities/category";
import type { ListingAttributeValue, ListingItem } from "@/src/entities/listing";
import type { CreateListingPayload } from "@/src/features/listing/api";
import {
  buildAttributePayload,
  groupAttributesByName,
  valuesFromListing,
} from "@/src/features/listing/model/attribute-values";
import { flattenBranchOptions } from "@/src/features/listing/model/category-options";
import {
  LISTING_CONDITION_NOT_APPLICABLE,
  LISTING_CONDITION_USED,
  LISTING_TYPE_PRODUCT,
  LISTING_TYPE_SERVICE,
} from "@/src/features/listing/model/listing-form-constants";
import {
  listingFormSchema,
  type ListingFormValues,
} from "@/src/features/listing/model/listing-form-schema";
import { parseIntegerMoney } from "@/src/features/listing/model/listing-money";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

type UseListingFormStateOptions = {
  initialListing?: ListingItem;
  mode: "create" | "edit";
  onSubmit: (payload: CreateListingPayload) => Promise<ListingItem>;
};

export function useListingFormState({
  initialListing,
  mode,
  onSubmit,
}: UseListingFormStateOptions) {
  const router = useRouter();
  const roots = useCategoryStore((state) => state.roots);
  const rootsStatus = useCategoryStore((state) => state.rootsStatus);
  const rootsErrorMessage = useCategoryStore((state) => state.rootsErrorMessage);
  const branches = useCategoryStore((state) => state.branches);
  const branchStatuses = useCategoryStore((state) => state.branchStatuses);
  const branchErrorMessages = useCategoryStore((state) => state.branchErrorMessages);
  const categoryAttributes = useCategoryStore((state) => state.categoryAttributes);
  const categoryAttributeStatuses = useCategoryStore((state) => state.categoryAttributeStatuses);
  const categoryAttributeErrorMessages = useCategoryStore((state) => state.categoryAttributeErrorMessages);
  const loadRoots = useCategoryStore((state) => state.loadRoots);
  const loadBranch = useCategoryStore((state) => state.loadBranch);
  const loadCategoryAttributes = useCategoryStore((state) => state.loadCategoryAttributes);
  const [activeType, setActiveType] = useState(initialListing?.type ?? LISTING_TYPE_PRODUCT);
  const [selectedRootId, setSelectedRootId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialListing?.category?.id ?? null);
  const [attributeValues, setAttributeValues] = useState<Record<string, ListingAttributeValue>>(
    () => valuesFromListing(initialListing),
  );
  const [condition, setCondition] = useState(initialListing?.condition ?? LISTING_CONDITION_USED);
  const [isNegotiable, setIsNegotiable] = useState(initialListing?.isNegotiable ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingFormValues>({
    defaultValues: {
      title: initialListing?.title ?? "",
      description: initialListing?.description ?? "",
      price: initialListing?.price === null || initialListing?.price === undefined
        ? ""
        : String(initialListing.price),
      currency: initialListing?.currency ?? "RUB",
    },
    resolver: zodResolver(listingFormSchema),
  });

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
    if (filteredRoots.length === 0) {
      return null;
    }

    if (selectedRootId !== null && filteredRoots.some((root) => root.id === selectedRootId)) {
      return selectedRootId;
    }

    return filteredRoots[0]?.id ?? null;
  }, [filteredRoots, selectedRootId]);

  useEffect(() => {
    if (effectiveSelectedRootId === null) {
      return;
    }

    void loadBranch(effectiveSelectedRootId);
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
    if (branchOptions.length === 0) {
      return branch?.id ?? null;
    }

    if (selectedCategoryId !== null && branchOptions.some((option) => option.id === selectedCategoryId)) {
      return selectedCategoryId;
    }

    return branchOptions[0]?.id ?? branch?.id ?? null;
  }, [branch, branchOptions, selectedCategoryId]);

  useEffect(() => {
    if (effectiveSelectedCategoryId === null) {
      return;
    }

    void loadCategoryAttributes(effectiveSelectedCategoryId);
  }, [effectiveSelectedCategoryId, loadCategoryAttributes]);

  const attributes = useMemo(
    () => (effectiveSelectedCategoryId !== null
      ? categoryAttributes[effectiveSelectedCategoryId] ?? []
      : []),
    [categoryAttributes, effectiveSelectedCategoryId],
  );

  useEffect(() => {
    if (
      effectiveSelectedCategoryId !== null
      && categoryAttributeStatuses[effectiveSelectedCategoryId] === "error"
      && categoryAttributeErrorMessages[effectiveSelectedCategoryId] !== null
    ) {
      toast.error(categoryAttributeErrorMessages[effectiveSelectedCategoryId]);
    }
  }, [categoryAttributeErrorMessages, categoryAttributeStatuses, effectiveSelectedCategoryId]);

  const isLoadingRoots = rootsStatus === "idle" || rootsStatus === "loading";
  const isLoadingBranch = effectiveSelectedRootId !== null
    && (
      branchStatuses[effectiveSelectedRootId] === undefined
      || branchStatuses[effectiveSelectedRootId] === "loading"
    );
  const isLoadingAttributes = effectiveSelectedCategoryId !== null
    && (
      categoryAttributeStatuses[effectiveSelectedCategoryId] === undefined
      || categoryAttributeStatuses[effectiveSelectedCategoryId] === "loading"
    );
  const groupedAttributes = useMemo(
    () => groupAttributesByName(attributes),
    [attributes],
  );
  const effectiveCondition = activeType === LISTING_TYPE_SERVICE
    ? LISTING_CONDITION_NOT_APPLICABLE
    : (condition === LISTING_CONDITION_NOT_APPLICABLE ? LISTING_CONDITION_USED : condition);
  const isFormBusy = isSubmitting || isLoadingRoots || isLoadingBranch || isLoadingAttributes;

  const handleTypeChange = (type: number) => {
    setActiveType(type);
    setSelectedRootId(null);
    setSelectedCategoryId(null);
    setAttributeValues({});
  };

  const handleRootChange = (rootId: number) => {
    setSelectedRootId(rootId);
    setSelectedCategoryId(null);
    setAttributeValues({});
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setAttributeValues({});
  };

  const handleAttributeChange = (attributeId: number, value: ListingAttributeValue) => {
    setAttributeValues((currentValues) => ({
      ...currentValues,
      [String(attributeId)]: value,
    }));
  };

  const handleMultiselectChange = (attributeId: number, optionValue: string, checked: boolean) => {
    setAttributeValues((currentValues) => {
      const attributeKey = String(attributeId);
      const current = Array.isArray(currentValues[attributeKey])
        ? currentValues[attributeKey] as string[]
        : [];

      return {
        ...currentValues,
        [attributeKey]: checked
          ? Array.from(new Set([...current, optionValue]))
          : current.filter((item) => item !== optionValue),
      };
    });
  };

  const submitForm = (saveAsDraft = false) => {
    void form.handleSubmit((values) => handleValidSubmit(values, saveAsDraft))();
  };

  const handleValidSubmit = async (
    values: ListingFormValues,
    saveAsDraft = false,
  ) => {
    if (effectiveSelectedCategoryId === null) {
      toast.error("Сначала выберите категорию объявления.");
      return;
    }

    const payload: CreateListingPayload = {
      categoryId: effectiveSelectedCategoryId,
      type: activeType,
      condition: effectiveCondition,
      title: values.title.trim(),
      description: values.description.trim(),
      price: parseIntegerMoney(values.price),
      currency: values.currency.trim() === "" ? null : values.currency.trim().toUpperCase(),
      isNegotiable,
      ...(mode === "create" ? { saveAsDraft } : {}),
      attributeValues: buildAttributePayload(attributes, attributeValues),
    };

    try {
      setIsSubmitting(true);
      const savedListing = await onSubmit(payload);

      toast.success(mode === "create"
        ? (saveAsDraft ? "Черновик объявления сохранён." : "Объявление отправлено на проверку.")
        : "Объявление обновлено.");
      router.push(`/account/listings/${savedListing.id}`);
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сохранить объявление."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeType,
    attributeValues,
    branchOptions,
    condition: effectiveCondition,
    effectiveSelectedCategoryId,
    effectiveSelectedRootId,
    filteredRoots,
    form,
    groupedAttributes,
    handleAttributeChange,
    handleCategoryChange,
    handleMultiselectChange,
    handleRootChange,
    handleTypeChange,
    isFormBusy,
    isLoadingAttributes,
    isLoadingBranch,
    isLoadingRoots,
    isNegotiable,
    isSubmitting,
    setCondition,
    setIsNegotiable,
    submitForm,
  };
}
