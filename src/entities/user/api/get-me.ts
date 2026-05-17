import { api } from "@/src/shared/api";
import { User } from "@/src/entities/user/model/types";

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<{ data: User }>("/auth/me");
  return data.data;
};
