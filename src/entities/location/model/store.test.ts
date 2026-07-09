import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocationStore } from "@/src/entities/location/model/store";
import type { LocationCity, LocationRegion } from "@/src/entities/location/model/types";

const {
  listCitiesMock,
  listRegionsMock,
} = vi.hoisted(() => ({
  listCitiesMock: vi.fn<(params: { regionId: number }) => Promise<LocationCity[]>>(),
  listRegionsMock: vi.fn<() => Promise<LocationRegion[]>>(),
}));

vi.mock("@/src/entities/location/api/list-cities", () => ({
  listCities: listCitiesMock,
}));

vi.mock("@/src/entities/location/api/list-regions", () => ({
  listRegions: listRegionsMock,
}));

const region: LocationRegion = {
  id: 2,
  name: "Республика Башкортостан",
  fullName: "Республика Башкортостан",
  label: "Республика Башкортостан",
  type: "region",
};

const city: LocationCity = {
  id: 10,
  regionId: 2,
  name: "Уфа",
  label: "Уфа",
  type: "city",
};

describe("useLocationStore", () => {
  beforeEach(() => {
    listCitiesMock.mockReset();
    listRegionsMock.mockReset();
    useLocationStore.setState(useLocationStore.getInitialState(), true);
  });

  it("loads regions once and reuses fresh cache", async () => {
    listRegionsMock.mockResolvedValue([region]);

    await useLocationStore.getState().loadRegions();
    await useLocationStore.getState().loadRegions();

    expect(listRegionsMock).toHaveBeenCalledTimes(1);
    expect(useLocationStore.getState().regions).toEqual([region]);
    expect(useLocationStore.getState().regionsStatus).toBe("success");
  });

  it("reloads regions when force flag is passed", async () => {
    listRegionsMock.mockResolvedValue([region]);

    await useLocationStore.getState().loadRegions();
    await useLocationStore.getState().loadRegions({ force: true });

    expect(listRegionsMock).toHaveBeenCalledTimes(2);
  });

  it("reloads regions after invalidation", async () => {
    listRegionsMock.mockResolvedValue([region]);

    await useLocationStore.getState().loadRegions();
    useLocationStore.getState().invalidateRegions();
    await useLocationStore.getState().loadRegions();

    expect(listRegionsMock).toHaveBeenCalledTimes(2);
  });

  it("loads cities per region once and reuses fresh cache", async () => {
    listCitiesMock.mockResolvedValue([city]);

    await useLocationStore.getState().loadCities(2);
    await useLocationStore.getState().loadCities(2);

    expect(listCitiesMock).toHaveBeenCalledTimes(1);
    expect(useLocationStore.getState().citiesByRegion[2]).toEqual([city]);
    expect(useLocationStore.getState().cityStatuses[2]).toBe("success");
  });

  it("invalidates only selected city cache", async () => {
    const otherCity = {
      ...city,
      id: 11,
      name: "Казань",
      regionId: 16,
    };
    listCitiesMock.mockImplementation(async ({ regionId }) => (
      regionId === 2 ? [city] : [otherCity]
    ));

    await useLocationStore.getState().loadCities(2);
    await useLocationStore.getState().loadCities(16);
    useLocationStore.getState().invalidateCities(2);
    await useLocationStore.getState().loadCities(2);
    await useLocationStore.getState().loadCities(16);

    expect(listCitiesMock).toHaveBeenCalledTimes(3);
    expect(listCitiesMock).toHaveBeenCalledWith({ regionId: 2 });
    expect(listCitiesMock).toHaveBeenCalledWith({ regionId: 16 });
    expect(useLocationStore.getState().cityStatuses[16]).toBe("success");
  });
});
