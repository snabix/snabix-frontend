import { api } from "@/src/shared/api/axios";

type ResendEmailVerificationResponse = {
  data: {
    sent: boolean;
    message: string;
    cooldownSeconds: number;
  };
};

export async function resendEmailVerification() {
  const response = await api.post<ResendEmailVerificationResponse>(
    "/auth/email-verification-notification",
  );

  return response.data.data;
}
