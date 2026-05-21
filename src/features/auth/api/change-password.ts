import { api } from "@/src/shared/api";
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/src/features/auth/model/types";

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>(
    "/auth/change-password",
    payload,
  );

  return response.data;
}
