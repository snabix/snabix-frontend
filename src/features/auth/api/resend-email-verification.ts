import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

type ResendEmailVerificationPayload = {
  sent: boolean;
  message: string;
  cooldownSeconds: number;
};

export async function resendEmailVerification() {
  const response = await api.post<ApiDataResponse<ResendEmailVerificationPayload>>(
    "/auth/email-verification-notification",
  );

  return unwrapApiData(response.data);
}
