import axios from "axios";
import { notifyUnauthorized } from "@/src/features/auth/session/auth-events";
import { getAccessToken } from "@/src/shared/lib/access-token";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiOrigin = apiUrl ? new URL(apiUrl).origin : undefined;

const csrfApi = axios.create({
  baseURL: apiOrigin,
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
  baseURL: apiUrl,
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

  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);
