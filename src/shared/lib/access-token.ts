const ACCESS_TOKEN_KEY = "snabix_access_token";

type AuthTokenResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
  };
};

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function extractAccessToken(response: AuthTokenResponse) {
  return (
    response.accessToken ??
    response.access_token ??
    response.token ??
    response.data?.accessToken ??
    response.data?.access_token ??
    response.data?.token ??
    null
  );
}
