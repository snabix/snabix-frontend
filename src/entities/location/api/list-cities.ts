import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";
import type { LocationCity } from "@/src/entities/location/model/types";

type ListCitiesResponse = {
  cities: LocationCity[];
};

type ListCitiesParams = {
  regionId: number;
  search?: string;
};

export async function listCities({
  regionId,
  search,
}: ListCitiesParams): Promise<LocationCity[]> {
  const response = await api.get<ApiDataResponse<ListCitiesResponse>>("/locations/cities", {
    params: {
      regionId,
      search: search?.trim() || undefined,
    },
  });

  return unwrapApiData(response.data).cities;
}
