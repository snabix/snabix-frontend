"use client";

export const AUTH_UNAUTHORIZED_EVENT = "snabix:auth:unauthorized";

export type AuthUnauthorizedReason = "unauthenticated" | "csrf-token-mismatch";

export type AuthUnauthorizedEventDetail = {
  reason: AuthUnauthorizedReason;
  message: string;
};

export const AUTH_CONTINUE_MESSAGE =
  "Пожалуйста, войдите в аккаунт, чтобы продолжить.";

export function notifyUnauthorized(
  detail: AuthUnauthorizedEventDetail = {
    reason: "unauthenticated",
    message: AUTH_CONTINUE_MESSAGE,
  },
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AuthUnauthorizedEventDetail>(AUTH_UNAUTHORIZED_EVENT, {
      detail,
    }),
  );
}
