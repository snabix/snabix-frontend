export type AvatarDraft = {
  file: File;
  previewUrl: string;
};

export type AvatarOffset = {
  x: number;
  y: number;
};

export const AVATAR_CANVAS_SIZE = 512;
export const AVATAR_EDITOR_SIZE = 360;
export const AVATAR_MAX_OFFSET = 128;

export function clampAvatarOffset(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

async function createImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Не удалось открыть изображение."));
    image.src = src;
  });
}

export async function createEditedAvatarFile(
  draft: AvatarDraft,
  scale: number,
  offset: AvatarOffset,
): Promise<File> {
  if (draft.file.type === "image/svg+xml") {
    return draft.file;
  }

  const image = await createImageElement(draft.previewUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Не удалось подготовить изображение.");
  }

  canvas.width = AVATAR_CANVAS_SIZE;
  canvas.height = AVATAR_CANVAS_SIZE;

  const baseScale = Math.max(
    AVATAR_CANVAS_SIZE / image.width,
    AVATAR_CANVAS_SIZE / image.height,
  );
  const targetScale = baseScale * scale;
  const width = image.width * targetScale;
  const height = image.height * targetScale;
  const offsetRatio = AVATAR_CANVAS_SIZE / AVATAR_EDITOR_SIZE;
  const x = (AVATAR_CANVAS_SIZE - width) / 2 + offset.x * offsetRatio;
  const y = (AVATAR_CANVAS_SIZE - height) / 2 + offset.y * offsetRatio;

  context.drawImage(image, x, y, width, height);

  const type = draft.file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Не удалось сохранить изображение."));
          return;
        }

        resolve(result);
      },
      type,
      0.92,
    );
  });

  return new File([blob], draft.file.name, {
    lastModified: Date.now(),
    type,
  });
}
