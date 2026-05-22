import type { UserAddress } from "@/src/entities/user";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export type ProfileAddressFormItem = {
  id?: string;
  regionId: number;
  cityId: number | null;
  label: string | null;
  addressLine: string | null;
  isPrimary: boolean;
};

type ProfileAddressesResponse = {
  addresses: UserAddress[];
};

export async function replaceProfileAddresses(
  addresses: ProfileAddressFormItem[],
): Promise<UserAddress[]> {
  const response = await api.put<ApiDataResponse<ProfileAddressesResponse>>("/auth/me/addresses", {
    addresses,
  });

  return unwrapApiData(response.data).addresses;
}
