import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChangePasswordForm } from "@/src/features/auth/ui/change-password-form";

const { changePasswordMock, toastSuccessMock } = vi.hoisted(() => ({
  changePasswordMock: vi.fn(),
  toastSuccessMock: vi.fn<(message: string) => void>(),
}));

vi.mock("@/src/features/auth/api", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/auth/api")>(
    "@/src/features/auth/api",
  );

  return {
    ...actual,
    changePassword: changePasswordMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: toastSuccessMock,
  },
}));

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    changePasswordMock.mockReset();
    toastSuccessMock.mockReset();
  });

  it("submits current and new password to API", async () => {
    changePasswordMock.mockResolvedValue({
      changed: true,
      message: "Пароль обновлен.",
    });

    render(<ChangePasswordForm />);

    const currentPassword = screen.getByLabelText("Текущий пароль");
    const newPassword = screen.getByLabelText("Новый пароль");
    const passwordConfirmation = screen.getByLabelText(
      "Повторите новый пароль",
    );

    expect(currentPassword).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
    expect(newPassword).toHaveAttribute("autocomplete", "new-password");
    expect(passwordConfirmation).toHaveAttribute(
      "autocomplete",
      "new-password",
    );

    fireEvent.change(currentPassword, {
      target: { value: "OldStrongPassword123!" },
    });
    fireEvent.change(newPassword, {
      target: { value: "NewStrongPassword123!" },
    });
    fireEvent.change(passwordConfirmation, {
      target: { value: "NewStrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Обновить пароль" }));

    await waitFor(() => {
      expect(changePasswordMock).toHaveBeenCalledWith({
        currentPassword: "OldStrongPassword123!",
        password: "NewStrongPassword123!",
        passwordConfirmation: "NewStrongPassword123!",
      });
    });

    expect(toastSuccessMock).toHaveBeenCalledWith("Пароль обновлен.");
  });
});
