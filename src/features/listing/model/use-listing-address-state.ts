import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listCities,
  listRegions,
  type LocationCity,
  type LocationRegion,
} from "@/src/entities/location";
import type { ListingItem } from "@/src/entities/listing";
import { useUserStore } from "@/src/entities/user";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export type ListingAddressMode = "none" | "profile" | "custom";

export function useListingAddressState({
  initialListing,
  mode,
}: {
  initialListing?: ListingItem;
  mode: "create" | "edit";
}) {
  const user = useUserStore((state) => state.user);
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

  useEffect(() => {
    if (mode !== "create" || profileAddressId !== null || primaryAddressId === null) {
      return;
    }

    startTransition(() => {
      setAddressMode("profile");
      setProfileAddressId(primaryAddressId);
    });
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
      return;
    }

    const load = async () => {
      try {
        setIsLoadingCities(true);
        setCities([]);
        setCities(await listCities({ regionId }));
      } catch (error) {
        toast.error(extractApiError(error, "Не удалось загрузить города."));
      } finally {
        setIsLoadingCities(false);
      }
    };

    void load();
  }, [addressMode, regionId]);

  const handleAddressModeChange = (nextMode: ListingAddressMode) => {
    setAddressMode(nextMode);
    if (nextMode !== "custom") {
      setCities([]);
      setCityId(null);
    }
  };

  const handleRegionChange = (nextRegionId: number | null) => {
    setRegionId(nextRegionId);
    setCityId(null);
    setCities([]);
  };

  return {
    addressLine,
    addressMode,
    cities,
    cityId,
    handleAddressModeChange,
    handleRegionChange,
    isLoadingCities,
    isLoadingRegions,
    profileAddressId,
    regionId,
    regions,
    setAddressLine,
    setCityId,
    setProfileAddressId,
    userAddresses: user?.addresses ?? [],
  };
}
