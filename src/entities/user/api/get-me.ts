import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";
import type { User } from "@/src/entities/user";

export const getMe = async (): Promise<User> => {
  const response = await api.get<ApiDataResponse<User>>("/auth/me");

  return unwrapApiData(response.data);
};
