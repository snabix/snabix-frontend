"use client";

export const AUTH_UNAUTHORIZED_EVENT = "snabix:auth:unauthorized";

export type AuthUnauthorizedReason = "unauthenticated" | "csrf-token-mismatch";

export type AuthUnauthorizedEventDetail = {
  reason: AuthUnauthorizedReason;
  message: string;
};

export function notifyUnauthorized(
  detail: AuthUnauthorizedEventDetail = {
    reason: "unauthenticated",
    message: "Сессия истекла. Войдите в аккаунт снова.",
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
