export type LocationRegion = {
  id: number;
  name: string;
  label: string;
  type: string | null;
};

export type LocationCity = {
  id: number;
  regionId: number;
  name: string;
  label: string;
  type: string | null;
};
