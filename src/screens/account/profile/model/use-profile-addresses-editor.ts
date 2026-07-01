import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listCities, listRegions, type LocationRegion } from "@/src/entities/location";
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
  const [regions, setRegions] = useState<LocationRegion[]>([]);
  const [citiesByRegion, setCitiesByRegion] = useState<CitiesByRegion>({});
  const [drafts, setDrafts] = useState<AddressDraft[]>(() => toDrafts(initialAddresses));
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);
  const [regionsError, setRegionsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    listRegions()
      .then((items) => {
        if (isMounted) {
          setRegions(items);
          setRegionsError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRegionsError("Не удалось загрузить регионы.");
          toast.error("Не удалось загрузить регионы.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsRegionsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const regionIds = [...new Set(drafts.map((draft) => draft.regionId).filter(Boolean))];

    regionIds.forEach((regionId) => {
      if (citiesByRegion[regionId]) {
        return;
      }

      listCities({ regionId: Number(regionId) })
        .then((items) => {
          setCitiesByRegion((current) => ({
            ...current,
            [regionId]: items,
          }));
        })
        .catch(() => {
          toast.error("Не удалось загрузить города.");
        });
    });
  }, [citiesByRegion, drafts]);

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
    citiesByRegion,
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
