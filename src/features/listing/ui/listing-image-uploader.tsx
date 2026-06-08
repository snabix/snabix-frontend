"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, Plus, Star, Trash2 } from "lucide-react";
import type { ListingMediaItem } from "@/src/entities/listing";
import { cn } from "@/src/shared/lib/utils";

const MAX_LISTING_IMAGES = 8;

type ListingImageUploaderProps = {
  existingMedia?: ListingMediaItem[];
  files: File[];
  isDisabled?: boolean;
  onChangeAction: (files: File[]) => void;
  onDeleteExistingAction?: (mediaId: number) => void;
  onReorderExistingAction?: (mediaId: number, direction: "left" | "right") => void;
  onSetMainExistingAction?: (mediaId: number) => void;
};

export function ListingImageUploader({
  existingMedia = [],
  files,
  isDisabled = false,
  onChangeAction,
  onDeleteExistingAction,
  onReorderExistingAction,
  onSetMainExistingAction,
}: ListingImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previews = useMemo(
    () => files.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file),
    })),
    [files],
  );
  const availableSlots = MAX_LISTING_IMAGES - existingMedia.length - files.length;

  useEffect(() => () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const handleFilesChange = (selectedFiles: FileList | null) => {
    if (selectedFiles === null || availableSlots <= 0) {
      return;
    }

    const nextFiles = Array.from(selectedFiles)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, availableSlots);

    onChangeAction([...files, ...nextFiles]);

    if (inputRef.current !== null) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (fileIndex: number) => {
    onChangeAction(files.filter((_, index) => index !== fileIndex));
  };

  return (
    <section className="rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface)] p-4 sm:p-5">

      <input
        accept="image/*"
        className="sr-only"
        disabled={isDisabled || availableSlots <= 0}
        multiple
        onChange={(event) => handleFilesChange(event.target.files)}
        ref={inputRef}
        type="file"
      />

      <button
        className={cn(
          "group grid min-h-[220px] w-full place-items-center rounded-[24px] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-6 text-center transition duration-200",
          "hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))] hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
          (isDisabled || availableSlots <= 0) && "pointer-events-none opacity-50",
        )}
        disabled={isDisabled || availableSlots <= 0}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <div className="flex flex-col items-center">
          <span className="grid size-14 place-items-center rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-[var(--text-muted)] transition group-hover:text-[var(--accent)]">
            <Plus size={28} />
          </span>
          <p className="mt-5 text-[1.1rem] font-black text-[var(--brand-deep)]">Добавить фотографии</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Перетащите файлы сюда или выберите на компьютере
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            JPG, PNG, WebP до 10 МБ
          </p>
        </div>
      </button>

      {existingMedia.length > 0 || previews.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-black text-[var(--brand-deep)]">
            Загруженные файлы ({existingMedia.length + previews.length}/{MAX_LISTING_IMAGES})
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {existingMedia.map((item, index) => (
              <MediaListRow
                canMoveLeft={index > 0}
                canMoveRight={index < existingMedia.length - 1}
                isDisabled={isDisabled}
                isMain={item.isMain}
                key={`existing-${item.id}`}
                name={item.fileName}
                onDeleteAction={onDeleteExistingAction ? () => onDeleteExistingAction(item.id) : undefined}
                onMoveLeftAction={onReorderExistingAction ? () => onReorderExistingAction(item.id, "left") : undefined}
                onMoveRightAction={onReorderExistingAction ? () => onReorderExistingAction(item.id, "right") : undefined}
                onSetMainAction={onSetMainExistingAction ? () => onSetMainExistingAction(item.id) : undefined}
                statusLabel={item.isMain ? "Главное фото" : "Загружено"}
                thumbnailUrl={item.url}
              />
            ))}

            {previews.map((preview, index) => (
              <MediaListRow
                canMoveLeft={false}
                canMoveRight={false}
                isDisabled={isDisabled}
                key={preview.id}
                name={preview.name}
                onDeleteAction={() => removeFile(index)}
                statusLabel={formatFileSize(preview.file.size)}
                thumbnailUrl={preview.url}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

type MediaListRowProps = {
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  isDisabled: boolean;
  isMain?: boolean;
  name: string;
  onDeleteAction?: () => void;
  onMoveLeftAction?: () => void;
  onMoveRightAction?: () => void;
  onSetMainAction?: () => void;
  statusLabel: string;
  thumbnailUrl: string;
};

function MediaListRow({
  canMoveLeft = false,
  canMoveRight = false,
  isDisabled,
  isMain = false,
  name,
  onDeleteAction,
  onMoveLeftAction,
  onMoveRightAction,
  onSetMainAction,
  statusLabel,
  thumbnailUrl,
}: MediaListRowProps) {
  return (
    <article className="flex items-center gap-3 rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-2.5 pr-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={name}
        className="size-14 rounded-[12px] object-cover"
        src={thumbnailUrl}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--brand-deep)]">{name}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{statusLabel}</p>
      </div>

      <div className="flex items-center gap-1">
        {onSetMainAction ? (
          <button
            aria-label="Сделать фото главным"
            className={cn(
              "grid size-8 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
              isMain && "bg-[var(--accent-soft)] text-[var(--accent)]",
            )}
            disabled={isDisabled || isMain}
            onClick={onSetMainAction}
            type="button"
          >
            <Star fill={isMain ? "currentColor" : "none"} size={15} />
          </button>
        ) : null}

        {onMoveLeftAction ? (
          <button
            aria-label="Сдвинуть фото левее"
            className="grid size-8 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)] disabled:opacity-40"
            disabled={isDisabled || !canMoveLeft}
            onClick={onMoveLeftAction}
            type="button"
          >
            <ArrowLeft size={14} />
          </button>
        ) : null}

        {onMoveRightAction ? (
          <button
            aria-label="Сдвинуть фото правее"
            className="grid size-8 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)] disabled:opacity-40"
            disabled={isDisabled || !canMoveRight}
            onClick={onMoveRightAction}
            type="button"
          >
            <ArrowRight size={14} />
          </button>
        ) : null}

        <button
          aria-label="Удалить фото"
          className="grid size-8 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] disabled:opacity-40"
          disabled={isDisabled || onDeleteAction === undefined}
          onClick={onDeleteAction}
          type="button"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(0)} КБ`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
}
