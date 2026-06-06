import { act, renderHook, waitFor } from "@testing-library/react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import { useAvatarEditor } from "@/src/screens/account/profile/model/use-avatar-editor";

const {
  createEditedAvatarFileMock,
  uploadProfileAvatarMock,
  toastErrorMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  createEditedAvatarFileMock: vi.fn(),
  uploadProfileAvatarMock: vi.fn(),
  toastErrorMock: vi.fn<(message: string) => void>(),
  toastSuccessMock: vi.fn<(message: string) => void>(),
}));

vi.mock("@/src/features/profile", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/profile")>(
    "@/src/features/profile",
  );

  return {
    ...actual,
    createEditedAvatarFile: createEditedAvatarFileMock,
    uploadProfileAvatar: uploadProfileAvatarMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
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
  avatar: {
    id: 7,
    url: "https://cdn.snabix.test/old-avatar.png",
    fileName: "old-avatar.png",
    mimeType: "image/png",
    size: 1024,
    humanReadableSize: "1 KB",
  },
};

function createFile(
  name: string,
  type: string,
  size?: number,
): File {
  const file = new File(["avatar"], name, { type });

  if (size !== undefined) {
    Object.defineProperty(file, "size", {
      configurable: true,
      value: size,
    });
  }

  return file;
}

function createFileChangeEvent(file: File) {
  return {
    target: {
      files: [file],
      value: "avatar.png",
    },
  } as unknown as ChangeEvent<HTMLInputElement>;
}

function dispatchPointerEvent(
  type: "pointermove" | "pointerup",
  options: { clientX?: number; clientY?: number } = {},
) {
  window.dispatchEvent(new MouseEvent(type, options));
}

describe("useAvatarEditor", () => {
  beforeEach(() => {
    createEditedAvatarFileMock.mockReset();
    uploadProfileAvatarMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);

    vi.stubGlobal(
      "URL",
      {
        createObjectURL: vi.fn(() => "blob:avatar-preview"),
        revokeObjectURL: vi.fn(),
      },
    );
  });

  it("rejects files larger than 3 MB", async () => {
    const { result } = renderHook(() => useAvatarEditor());

    await act(async () => {
      await result.current.handleAvatarChange(
        createFileChangeEvent(
          createFile("big-avatar.png", "image/png", 3 * 1024 * 1024 + 1),
        ),
      );
    });

    expect(result.current.avatarDraft).toBeNull();
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Размер аватара не должен превышать 3 МБ.",
    );
  });

  it("rejects non-image files", async () => {
    const { result } = renderHook(() => useAvatarEditor());

    await act(async () => {
      await result.current.handleAvatarChange(
        createFileChangeEvent(createFile("document.pdf", "application/pdf")),
      );
    });

    expect(result.current.avatarDraft).toBeNull();
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Для аватара можно загрузить только изображение.",
    );
  });

  it("creates avatar draft and resets scale and offset for selected image", async () => {
    const { result } = renderHook(() => useAvatarEditor());

    act(() => {
      result.current.setAvatarScale(1.8);
    });

    act(() => {
      result.current.handleAvatarMovePointerDown({
        clientX: 10,
        clientY: 10,
        preventDefault: vi.fn(),
      } as unknown as ReactPointerEvent<HTMLDivElement>);
    });

    act(() => {
      dispatchPointerEvent("pointermove", { clientX: 90, clientY: 60 });
      dispatchPointerEvent("pointerup");
    });

    await waitFor(() => {
      expect(result.current.avatarOffset).toEqual({ x: 80, y: 50 });
    });

    await act(async () => {
      await result.current.handleAvatarChange(
        createFileChangeEvent(createFile("avatar.png", "image/png")),
      );
    });

    expect(result.current.avatarDraft?.previewUrl).toBe("blob:avatar-preview");
    expect(result.current.avatarScale).toBe(1);
    expect(result.current.avatarOffset).toEqual({ x: 0, y: 0 });
    expect(result.current.isAvatarViewerOpen).toBe(true);
  });

  it("passes scale and offset to edited avatar generation", async () => {
    const editedFile = createFile("edited-avatar.png", "image/png", 2048);
    const updatedUser: User = {
      ...mockUser,
      avatar: {
        id: 8,
        url: "https://cdn.snabix.test/new-avatar.png",
        fileName: "new-avatar.png",
        mimeType: "image/png",
        size: 2048,
        humanReadableSize: "2 KB",
      },
    };

    createEditedAvatarFileMock.mockResolvedValue(editedFile);
    uploadProfileAvatarMock.mockResolvedValue(updatedUser);
    useUserStore.getState().setUser(mockUser);

    const { result } = renderHook(() => useAvatarEditor());

    await act(async () => {
      await result.current.handleAvatarChange(
        createFileChangeEvent(createFile("avatar.png", "image/png")),
      );
    });

    act(() => {
      result.current.setAvatarScale(1.6);
      result.current.handleAvatarMovePointerDown({
        clientX: 20,
        clientY: 20,
        preventDefault: vi.fn(),
      } as unknown as ReactPointerEvent<HTMLDivElement>);
    });

    act(() => {
      dispatchPointerEvent("pointermove", { clientX: 60, clientY: 5 });
      dispatchPointerEvent("pointerup");
    });

    await waitFor(() => {
      expect(result.current.avatarOffset).toEqual({ x: 40, y: -15 });
    });

    await act(async () => {
      await result.current.handleAvatarSave();
    });

    expect(createEditedAvatarFileMock).toHaveBeenCalledWith(
      expect.objectContaining({ previewUrl: "blob:avatar-preview" }),
      1.6,
      { x: 40, y: -15 },
    );
    expect(uploadProfileAvatarMock).toHaveBeenCalledWith(editedFile);
    expect(useUserStore.getState().user).toEqual(updatedUser);
    expect(toastSuccessMock).toHaveBeenCalledWith("Аватар обновлен.");
  });

  it("rolls back optimistic avatar when upload fails", async () => {
    createEditedAvatarFileMock.mockResolvedValue(
      createFile("edited-avatar.png", "image/png", 2048),
    );
    uploadProfileAvatarMock.mockRejectedValue(new Error("Upload failed"));
    useUserStore.getState().setUser(mockUser);

    const { result } = renderHook(() => useAvatarEditor());

    await act(async () => {
      await result.current.handleAvatarChange(
        createFileChangeEvent(createFile("avatar.png", "image/png")),
      );
    });

    await act(async () => {
      await result.current.handleAvatarSave();
    });

    expect(useUserStore.getState().user).toEqual(mockUser);
    expect(toastErrorMock).toHaveBeenCalledWith("Не удалось обновить аватар.");
  });
});
