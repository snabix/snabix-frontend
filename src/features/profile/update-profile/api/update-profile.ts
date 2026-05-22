import type { User } from "@/src/entities/user";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";
import type { UpdateProfilePayload } from "../model/types";

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const response = await api.patch<ApiDataResponse<User>>("/auth/me", payload);

  return unwrapApiData(response.data);
}
