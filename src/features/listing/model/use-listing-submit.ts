import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ListingItem } from "@/src/entities/listing";
import type {
  CreateListingPayload,
  UpdateListingPayload,
} from "@/src/features/listing/api";
import { buildAttributePayload } from "@/src/features/listing/model/attribute-values";
import {
  listingFormSchema,
  type ListingFormValues,
} from "@/src/features/listing/model/listing-form-schema";
import { parseIntegerMoney } from "@/src/features/listing/model/listing-money";
import type { useListingAddressState } from "@/src/features/listing/model/use-listing-address-state";
import type { useListingAttributeState } from "@/src/features/listing/model/use-listing-attribute-state";
import type { useListingCategoryState } from "@/src/features/listing/model/use-listing-category-state";
import type { useListingMediaState } from "@/src/features/listing/model/use-listing-media-state";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { useMutationThrottle } from "@/src/shared/lib/use-mutation-throttle";

type UseListingSubmitOptions = {
  addressState: Pick<
    ReturnType<typeof useListingAddressState>,
    | "addressLine"
    | "addressMode"
    | "cityId"
    | "profileAddressId"
    | "regionId"
  >;
  attributeState: Pick<
    ReturnType<typeof useListingAttributeState>,
    "attributeValues" | "visibleAttributes"
  >;
  categoryState: Pick<
    ReturnType<typeof useListingCategoryState>,
    "activeType" | "condition" | "effectiveSelectedCategoryId"
  >;
  initialListing?: ListingItem;
  mediaState: Pick<
    ReturnType<typeof useListingMediaState>,
    "uploadPendingMedia"
  >;
  mode: "create" | "edit";
  onSubmit: (
    payload: CreateListingPayload | UpdateListingPayload,
  ) => Promise<ListingItem>;
};

export function useListingSubmit({
  addressState,
  attributeState,
  categoryState,
  initialListing,
  mediaState,
  mode,
  onSubmit,
}: UseListingSubmitOptions) {
  const router = useRouter();
  const runMutation = useMutationThrottle();
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

  const handleValidSubmit = async (
    values: ListingFormValues,
    saveAsDraft = false,
  ) => {
    const categoryId = categoryState.effectiveSelectedCategoryId;

    if (categoryId === null) {
      toast.error("Сначала выберите категорию объявления.");
      return;
    }

    if (addressState.addressMode === "profile" && addressState.profileAddressId === null) {
      toast.error("Выберите адрес из профиля или укажите другой адрес.");
      return;
    }

    if (addressState.addressMode === "custom" && addressState.regionId === null) {
      toast.error("Укажите регион объявления.");
      return;
    }

    const payload: CreateListingPayload | UpdateListingPayload = {
      categoryId,
      type: categoryState.activeType,
      condition: categoryState.condition,
      title: values.title.trim(),
      description: values.description.trim(),
      price: parseIntegerMoney(values.price),
      currency: values.currency.trim() === "" ? null : values.currency.trim().toUpperCase(),
      isNegotiable,
      addressMode: addressState.addressMode,
      profileAddressId: addressState.addressMode === "profile"
        ? addressState.profileAddressId
        : null,
      regionId: addressState.addressMode === "custom" ? addressState.regionId : null,
      cityId: addressState.addressMode === "custom" ? addressState.cityId : null,
      addressLine: addressState.addressMode === "custom"
        ? addressState.addressLine.trim() || null
        : null,
      ...(mode === "create" ? { saveAsDraft } : {}),
      attributeValues: buildAttributePayload(
        attributeState.visibleAttributes,
        attributeState.attributeValues,
      ),
    };

    const mutationKey = mode === "create"
      ? `listing:create:${saveAsDraft ? "draft" : "review"}`
      : `listing:${initialListing?.id ?? "edit"}:update`;

    try {
      const result = await runMutation(mutationKey, async () => {
        setIsSubmitting(true);
        const savedListing = await onSubmit(payload);
        const mediaUploaded = await mediaState.uploadPendingMedia(savedListing.id);

        return { mediaUploaded, savedListing };
      });

      if (!result.started || !result.value.mediaUploaded) {
        return;
      }

      toast.success(mode === "create"
        ? (saveAsDraft ? "Черновик объявления сохранён." : "Объявление отправлено на проверку.")
        : "Объявление обновлено.");
      router.push(`/account/listings/${result.value.savedListing.id}`);
      router.refresh();
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сохранить объявление."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitForm = (saveAsDraft = false) => {
    void form.handleSubmit((values) => handleValidSubmit(values, saveAsDraft))();
  };

  return {
    form,
    isNegotiable,
    isSubmitting,
    setIsNegotiable,
    submitForm,
  };
}
