import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGuard } from "@/src/features/auth/session/auth-guard";
import { useUserStore } from "@/src/entities/user";
import type { User } from "@/src/entities/user/model/types";

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/account/profile",
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

describe("AuthGuard", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("renders children for authenticated user", () => {
    useUserStore.setState({
      hasCheckedSession: true,
      isLoading: false,
      user: mockUser,
    });

    const { getByText } = render(
      <AuthGuard>
        <div>Account content</div>
      </AuthGuard>,
    );

    expect(getByText("Account content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated user to sign-in with redirect path", async () => {
    useUserStore.setState({
      hasCheckedSession: true,
      isLoading: false,
      user: null,
    });

    render(
      <AuthGuard>
        <div>Account content</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(
        "/sign-in?redirectTo=%2Faccount%2Fprofile",
      );
    });
  });
});
