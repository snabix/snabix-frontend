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
    const status = error.response?.status ?? null;

    if (payload?.errors) {
      const firstFieldErrors = Object.values(payload.errors)[0];

      if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
        return firstFieldErrors[0];
      }
    }

    if (status !== null && status >= 500) {
      return fallback;
    }

    if (payload?.message) {
      return payload.message;
    }

    if (payload?.error) {
      return payload.error;
    }
  }

  return fallback;
}
