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
  pathnameMock,
  replaceMock,
  toastInfoMock,
} = vi.hoisted(() => ({
  getMeMock: vi.fn<() => Promise<User>>(),
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
  aboutMe: null,
  phoneNumber: "+79990000000",
  addresses: [],
  isActive: true,
  emailVerifiedAt: "2026-05-11T00:00:00Z",
  avatar: null,
};

describe("SessionProvider", () => {
  beforeEach(() => {
    getMeMock.mockReset();
    pathnameMock.mockReset();
    replaceMock.mockReset();
    toastInfoMock.mockReset();
    pathnameMock.mockReturnValue("/account/profile");
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("hydrates user from the server session on startup", async () => {
    getMeMock.mockResolvedValue(mockUser);

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
      expect(state.sessionStatus).toBe("authenticated");
      expect(state.sessionEndReason).toBeNull();
    });

    expect(getMeMock).toHaveBeenCalledTimes(1);
  });

  it("clears local session when getMe fails", async () => {
    getMeMock.mockRejectedValue(new Error("Unauthorized"));

    render(<SessionProvider />);

    await waitFor(() => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.hasCheckedSession).toBe(true);
      expect(state.sessionStatus).toBe("expired");
      expect(state.sessionEndReason).toBe("unauthenticated");
    });

    expect(getMeMock).toHaveBeenCalledTimes(1);
  });

  it("clears local user state when unauthorized event is received", async () => {
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
      expect(state.sessionStatus).toBe("expired");
      expect(state.sessionEndReason).toBe("unauthenticated");
    });

    expect(toastInfoMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("shows friendly sign-in prompt and redirects protected pages on unauthorized event", async () => {
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
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.sessionStatus).toBe("expired");
      expect(state.sessionEndReason).toBe("csrf-token-mismatch");
    });

    expect(toastInfoMock).toHaveBeenCalledWith(AUTH_CONTINUE_MESSAGE);
    expect(replaceMock).toHaveBeenCalledWith(
      "/sign-in?redirectTo=%2Faccount%2Fprofile",
    );
  });
});
