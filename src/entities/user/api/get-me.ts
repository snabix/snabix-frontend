import {
  getData,
  userSchema,
} from "@/src/shared/api";
import type { User } from "@/src/entities/user";

export const getMe = async (): Promise<User> => {
  return getData(
    userSchema,
    "/auth/me",
    { errorMessage: "Ответ профиля пользователя не соответствует ожидаемому формату." },
  );
};
