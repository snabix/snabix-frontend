import { api } from "@/src/shared/api";
import type { AuthResponse, SignUpPayload } from "../model/types";

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/sign-up", payload);
  return data;
}
