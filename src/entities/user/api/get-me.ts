import {
  api,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
  userSchema,
} from "@/src/shared/api";
import type { User } from "@/src/entities/user";

export const getMe = async (): Promise<User> => {
  const response = await api.get<ApiDataResponse<unknown>>("/auth/me");

  return parseApiContract(
    userSchema,
    unwrapApiData(response.data),
    "Ответ профиля пользователя не соответствует ожидаемому формату.",
  );
};
