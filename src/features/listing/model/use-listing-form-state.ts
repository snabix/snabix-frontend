import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategoryStore } from "@/src/entities/category";
import { listCities, listRegions, type LocationCity, type LocationRegion } from "@/src/entities/location";
import type { ListingAttributeValue, ListingItem, ListingMediaItem } from "@/src/entities/listing";
import { useUserStore } from "@/src/entities/user";
import {
  deleteListingMedia,
  reorderListingMedia,
  setMainListingMedia,
  uploadListingMedia,
  type CreateListingPayload,
  type UpdateListingPayload,
} from "@/src/features/listing/api";
import {
  buildAttributePayload,
  filterVisibleAttributes,
  groupAttributesByName,
  pruneHiddenAttributeValues,
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
  onSubmit: (payload: CreateListingPayload | UpdateListingPayload) => Promise<ListingItem>;
};

export type ListingAddressMode = "none" | "profile" | "custom";

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
  const user = useUserStore((state) => state.user);
  const [activeType, setActiveType] = useState(initialListing?.type ?? LISTING_TYPE_PRODUCT);
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialListing?.category?.id !== undefined && initialListing.category.id !== null
      ? String(initialListing.category.id)
      : null,
  );
  const [attributeValues, setAttributeValues] = useState<Record<string, ListingAttributeValue>>(
    () => valuesFromListing(initialListing),
  );
  const [condition, setCondition] = useState(initialListing?.condition ?? LISTING_CONDITION_USED);
  const [existingMedia, setExistingMedia] = useState<ListingMediaItem[]>(() => initialListing?.media ?? []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isNegotiable, setIsNegotiable] = useState(initialListing?.isNegotiable ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaRetryListingId, setMediaRetryListingId] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const primaryAddressId = user?.addresses.find((address) => address.isPrimary)?.id ?? null;
  const initialLocation = initialListing?.location ?? null;
  const [addressMode, setAddressMode] = useState<ListingAddressMode>(() => {
    if (initialLocation?.source === "profile" && initialLocation.profileAddressId) {
      return "profile";
    }

    if (initialLocation !== null) {
      return "custom";
    }

    return primaryAddressId !== null ? "profile" : "none";
  });
  const [profileAddressId, setProfileAddressId] = useState<string | null>(
    initialLocation?.profileAddressId ?? primaryAddressId,
  );
  const [regions, setRegions] = useState<LocationRegion[]>([]);
  const [cities, setCities] = useState<LocationCity[]>([]);
  const [regionId, setRegionId] = useState<number | null>(initialLocation?.region.id ?? null);
  const [cityId, setCityId] = useState<number | null>(initialLocation?.city?.id ?? null);
  const [addressLine, setAddressLine] = useState(initialLocation?.addressLine ?? "");
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

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
    if (mode !== "create" || profileAddressId !== null || primaryAddressId === null) {
      return;
    }

    setAddressMode("profile");
    setProfileAddressId(primaryAddressId);
  }, [mode, primaryAddressId, profileAddressId]);

  useEffect(() => {
    if (addressMode !== "custom" || regions.length > 0 || isLoadingRegions) {
      return;
    }

    const load = async () => {
      try {
        setIsLoadingRegions(true);
        setRegions(await listRegions());
      } catch (error) {
        toast.error(extractApiError(error, "Не удалось загрузить регионы."));
      } finally {
        setIsLoadingRegions(false);
      }
    };

    void load();
  }, [addressMode, isLoadingRegions, regions.length]);

  useEffect(() => {
    if (addressMode !== "custom" || regionId === null) {
      setCities([]);
      return;
    }

    const load = async () => {
      try {
        setIsLoadingCities(true);
        setCities(await listCities({ regionId }));
      } catch (error) {
        toast.error(extractApiError(error, "Не удалось загрузить города."));
      } finally {
        setIsLoadingCities(false);
      }
    };

    void load();
  }, [addressMode, regionId]);

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
    if (selectedCategoryId !== null && branchOptions.some((option) => String(option.id) === selectedCategoryId)) {
      return selectedCategoryId;
    }

    return branchOptions.length === 1 ? branchOptions[0]?.id ?? null : selectedCategoryId;
  }, [branchOptions, selectedCategoryId]);

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
  const visibleAttributes = useMemo(
    () => filterVisibleAttributes(attributes, attributeValues),
    [attributes, attributeValues],
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
    () => groupAttributesByName(visibleAttributes),
    [visibleAttributes],
  );
  const effectiveCondition = activeType === LISTING_TYPE_SERVICE
    ? LISTING_CONDITION_NOT_APPLICABLE
    : (condition === LISTING_CONDITION_NOT_APPLICABLE ? LISTING_CONDITION_USED : condition);
  const isFormBusy = isSubmitting || isUploadingMedia || isLoadingRoots || isLoadingBranch || isLoadingAttributes;

  const handleTypeChange = (type: number) => {
    setActiveType(type);
    setSelectedRootId(null);
    setSelectedCategoryId(null);
    setAttributeValues({});
  };

  const handleRootChange = (rootId: string) => {
    setSelectedRootId(rootId);
    setSelectedCategoryId(null);
    setAttributeValues({});
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setAttributeValues({});
  };

  const handleAddressModeChange = (mode: ListingAddressMode) => {
    setAddressMode(mode);
  };

  const handleRegionChange = (nextRegionId: number | null) => {
    setRegionId(nextRegionId);
    setCityId(null);
  };

  const handleAttributeChange = (attributeId: number, value: ListingAttributeValue) => {
    setAttributeValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [String(attributeId)]: value,
      };

      return pruneHiddenAttributeValues(attributes, nextValues);
    });
  };

  const handleMultiselectChange = (attributeId: number, optionValue: string, checked: boolean) => {
    setAttributeValues((currentValues) => {
      const attributeKey = String(attributeId);
      const current = Array.isArray(currentValues[attributeKey])
        ? currentValues[attributeKey] as string[]
        : [];

      const nextValues = {
        ...currentValues,
        [attributeKey]: checked
          ? Array.from(new Set([...current, optionValue]))
          : current.filter((item) => item !== optionValue),
      };

      return pruneHiddenAttributeValues(attributes, nextValues);
    });
  };

  const submitForm = (saveAsDraft = false) => {
    void form.handleSubmit((values) => handleValidSubmit(values, saveAsDraft))();
  };

  const syncExistingMedia = (listing: ListingItem) => {
    setExistingMedia(listing.media ?? []);
  };

  const handleDeleteExistingMedia = async (mediaId: number) => {
    if (initialListing === undefined) {
      return;
    }

    const previousMedia = existingMedia;
    setExistingMedia((items) => items.filter((item) => item.id !== mediaId));

    try {
      const listing = await deleteListingMedia(initialListing.id, mediaId);
      syncExistingMedia(listing);
      toast.success("Изображение удалено.");
    } catch (error) {
      setExistingMedia(previousMedia);
      toast.error(extractApiError(error, "Не удалось удалить изображение."));
    }
  };

  const handleSetMainExistingMedia = async (mediaId: number) => {
    if (initialListing === undefined) {
      return;
    }

    const nextMedia = moveMediaToFront(existingMedia, mediaId);
    const previousMedia = existingMedia;
    setExistingMedia(markMainMedia(nextMedia));

    try {
      const listing = await setMainListingMedia(initialListing.id, mediaId);
      syncExistingMedia(listing);
      toast.success("Главное фото обновлено.");
    } catch (error) {
      setExistingMedia(previousMedia);
      toast.error(extractApiError(error, "Не удалось выбрать главное фото."));
    }
  };

  const handleReorderExistingMedia = async (mediaId: number, direction: "left" | "right") => {
    if (initialListing === undefined) {
      return;
    }

    const previousMedia = existingMedia;
    const nextMedia = reorderMediaLocally(existingMedia, mediaId, direction);

    if (nextMedia === existingMedia) {
      return;
    }

    setExistingMedia(markMainMedia(nextMedia));

    try {
      const listing = await reorderListingMedia(initialListing.id, nextMedia.map((media) => media.id));
      syncExistingMedia(listing);
    } catch (error) {
      setExistingMedia(previousMedia);
      toast.error(extractApiError(error, "Не удалось изменить порядок изображений."));
    }
  };

  const retryMediaUpload = async () => {
    if (mediaRetryListingId === null || imageFiles.length === 0) {
      return;
    }

    try {
      setIsUploadingMedia(true);
      await uploadListingMedia(mediaRetryListingId, imageFiles);
      setImageFiles([]);
      setMediaRetryListingId(null);
      toast.success("Фотографии объявления загружены.");
      router.push(`/account/listings/${mediaRetryListingId}`);
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(
        error,
        "Объявление сохранено, но фотографии пока не загрузились. Проверьте соединение и повторите попытку.",
      ));
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleValidSubmit = async (
    values: ListingFormValues,
    saveAsDraft = false,
  ) => {
    if (effectiveSelectedCategoryId === null) {
      toast.error("Сначала выберите категорию объявления.");
      return;
    }

    const payload: CreateListingPayload | UpdateListingPayload = {
      categoryId: effectiveSelectedCategoryId,
      type: activeType,
      condition: effectiveCondition,
      title: values.title.trim(),
      description: values.description.trim(),
      price: parseIntegerMoney(values.price),
      currency: values.currency.trim() === "" ? null : values.currency.trim().toUpperCase(),
      isNegotiable,
      addressMode,
      profileAddressId: addressMode === "profile" ? profileAddressId : null,
      regionId: addressMode === "custom" ? regionId : null,
      cityId: addressMode === "custom" ? cityId : null,
      addressLine: addressMode === "custom" ? addressLine.trim() || null : null,
      ...(mode === "create" ? { saveAsDraft } : {}),
      attributeValues: buildAttributePayload(visibleAttributes, attributeValues),
    };

    if (addressMode === "profile" && profileAddressId === null) {
      toast.error("Выберите адрес из профиля или укажите другой адрес.");
      return;
    }

    if (addressMode === "custom" && regionId === null) {
      toast.error("Укажите регион объявления.");
      return;
    }

    try {
      setIsSubmitting(true);
      const savedListing = await onSubmit(payload);

      if (imageFiles.length > 0) {
        try {
          setIsUploadingMedia(true);
          await uploadListingMedia(savedListing.id, imageFiles);
          setImageFiles([]);
          setMediaRetryListingId(null);
        } catch (error) {
          setMediaRetryListingId(savedListing.id);
          toast.error(extractApiError(
            error,
            "Объявление сохранено, но фотографии пока не загрузились. Проверьте соединение и повторите попытку.",
          ));
          return;
        } finally {
          setIsUploadingMedia(false);
        }
      }

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
    handleDeleteExistingMedia,
    handleAttributeChange,
    handleCategoryChange,
    handleMultiselectChange,
    handleReorderExistingMedia,
    handleRootChange,
    handleAddressModeChange,
    handleRegionChange,
    handleSetMainExistingMedia,
    handleTypeChange,
    existingMedia,
    imageFiles,
    isFormBusy,
    isLoadingAttributes,
    isLoadingBranch,
    isLoadingRoots,
    isNegotiable,
    isSubmitting,
    isUploadingMedia,
    addressLine,
    addressMode,
    cities,
    cityId,
    isLoadingCities,
    isLoadingRegions,
    mediaRetryListingId,
    profileAddressId,
    regionId,
    regions,
    retryMediaUpload,
    setAddressLine,
    setCondition,
    setCityId,
    setImageFiles,
    setIsNegotiable,
    setProfileAddressId,
    submitForm,
    userAddresses: user?.addresses ?? [],
  };
}

function moveMediaToFront(media: ListingMediaItem[], mediaId: number): ListingMediaItem[] {
  const selectedMedia = media.find((item) => item.id === mediaId);

  if (selectedMedia === undefined) {
    return media;
  }

  return [
    selectedMedia,
    ...media.filter((item) => item.id !== mediaId),
  ];
}

function reorderMediaLocally(
  media: ListingMediaItem[],
  mediaId: number,
  direction: "left" | "right",
): ListingMediaItem[] {
  const currentIndex = media.findIndex((item) => item.id === mediaId);

  if (currentIndex === -1) {
    return media;
  }

  const nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

  if (nextIndex < 0 || nextIndex >= media.length) {
    return media;
  }

  const nextMedia = [...media];
  const currentMediaItem = nextMedia[currentIndex];
  const nextMediaItem = nextMedia[nextIndex];

  if (currentMediaItem === undefined || nextMediaItem === undefined) {
    return media;
  }

  nextMedia[currentIndex] = nextMediaItem;
  nextMedia[nextIndex] = currentMediaItem;

  return nextMedia;
}

function markMainMedia(media: ListingMediaItem[]): ListingMediaItem[] {
  return media.map((item, index) => ({
    ...item,
    isMain: index === 0,
    order: index + 1,
  }));
}

function containsCategoryId(root: { id: string | number; children: Array<{ id: string | number; children: unknown[] }> }, categoryId: string): boolean {
  if (String(root.id) === categoryId) {
    return true;
  }

  return root.children.some((child) => containsCategoryId(
    child as { id: string | number; children: Array<{ id: string | number; children: unknown[] }> },
    categoryId,
  ));
}
