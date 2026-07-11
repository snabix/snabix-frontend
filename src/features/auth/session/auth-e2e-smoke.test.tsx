import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import { ForgotPasswordForm } from "@/src/features/auth/ui/forgot-password-form";
import { ResetPasswordForm } from "@/src/features/auth/ui/reset-password-form";
import { SignInForm } from "@/src/features/auth/ui/sign-in-form";

const {
  forgotPasswordMock,
  getMeMock,
  pushMock,
  refreshMock,
  resetPasswordMock,
  signInMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  forgotPasswordMock: vi.fn(),
  getMeMock: vi.fn<() => Promise<User>>(),
  pushMock: vi.fn<(href: string) => void>(),
  refreshMock: vi.fn<() => void>(),
  resetPasswordMock: vi.fn(),
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
    forgotPassword: forgotPasswordMock,
    resetPassword: resetPasswordMock,
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
  id: "user-1",
  email: "user@example.com",
  firstName: "Иван",
  lastName: "Петров",
  description: null,
  dateOfBirth: null,
  phoneNumber: "+79990000000",
  addresses: [],
  isActive: true,
  emailVerifiedAt: "2026-05-11T00:00:00Z",
  avatar: null,
};

describe("auth e2e smoke flows", () => {
  beforeEach(() => {
    forgotPasswordMock.mockReset();
    getMeMock.mockReset();
    pushMock.mockReset();
    refreshMock.mockReset();
    resetPasswordMock.mockReset();
    signInMock.mockReset();
    toastSuccessMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("signs in, requests current user and redirects to requested account page", async () => {
    signInMock.mockResolvedValue(undefined);
    getMeMock.mockResolvedValue(mockUser);
    window.history.pushState(
      {},
      "",
      "/sign-in?redirectTo=%2Faccount%2Fprofile",
    );

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
  });

  it("requests password reset email and completes reset from token link", async () => {
    forgotPasswordMock.mockResolvedValue(undefined);
    resetPasswordMock.mockResolvedValue(undefined);

    const { unmount } = render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Отправить письмо" }));

    await waitFor(() => {
      expect(forgotPasswordMock).toHaveBeenCalledWith({
        email: "user@example.com",
      });
    });

    unmount();

    render(
      <ResetPasswordForm
        initialEmail="user@example.com"
        initialToken="reset-token"
      />,
    );

    fireEvent.change(screen.getByLabelText("Новый пароль"), {
      target: { value: "NewStrongPassword123!" },
    });
    fireEvent.change(screen.getByLabelText("Повторите пароль"), {
      target: { value: "NewStrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Обновить пароль" }));

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith({
        email: "user@example.com",
        token: "reset-token",
        password: "NewStrongPassword123!",
        passwordConfirmation: "NewStrongPassword123!",
      });
      expect(pushMock).toHaveBeenCalledWith("/sign-in");
    });
  });
});
