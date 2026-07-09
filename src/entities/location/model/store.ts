import { create } from "zustand";
import { listCities } from "@/src/entities/location/api/list-cities";
import { listRegions } from "@/src/entities/location/api/list-regions";
import type { LocationCity, LocationRegion } from "@/src/entities/location/model/types";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

type LocationStatus = "idle" | "loading" | "success" | "error";
type LoadLocationOptions = {
  force?: boolean;
};

const LOCATION_CACHE_TTL_MS = 5 * 60 * 1000;

function hasFreshTimestamp(timestamp: number | null | undefined): boolean {
  if (typeof timestamp !== "number") {
    return false;
  }

  return Date.now() - timestamp < LOCATION_CACHE_TTL_MS;
}

type LocationStore = {
  regions: LocationRegion[];
  regionsStatus: LocationStatus;
  regionsErrorMessage: string | null;
  regionsFetchedAt: number | null;
  citiesByRegion: Record<number, LocationCity[]>;
  cityStatuses: Record<number, LocationStatus>;
  cityErrorMessages: Record<number, string | null>;
  citiesFetchedAt: Record<number, number | null>;
  loadRegions: (options?: LoadLocationOptions) => Promise<void>;
  loadCities: (regionId: number, options?: LoadLocationOptions) => Promise<void>;
  invalidateRegions: () => void;
  invalidateCities: (regionId: number) => void;
};

export const useLocationStore = create<LocationStore>((set, get) => ({
  regions: [],
  regionsStatus: "idle",
  regionsErrorMessage: null,
  regionsFetchedAt: null,
  citiesByRegion: {},
  cityStatuses: {},
  cityErrorMessages: {},
  citiesFetchedAt: {},
  loadRegions: async (options) => {
    const { regions, regionsFetchedAt, regionsStatus } = get();
    const forceReload = options?.force === true;
    const hasFreshRegions = regions.length > 0 && hasFreshTimestamp(regionsFetchedAt);

    if ((!forceReload && hasFreshRegions) || regionsStatus === "loading") {
      return;
    }

    set({
      regionsStatus: "loading",
      regionsErrorMessage: null,
    });

    try {
      const items = await listRegions();

      set({
        regions: items,
        regionsFetchedAt: Date.now(),
        regionsStatus: "success",
        regionsErrorMessage: null,
      });
    } catch (error) {
      set({
        regionsStatus: "error",
        regionsErrorMessage: extractApiError(error, "Не удалось загрузить регионы."),
      });
    }
  },
  loadCities: async (regionId, options) => {
    const { citiesByRegion, citiesFetchedAt, cityStatuses } = get();
    const forceReload = options?.force === true;
    const hasFreshCities = Boolean(citiesByRegion[regionId])
      && hasFreshTimestamp(citiesFetchedAt[regionId]);

    if ((!forceReload && hasFreshCities) || cityStatuses[regionId] === "loading") {
      return;
    }

    set((state) => ({
      cityStatuses: {
        ...state.cityStatuses,
        [regionId]: "loading",
      },
      cityErrorMessages: {
        ...state.cityErrorMessages,
        [regionId]: null,
      },
    }));

    try {
      const items = await listCities({ regionId });

      set((state) => ({
        citiesByRegion: {
          ...state.citiesByRegion,
          [regionId]: items,
        },
        citiesFetchedAt: {
          ...state.citiesFetchedAt,
          [regionId]: Date.now(),
        },
        cityStatuses: {
          ...state.cityStatuses,
          [regionId]: "success",
        },
        cityErrorMessages: {
          ...state.cityErrorMessages,
          [regionId]: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        cityStatuses: {
          ...state.cityStatuses,
          [regionId]: "error",
        },
        cityErrorMessages: {
          ...state.cityErrorMessages,
          [regionId]: extractApiError(error, "Не удалось загрузить города."),
        },
      }));
    }
  },
  invalidateRegions: () =>
    set({
      regionsFetchedAt: null,
      regionsStatus: "idle",
    }),
  invalidateCities: (regionId) =>
    set((state) => ({
      citiesFetchedAt: {
        ...state.citiesFetchedAt,
        [regionId]: null,
      },
      cityStatuses: {
        ...state.cityStatuses,
        [regionId]: "idle",
      },
    })),
}));
