import { api } from "@/src/shared/api";
import type {
  AuthResponse,
  SignInPayload,
} from "@/src/features/auth/model/types";

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/sign-in", payload);
  return data;
}
