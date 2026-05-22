import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";
import type { LocationRegion } from "@/src/entities/location/model/types";

type ListRegionsResponse = {
  regions: LocationRegion[];
};

export async function listRegions(): Promise<LocationRegion[]> {
  const response = await api.get<ApiDataResponse<ListRegionsResponse>>("/locations/regions");

  return unwrapApiData(response.data).regions;
}
