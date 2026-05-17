import { api } from "@/src/shared/api";
import type { ResetPasswordPayload } from "@/src/features/auth/model/types";

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await api.post("/auth/reset-password", payload);
}
