import { api } from "@/src/shared/api/axios";

type VerifyEmailCodePayload = {
  code: string;
};

type VerifyEmailCodeResponse = {
  data: {
    verified: boolean;
    alreadyVerified: boolean;
    message: string;
  };
};

export async function verifyEmailCode(payload: VerifyEmailCodePayload) {
  const response = await api.post<VerifyEmailCodeResponse>(
    "/auth/verify-email",
    payload,
  );

  return response.data.data;
}
