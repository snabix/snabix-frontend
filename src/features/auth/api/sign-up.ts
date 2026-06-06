import { api } from "@/src/shared/api";
import type { AuthResponse, SignUpPayload } from "@/src/features/auth/model/types";

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/sign-up", payload);

  return response.data;
}
