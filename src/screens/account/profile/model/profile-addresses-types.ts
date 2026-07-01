import type { LocationCity } from "@/src/entities/location";

export type AddressDraft = {
  id?: string;
  regionId: string;
  cityId: string;
  label: string;
  addressLine: string;
  isPrimary: boolean;
};

export type CitiesByRegion = Record<string, LocationCity[]>;
