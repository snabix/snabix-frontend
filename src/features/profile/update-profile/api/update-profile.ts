import { api } from "@/src/shared/api";
import type { User } from "@/src/entities/user/model/types";
import type { UpdateProfilePayload } from "../model/types";

export async function updateProfile(
    payload: UpdateProfilePayload,
): Promise<User> {
    const { data } = await api.patch<User>("auth/me", payload);

    return data;
}