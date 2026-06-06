import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTH_CONTINUE_MESSAGE,
  AUTH_UNAUTHORIZED_EVENT,
  notifyUnauthorized,
} from "@/src/features/auth/session/auth-events";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { useUserStore } from "@/src/entities/user";
import type { User } from "@/src/entities/user";

const {
  getMeMock,
  clearCookieSessionStateMock,
  shouldCheckCookieSessionMock,
  pathnameMock,
  replaceMock,
  toastInfoMock,
} = vi.hoisted(() => ({
  getMeMock: vi.fn<() => Promise<User>>(),
  clearCookieSessionStateMock: vi.fn<() => void>(),
  shouldCheckCookieSessionMock: vi.fn<() => boolean>(),
  pathnameMock: vi.fn<() => string>(),
  replaceMock: vi.fn<(href: string) => void>(),
  toastInfoMock: vi.fn<(message: string) => void>(),
}));

vi.mock("@/src/entities/user", async () => {
  const actual = await vi.importActual<typeof import("@/src/entities/user")>(
    "@/src/entities/user",
  );

  return {
    ...actual,
    getMe: getMeMock,
  };
});

vi.mock("@/src/shared/lib/auth-session", async () => {
  const actual = await vi.importActual<
    typeof import("@/src/shared/lib/auth-session")
  >("@/src/shared/lib/auth-session");

  return {
    ...actual,
    clearCookieSessionState: clearCookieSessionStateMock,
    shouldCheckCookieSession: shouldCheckCookieSessionMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    info: toastInfoMock,
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: pathnameMock,
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const mockUser: User = {
  id: "1",
  email: "user@example.com",
  firstName: "Ivan",
  lastName: "Petrov",
  phoneNumber: "+79990000000",
  isActive: true,
  emailVerifiedAt: "2026-05-11T00:00:00Z",
  avatar: null,
};

describe("SessionProvider", () => {
  beforeEach(() => {
    getMeMock.mockReset();
    clearCookieSessionStateMock.mockReset();
    shouldCheckCookieSessionMock.mockReset();
    pathnameMock.mockReset();
    replaceMock.mockReset();
    toastInfoMock.mockReset();
    pathnameMock.mockReturnValue("/account/profile");
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("marks session as checked immediately when hydration is not needed", async () => {
    shouldCheckCookieSessionMock.mockReturnValue(false);

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
    });

    expect(getMeMock).not.toHaveBeenCalled();
  });

  it("hydrates user when session should be restored", async () => {
    shouldCheckCookieSessionMock.mockReturnValue(true);
    getMeMock.mockResolvedValue(mockUser);

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
    });

    expect(clearCookieSessionStateMock).not.toHaveBeenCalled();
  });

  it("clears session and removes token when getMe fails", async () => {
    shouldCheckCookieSessionMock.mockReturnValue(true);
    getMeMock.mockRejectedValue(new Error("Unauthorized"));

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
    });

    expect(clearCookieSessionStateMock).toHaveBeenCalledTimes(1);
  });

  it("clears local user state when unauthorized event is received", async () => {
    shouldCheckCookieSessionMock.mockReturnValue(true);
    getMeMock.mockResolvedValue(mockUser);

    render(<SessionProvider />);

    await waitFor(() => {
      expect(useUserStore.getState().user).toEqual(mockUser);
    });

    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
    });

    expect(toastInfoMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("shows friendly sign-in prompt and redirects protected pages on unauthorized event", async () => {
    shouldCheckCookieSessionMock.mockReturnValue(true);
    getMeMock.mockResolvedValue(mockUser);

    render(<SessionProvider />);

    await waitFor(() => {
      expect(useUserStore.getState().user).toEqual(mockUser);
    });

    notifyUnauthorized({
      reason: "csrf-token-mismatch",
      message: AUTH_CONTINUE_MESSAGE,
    });

    await waitFor(() => {
      expect(useUserStore.getState().user).toBeNull();
    });

    expect(toastInfoMock).toHaveBeenCalledWith(AUTH_CONTINUE_MESSAGE);
    expect(replaceMock).toHaveBeenCalledWith(
      "/sign-in?redirectTo=%2Faccount%2Fprofile",
    );
  });
});
