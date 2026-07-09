import type { AxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

type AxiosInstanceMock = {
  config: AxiosRequestConfig;
  get: ReturnType<typeof vi.fn>;
  interceptors: {
    request: {
      handler?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
      use: ReturnType<typeof vi.fn>;
    };
    response: {
      rejected?: (error: unknown) => Promise<never>;
      use: ReturnType<typeof vi.fn>;
    };
  };
};

const {
  axiosCreateMock,
  createdInstances,
  notifyUnauthorizedMock,
} = vi.hoisted(() => {
  const instances: AxiosInstanceMock[] = [];

  return {
    axiosCreateMock: vi.fn((config: AxiosRequestConfig) => {
      const instance: AxiosInstanceMock = {
        config,
        get: vi.fn().mockResolvedValue({}),
        interceptors: {
          request: {
            use: vi.fn((handler: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>) => {
              instance.interceptors.request.handler = handler;
            }),
          },
          response: {
            use: vi.fn((
              _fulfilled: unknown,
              rejected: (error: unknown) => Promise<never>,
            ) => {
              instance.interceptors.response.rejected = rejected;
            }),
          },
        },
      };

      instances.push(instance);

      return instance;
    }),
    createdInstances: instances,
    notifyUnauthorizedMock: vi.fn(),
  };
});

vi.mock("axios", () => ({
  default: {
    create: axiosCreateMock,
  },
}));

vi.mock("@/src/shared/config/env", () => ({
  publicEnv: {
    apiOrigin: "https://api.snabix.test",
    apiUrl: "https://api.snabix.test/api/v1",
  },
}));

vi.mock("@/src/features/auth/session/auth-events", () => ({
  AUTH_CONTINUE_MESSAGE: "Продолжите работу после входа.",
  notifyUnauthorized: notifyUnauthorizedMock,
}));

async function loadApi() {
  vi.resetModules();
  createdInstances.length = 0;
  notifyUnauthorizedMock.mockReset();

  await import("./axios");

  return {
    apiInstance: createdInstances[1],
    csrfInstance: createdInstances[0],
  };
}

describe("api axios csrf flow", () => {
  beforeEach(() => {
    axiosCreateMock.mockClear();
  });

  it("configures csrf and api clients with credentials", async () => {
    const { apiInstance, csrfInstance } = await loadApi();

    expect(csrfInstance.config).toMatchObject({
      baseURL: "https://api.snabix.test",
      withCredentials: true,
      withXSRFToken: true,
    });
    expect(apiInstance.config).toMatchObject({
      baseURL: "https://api.snabix.test/api/v1",
      withCredentials: true,
      withXSRFToken: true,
    });
  });

  it("loads csrf cookie from api origin before unsafe requests", async () => {
    const { apiInstance, csrfInstance } = await loadApi();

    await apiInstance.interceptors.request.handler?.({ method: "post" });

    expect(csrfInstance.get).toHaveBeenCalledWith("/sanctum/csrf-cookie");
  });

  it("does not load csrf cookie for safe requests", async () => {
    const { apiInstance, csrfInstance } = await loadApi();

    await apiInstance.interceptors.request.handler?.({ method: "get" });

    expect(csrfInstance.get).not.toHaveBeenCalled();
  });

  it.each([
    [401, "unauthenticated"],
    [419, "csrf-token-mismatch"],
  ] as const)("notifies auth layer on %s responses", async (status, reason) => {
    const { apiInstance } = await loadApi();
    const error = { response: { status } };

    await expect(apiInstance.interceptors.response.rejected?.(error)).rejects.toBe(error);

    expect(notifyUnauthorizedMock).toHaveBeenCalledWith({
      message: "Продолжите работу после входа.",
      reason,
    });
  });
});
