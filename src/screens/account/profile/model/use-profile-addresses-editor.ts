import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocationStore } from "@/src/entities/location";
import type { User, UserAddress } from "@/src/entities/user";
import { replaceProfileAddresses, type ProfileAddressFormItem } from "@/src/features/profile";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import type { AddressDraft, CitiesByRegion } from "./profile-addresses-types";

type UseProfileAddressesEditorParams = {
  initialAddresses: UserAddress[];
  onUserChange: (user: User | null) => void;
  user: User | null;
};

export function useProfileAddressesEditor({
  initialAddresses,
  onUserChange,
  user,
}: UseProfileAddressesEditorParams) {
  const regions = useLocationStore((state) => state.regions);
  const regionsStatus = useLocationStore((state) => state.regionsStatus);
  const regionsErrorMessage = useLocationStore((state) => state.regionsErrorMessage);
  const citiesByRegion = useLocationStore((state) => state.citiesByRegion);
  const cityStatuses = useLocationStore((state) => state.cityStatuses);
  const cityErrorMessages = useLocationStore((state) => state.cityErrorMessages);
  const loadRegions = useLocationStore((state) => state.loadRegions);
  const loadCities = useLocationStore((state) => state.loadCities);
  const [drafts, setDrafts] = useState<AddressDraft[]>(() => toDrafts(initialAddresses));
  const [isSaving, setIsSaving] = useState(false);
  const isRegionsLoading = regionsStatus === "idle" || regionsStatus === "loading";
  const regionsError = regionsStatus === "error"
    ? (regionsErrorMessage ?? "Не удалось загрузить регионы.")
    : null;

  useEffect(() => {
    void loadRegions();
  }, [loadRegions]);

  useEffect(() => {
    if (regionsError !== null) {
      toast.error(regionsError);
    }
  }, [regionsError]);

  useEffect(() => {
    const regionIds = [...new Set(drafts.map((draft) => draft.regionId).filter(Boolean))];

    regionIds.forEach((regionId) => {
      const numericRegionId = Number(regionId);

      if (citiesByRegion[numericRegionId]) {
        return;
      }

      void loadCities(numericRegionId);
    });
  }, [citiesByRegion, drafts, loadCities]);

  useEffect(() => {
    Object.entries(cityErrorMessages).forEach(([regionId, message]) => {
      if (cityStatuses[Number(regionId)] === "error" && message !== null) {
        toast.error(message);
      }
    });
  }, [cityErrorMessages, cityStatuses]);

  const updateDraft = (index: number, patch: Partial<AddressDraft>) => {
    setDrafts((current) => current.map((draft, draftIndex) => {
      if (draftIndex !== index) {
        return draft;
      }

      return {
        ...draft,
        ...patch,
        cityId: patch.regionId !== undefined ? "" : (patch.cityId ?? draft.cityId),
      };
    }));
  };

  const addAddress = () => {
    setDrafts((current) => [
      ...current,
      {
        regionId: "",
        cityId: "",
        label: "",
        addressLine: "",
        isPrimary: current.length === 0,
      },
    ]);
  };

  const removeAddress = (index: number) => {
    setDrafts((current) => {
      const next = current.filter((_, draftIndex) => draftIndex !== index);

      if (next.length > 0 && !next.some((draft) => draft.isPrimary)) {
        next[0] = {
          ...next[0],
          isPrimary: true,
        };
      }

      return next;
    });
  };

  const setPrimaryAddress = (index: number, isPrimary: boolean) => {
    setDrafts((current) => current.map((draft, draftIndex) => ({
      ...draft,
      isPrimary: isPrimary ? draftIndex === index : (draftIndex === index ? false : draft.isPrimary),
    })));
  };

  const saveAddresses = async () => {
    setIsSaving(true);

    try {
      const addresses = await replaceProfileAddresses(toPayload(drafts));

      if (user) {
        onUserChange({
          ...user,
          addresses,
        });
      }

      toast.success("Адреса профиля обновлены.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сохранить адреса."));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    addAddress,
    canAddAddress: !isRegionsLoading && regionsError === null,
    canSave: !isRegionsLoading && regionsError === null && !isSaving,
    citiesByRegion: citiesByRegion as CitiesByRegion,
    drafts,
    isRegionsLoading,
    isSaving,
    regions,
    regionsError,
    removeAddress,
    saveAddresses,
    setPrimaryAddress,
    updateDraft,
  };
}

function toDrafts(addresses: UserAddress[]): AddressDraft[] {
  return addresses.map((address) => ({
    id: address.id,
    regionId: String(address.region.id),
    cityId: address.city ? String(address.city.id) : "",
    label: address.label ?? "",
    addressLine: address.addressLine ?? "",
    isPrimary: address.isPrimary,
  }));
}

function toPayload(drafts: AddressDraft[]): ProfileAddressFormItem[] {
  return drafts
    .filter((draft) => draft.regionId)
    .map((draft, index) => ({
      id: draft.id,
      regionId: Number(draft.regionId),
      cityId: draft.cityId ? Number(draft.cityId) : null,
      label: draft.label.trim() || null,
      addressLine: draft.addressLine.trim() || null,
      isPrimary: draft.isPrimary || index === 0,
    }));
}
