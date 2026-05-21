import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "@/src/features/auth/ui/forgot-password-form";
import { ResetPasswordForm } from "@/src/features/auth/ui/reset-password-form";

const {
  forgotPasswordMock,
  pushMock,
  resetPasswordMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  forgotPasswordMock: vi.fn(),
  pushMock: vi.fn<(href: string) => void>(),
  resetPasswordMock: vi.fn(),
  toastSuccessMock: vi.fn<(message: string) => void>(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/src/features/auth/api", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/auth/api")>(
    "@/src/features/auth/api",
  );

  return {
    ...actual,
    forgotPassword: forgotPasswordMock,
    resetPassword: resetPasswordMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: toastSuccessMock,
  },
}));

describe("password reset flow", () => {
  beforeEach(() => {
    forgotPasswordMock.mockReset();
    pushMock.mockReset();
    resetPasswordMock.mockReset();
    toastSuccessMock.mockReset();
  });

  it("requests reset password email", async () => {
    forgotPasswordMock.mockResolvedValue(undefined);

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Отправить письмо" }));

    await waitFor(() => {
      expect(forgotPasswordMock).toHaveBeenCalledWith({
        email: "user@example.com",
      });
    });

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Если аккаунт найден, мы отправим письмо для сброса.",
    );
  });

  it("resets password and redirects to sign-in", async () => {
    resetPasswordMock.mockResolvedValue(undefined);

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
    fireEvent.click(
      screen.getByRole("button", { name: "Обновить пароль" }),
    );

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith({
        email: "user@example.com",
        token: "reset-token",
        password: "NewStrongPassword123!",
        passwordConfirmation: "NewStrongPassword123!",
      });
      expect(pushMock).toHaveBeenCalledWith("/sign-in");
    });

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Пароль обновлен. Теперь можно войти.",
    );
  });
});
