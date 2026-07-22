export const AUTH_SESSION_HINT_KEY = "snabix:auth-session-hint:v1";

export function hasAuthSessionHint(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(AUTH_SESSION_HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAuthSessionHint(isAuthenticated: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (isAuthenticated) {
      window.localStorage.setItem(AUTH_SESSION_HINT_KEY, "1");
    } else {
      window.localStorage.removeItem(AUTH_SESSION_HINT_KEY);
    }
  } catch {
    // Storage can be unavailable in restricted browser contexts; auth still uses the server session.
  }
}
