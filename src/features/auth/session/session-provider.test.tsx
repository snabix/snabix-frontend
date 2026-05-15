import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { useUserStore } from "@/src/entities/user";
import type { User } from "@/src/entities/user/model/types";

const {
  getMeMock,
  clearAuthSessionMock,
  shouldHydrateSessionMock,
} = vi.hoisted(() => ({
  getMeMock: vi.fn<() => Promise<User>>(),
  clearAuthSessionMock: vi.fn<() => void>(),
  shouldHydrateSessionMock: vi.fn<() => boolean>(),
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
    clearAuthSession: clearAuthSessionMock,
    shouldHydrateSession: shouldHydrateSessionMock,
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
    clearAuthSessionMock.mockReset();
    shouldHydrateSessionMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("marks session as checked immediately when hydration is not needed", async () => {
    shouldHydrateSessionMock.mockReturnValue(false);

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
    shouldHydrateSessionMock.mockReturnValue(true);
    getMeMock.mockResolvedValue(mockUser);

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
    });

    expect(clearAuthSessionMock).not.toHaveBeenCalled();
  });

  it("clears session and removes token when getMe fails", async () => {
    shouldHydrateSessionMock.mockReturnValue(true);
    getMeMock.mockRejectedValue(new Error("Unauthorized"));

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
    });

    expect(clearAuthSessionMock).toHaveBeenCalledTimes(1);
  });
});
