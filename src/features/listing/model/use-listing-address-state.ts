import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocationStore } from "@/src/entities/location";
import type { ListingItem } from "@/src/entities/listing";
import { useUserStore } from "@/src/entities/user";

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
  const regions = useLocationStore((state) => state.regions);
  const regionsStatus = useLocationStore((state) => state.regionsStatus);
  const regionsErrorMessage = useLocationStore((state) => state.regionsErrorMessage);
  const citiesByRegion = useLocationStore((state) => state.citiesByRegion);
  const cityStatuses = useLocationStore((state) => state.cityStatuses);
  const cityErrorMessages = useLocationStore((state) => state.cityErrorMessages);
  const loadRegions = useLocationStore((state) => state.loadRegions);
  const loadCities = useLocationStore((state) => state.loadCities);
  const [regionId, setRegionId] = useState<number | null>(initialLocation?.region.id ?? null);
  const [cityId, setCityId] = useState<number | null>(initialLocation?.city?.id ?? null);
  const [addressLine, setAddressLine] = useState(() => resolveInitialAddressLine(initialListing));
  const cities = regionId !== null ? (citiesByRegion[regionId] ?? []) : [];
  const isLoadingRegions = regionsStatus === "idle" || regionsStatus === "loading";
  const isLoadingCities = regionId !== null && cityStatuses[regionId] === "loading";

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
    if (addressMode !== "custom") {
      return;
    }

    void loadRegions();
  }, [addressMode, loadRegions]);

  useEffect(() => {
    if (addressMode !== "custom" || regionId === null) {
      return;
    }

    void loadCities(regionId);
  }, [addressMode, loadCities, regionId]);

  useEffect(() => {
    if (addressMode === "custom" && regionsStatus === "error" && regionsErrorMessage !== null) {
      toast.error(regionsErrorMessage);
    }
  }, [addressMode, regionsErrorMessage, regionsStatus]);

  useEffect(() => {
    if (
      addressMode === "custom"
      && regionId !== null
      && cityStatuses[regionId] === "error"
      && cityErrorMessages[regionId] !== null
    ) {
      toast.error(cityErrorMessages[regionId]);
    }
  }, [addressMode, cityErrorMessages, cityStatuses, regionId]);

  const handleAddressModeChange = (nextMode: ListingAddressMode) => {
    setAddressMode(nextMode);
    if (nextMode !== "custom") {
      setCityId(null);
    }
  };

  const handleRegionChange = (nextRegionId: number | null) => {
    setRegionId(nextRegionId);
    setCityId(null);
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

function resolveInitialAddressLine(initialListing?: ListingItem): string {
  const locationAddressLine = initialListing?.location?.addressLine?.trim();

  if (locationAddressLine) {
    return locationAddressLine;
  }

  const listingAddressLine = initialListing?.addressLine?.trim();

  if (listingAddressLine) {
    return listingAddressLine;
  }

  return [initialListing?.street, initialListing?.house]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}
