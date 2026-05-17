import { api } from "@/src/shared/api";
import type { User } from "@/src/entities/user/model/types";

export async function uploadProfileAvatar(file: File): Promise<User> {
  const payload = new FormData();

  payload.append("avatar", file);

  const { data } = await api.post<{ data: User }>("/auth/me/avatar", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

export async function deleteProfileAvatar(): Promise<User> {
  const { data } = await api.delete<{ data: User }>("/auth/me/avatar");

  return data.data;
}
