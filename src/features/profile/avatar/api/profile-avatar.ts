import type { User } from "@/src/entities/user";
import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export async function uploadProfileAvatar(file: File): Promise<User> {
  const payload = new FormData();

  payload.append("avatar", file);

  const response = await api.post<ApiDataResponse<User>>("/auth/me/avatar", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return unwrapApiData(response.data);
}

export async function deleteProfileAvatar(): Promise<User> {
  const response = await api.delete<ApiDataResponse<User>>("/auth/me/avatar");

  return unwrapApiData(response.data);
}
