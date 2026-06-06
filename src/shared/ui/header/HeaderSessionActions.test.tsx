import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import { HeaderSessionActions } from "@/src/shared/ui/header/HeaderSessionActions";

vi.mock("@/src/shared/ui/theme-switcher/ThemeSwitcher", () => ({
  ThemeSwitcher: () => <button type="button">Тема</button>,
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

describe("HeaderSessionActions", () => {
  beforeEach(() => {
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("does not expose user menu before session check is finished", () => {
    useUserStore.setState({
      hasCheckedSession: false,
      user: mockUser,
    });

    render(
      <HeaderSessionActions
        isPending={false}
        onLogoutAction={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Проверка сессии пользователя")).toBeInTheDocument();
    expect(screen.queryByLabelText("Открыть меню пользователя")).not.toBeInTheDocument();
    expect(screen.queryByText("Войти")).not.toBeInTheDocument();
  });

  it("shows auth actions after session check when user is absent", () => {
    useUserStore.setState({
      hasCheckedSession: true,
      user: null,
    });

    render(
      <HeaderSessionActions
        isPending={false}
        onLogoutAction={vi.fn()}
      />,
    );

    expect(screen.getByText("Войти")).toBeInTheDocument();
    expect(screen.queryByLabelText("Открыть меню пользователя")).not.toBeInTheDocument();
  });

  it("shows user menu only after checked authenticated session", () => {
    useUserStore.setState({
      hasCheckedSession: true,
      user: mockUser,
    });

    render(
      <HeaderSessionActions
        isPending={false}
        onLogoutAction={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Открыть меню пользователя")).toBeInTheDocument();
    expect(screen.queryByText("Войти")).not.toBeInTheDocument();
  });
});
