import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_UNAUTHORIZED_EVENT } from "@/src/features/auth/session/auth-events";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { useUserStore } from "@/src/entities/user";
import type { User } from "@/src/entities/user";

const {
  getMeMock,
  clearCookieSessionStateMock,
  shouldCheckCookieSessionMock,
} = vi.hoisted(() => ({
  getMeMock: vi.fn<() => Promise<User>>(),
  clearCookieSessionStateMock: vi.fn<() => void>(),
  shouldCheckCookieSessionMock: vi.fn<() => boolean>(),
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
  });
});
