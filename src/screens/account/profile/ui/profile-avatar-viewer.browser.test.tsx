import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileAvatarViewer } from "@/src/screens/account/profile/ui/profile-avatar-viewer";
import type { AvatarDraft } from "@/src/features/profile";

const avatarDraft: AvatarDraft = {
  file: new File(["avatar"], "avatar.png", { type: "image/png" }),
  previewUrl: "blob:avatar-preview",
};

const defaultProps = {
  avatarDraft,
  avatarOffset: { x: 0, y: 0 },
  avatarScale: 1,
  isAvatarSubmitting: false,
  onAvatarDraftReset: vi.fn(),
  onAvatarMovePointerDown: vi.fn(),
  onAvatarSave: vi.fn(),
  onAvatarScaleChange: vi.fn(),
  onAvatarViewerClose: vi.fn(),
};

describe("ProfileAvatarViewer browser interactions", () => {
  it("closes when user clicks outside the avatar panel", () => {
    const onAvatarViewerClose = vi.fn();
    const { container } = render(
      <ProfileAvatarViewer
        {...defaultProps}
        onAvatarViewerClose={onAvatarViewerClose}
      />,
    );

    fireEvent.click(container.firstElementChild as Element);

    expect(onAvatarViewerClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when user clicks inside the avatar panel", () => {
    const onAvatarViewerClose = vi.fn();

    render(
      <ProfileAvatarViewer
        {...defaultProps}
        onAvatarViewerClose={onAvatarViewerClose}
      />,
    );

    fireEvent.click(screen.getByText("Редактор аватара"));

    expect(onAvatarViewerClose).not.toHaveBeenCalled();
  });

  it("shows editor controls and saves selected avatar draft", () => {
    const onAvatarSave = vi.fn();

    render(
      <ProfileAvatarViewer
        {...defaultProps}
        avatarDraft={avatarDraft}
        onAvatarSave={onAvatarSave}
      />,
    );

    expect(screen.getByText("Редактор аватара")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Сохранить аватар" }));

    expect(onAvatarSave).toHaveBeenCalledTimes(1);
  });
});
