import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import { SignInForm } from "@/src/features/auth/ui/sign-in-form";

const { getMeMock, pushMock, refreshMock, signInMock, toastSuccessMock } =
  vi.hoisted(() => ({
    getMeMock: vi.fn<() => Promise<User>>(),
    pushMock: vi.fn<(href: string) => void>(),
    refreshMock: vi.fn<() => void>(),
    signInMock: vi.fn(),
    toastSuccessMock: vi.fn<(message: string) => void>(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
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

vi.mock("@/src/features/auth/api", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/auth/api")>(
    "@/src/features/auth/api",
  );

  return {
    ...actual,
    signIn: signInMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: toastSuccessMock,
  },
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

describe("SignInForm", () => {
  beforeEach(() => {
    getMeMock.mockReset();
    pushMock.mockReset();
    refreshMock.mockReset();
    signInMock.mockReset();
    toastSuccessMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);
    window.history.pushState(
      {},
      "",
      "/sign-in?redirectTo=%2Faccount%2Fprofile",
    );
  });

  it("signs in, loads current user and redirects to requested account page", async () => {
    signInMock.mockResolvedValue(undefined);
    getMeMock.mockResolvedValue(mockUser);

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "StrongPassword123!",
      });
      expect(getMeMock).toHaveBeenCalledTimes(1);
      expect(useUserStore.getState().user).toEqual(mockUser);
      expect(pushMock).toHaveBeenCalledWith("/account/profile");
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    expect(toastSuccessMock).toHaveBeenCalledWith("Вы вошли в аккаунт.");
  });
});
