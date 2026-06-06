import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

type VerifyEmailCodeRequest = {
  code: string;
};

type VerifyEmailCodePayload = {
  verified: boolean;
  alreadyVerified: boolean;
  message: string;
};

export async function verifyEmailCode(payload: VerifyEmailCodeRequest) {
  const response = await api.post<ApiDataResponse<VerifyEmailCodePayload>>(
    "/auth/verify-email",
    payload,
  );

  return unwrapApiData(response.data);
}
