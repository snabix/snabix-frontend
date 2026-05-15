import { api } from "@/src/shared/api";
import type { ForgotPasswordPayload } from "../model/types";

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await api.post("/auth/forgot-password", payload);
}
