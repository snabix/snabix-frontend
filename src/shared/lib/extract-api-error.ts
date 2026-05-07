import { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export function extractApiError(
  error: unknown,
  fallback = "Не удалось выполнить запрос. Попробуйте еще раз.",
) {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    if (payload?.message) {
      return payload.message;
    }

    if (payload?.error) {
      return payload.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
