import {
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import {
  AVATAR_MAX_OFFSET,
  type AvatarDraft,
  type AvatarOffset,
  clampAvatarOffset,
  createEditedAvatarFile,
  uploadProfileAvatar,
} from "@/src/features/profile";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function useAvatarEditor() {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);
  const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);
  const [avatarDraft, setAvatarDraft] = useState<AvatarDraft | null>(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const [avatarOffset, setAvatarOffset] = useState<AvatarOffset>({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (avatarDraft?.previewUrl) {
        URL.revokeObjectURL(avatarDraft.previewUrl);
      }
    };
  }, [avatarDraft]);

  const resetAvatarDraft = () => {
    setAvatarDraft(null);
    setAvatarScale(1);
    setAvatarOffset({ x: 0, y: 0 });
  };

  const handleAvatarSelect = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarViewerClose = () => {
    setIsAvatarViewerOpen(false);
    resetAvatarDraft();
  };

  const handleAvatarChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Размер аватара не должен превышать 3 МБ.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Для аватара можно загрузить только изображение.");
      return;
    }

    setAvatarDraft({
      file,
      previewUrl: URL.createObjectURL(file),
    });
    setAvatarScale(1);
    setAvatarOffset({ x: 0, y: 0 });
    setIsAvatarViewerOpen(true);
  };

  const handleAvatarSave = async () => {
    if (!avatarDraft) {
      return;
    }

    setIsAvatarSubmitting(true);

    try {
      const avatarFile = await createEditedAvatarFile(
        avatarDraft,
        avatarScale,
        avatarOffset,
      );
      const updatedUser = await uploadProfileAvatar(avatarFile);

      setUser(updatedUser);
      setIsAvatarViewerOpen(false);
      resetAvatarDraft();
      toast.success("Аватар обновлен.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось обновить аватар."));
    } finally {
      setIsAvatarSubmitting(false);
    }
  };

  const handleAvatarMovePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startOffset = avatarOffset;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      setAvatarOffset({
        x: clampAvatarOffset(startOffset.x + moveEvent.clientX - startX, -AVATAR_MAX_OFFSET, AVATAR_MAX_OFFSET),
        y: clampAvatarOffset(startOffset.y + moveEvent.clientY - startY, -AVATAR_MAX_OFFSET, AVATAR_MAX_OFFSET),
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.userSelect = "";
    };

    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return {
    avatarDraft,
    avatarInputRef,
    avatarOffset,
    avatarScale,
    handleAvatarChange,
    handleAvatarMovePointerDown,
    handleAvatarSave,
    handleAvatarSelect,
    handleAvatarViewerClose,
    isAvatarSubmitting,
    isAvatarViewerOpen,
    resetAvatarDraft,
    setAvatarScale,
    setIsAvatarViewerOpen,
  };
}
