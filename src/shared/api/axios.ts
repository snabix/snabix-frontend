import axios from "axios";
import { notifyUnauthorized } from "@/src/features/auth/session/auth-events";
import { publicEnv } from "@/src/shared/config/env";
import { clearAuthSession } from "@/src/shared/lib/auth-session";

const csrfApi = axios.create({
  baseURL: publicEnv.apiOrigin,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
});

let csrfCookiePromise: Promise<void> | null = null;

async function ensureCsrfCookie() {
  if (csrfCookiePromise === null) {
    csrfCookiePromise = csrfApi
      .get("/sanctum/csrf-cookie")
      .then(() => undefined)
      .finally(() => {
        csrfCookiePromise = null;
      });
  }

  await csrfCookiePromise;
}

export const api = axios.create({
  baseURL: publicEnv.apiUrl,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  const isUnsafeMethod = method === "post" || method === "put" || method === "patch" || method === "delete";

  if (isUnsafeMethod) {
    await ensureCsrfCookie();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);
