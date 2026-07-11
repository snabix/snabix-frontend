import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import { HeaderSessionActions } from "@/src/shared/ui/header/HeaderSessionActions";

vi.mock("@/src/shared/ui/theme-switcher/ThemeSwitcher", () => ({
  ThemeSwitcher: ({ compact }: { compact?: boolean }) => (
    <button
      aria-label="Переключить тему"
      data-compact={compact ? "true" : "false"}
      type="button"
    />
  ),
}));

const mockUser: User = {
  id: "1",
  email: "user@example.com",
  firstName: "Ivan",
  lastName: "Petrov",
  description: null,
  dateOfBirth: null,
  phoneNumber: "+79990000000",
  addresses: [],
  isActive: true,
  emailVerifiedAt: "2026-05-11T00:00:00Z",
  avatar: null,
};

function renderHeaderSessionActions() {
  return render(
    <HeaderSessionActions
      isPending={false}
      isSearchOpen={false}
      onLogoutAction={vi.fn()}
      onSearchOpenChangeAction={vi.fn()}
    />,
  );
}

describe("HeaderSessionActions", () => {
  beforeEach(() => {
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("does not expose user menu before session check is finished", () => {
    useUserStore.setState({
      hasCheckedSession: false,
      user: mockUser,
    });

    renderHeaderSessionActions();

    expect(screen.getByLabelText("Проверка сессии пользователя")).toBeInTheDocument();
    expect(screen.queryByLabelText("Открыть меню пользователя")).not.toBeInTheDocument();
    expect(screen.queryByText("Войти")).not.toBeInTheDocument();
  });

  it("shows auth actions after session check when user is absent", () => {
    useUserStore.setState({
      hasCheckedSession: true,
      user: null,
    });

    renderHeaderSessionActions();

    expect(screen.getByText("Войти")).toBeInTheDocument();
    expect(screen.queryByLabelText("Открыть меню пользователя")).not.toBeInTheDocument();
  });

  it("shows user menu only after checked authenticated session", async () => {
    useUserStore.setState({
      hasCheckedSession: true,
      user: mockUser,
    });

    renderHeaderSessionActions();

    expect(screen.getByLabelText("Открыть меню пользователя")).toBeInTheDocument();
    expect(screen.queryByText("Войти")).not.toBeInTheDocument();

    fireEvent.pointerDown(screen.getByLabelText("Открыть меню пользователя"), {
      button: 0,
      ctrlKey: false,
    });

    expect(await screen.findByText("Настройки")).toBeInTheDocument();
    expect(screen.getByText("Тема")).toBeInTheDocument();
    expect(screen.getByLabelText("Переключить тему")).toHaveAttribute("data-compact", "true");
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });
});
