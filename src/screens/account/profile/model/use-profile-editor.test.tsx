import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import type { ProfileFormValues } from "@/src/screens/account/profile/ui/profile-types";

const {
  toastErrorMock,
  toastSuccessMock,
  updateProfileMock,
} = vi.hoisted(() => ({
  toastErrorMock: vi.fn<(message: string) => void>(),
  toastSuccessMock: vi.fn<(message: string) => void>(),
  updateProfileMock: vi.fn(),
}));

vi.mock("@/src/features/profile", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/profile")>(
    "@/src/features/profile",
  );

  return {
    ...actual,
    updateProfile: updateProfileMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const mockUser: User = {
  addresses: [],
  avatar: null,
  email: "old@example.com",
  emailVerifiedAt: "2026-05-11T00:00:00Z",
  firstName: "Ivan",
  id: "1",
  isActive: true,
  lastName: "Petrov",
  phoneNumber: "+79990000000",
};

const profileValues: ProfileFormValues = {
  email: "new@example.com",
  firstName: "Imran",
  lastName: "Magomedov",
  phoneNumber: "+79991112233",
};

describe("useProfileEditor", () => {
  beforeEach(() => {
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    updateProfileMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);
    useUserStore.getState().setUser(mockUser);
  });

  it("optimistically updates profile and confirms server state", async () => {
    const updatedUser: User = {
      ...mockUser,
      ...profileValues,
      emailVerifiedAt: null,
    };

    updateProfileMock.mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useProfileEditor({
      onEmailVerificationRequired: vi.fn(),
    }));

    await act(async () => {
      const promise = result.current.handleProfileSubmit(profileValues);

      expect(useUserStore.getState().user).toEqual(updatedUser);

      await promise;
    });

    expect(updateProfileMock).toHaveBeenCalledWith({
      email: profileValues.email,
      firstName: profileValues.firstName,
      lastName: profileValues.lastName,
      phoneNumber: profileValues.phoneNumber,
    });
    expect(useUserStore.getState().user).toEqual(updatedUser);
    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Профиль обновлен. Новый email нужно подтвердить повторно.",
    );
  });

  it("rolls back optimistic profile update when request fails", async () => {
    updateProfileMock.mockRejectedValue(new Error("Profile update failed"));

    const { result } = renderHook(() => useProfileEditor({
      onEmailVerificationRequired: vi.fn(),
    }));

    await act(async () => {
      const promise = result.current.handleProfileSubmit(profileValues);

      expect(useUserStore.getState().user).toEqual({
        ...mockUser,
        ...profileValues,
        emailVerifiedAt: null,
      });

      await promise;
    });

    await waitFor(() => {
      expect(useUserStore.getState().user).toEqual(mockUser);
    });
    expect(toastErrorMock).toHaveBeenCalledWith("Не удалось обновить профиль.");
  });
});
