"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, Star, Trash2, Upload } from "lucide-react";
import type { ListingMediaItem } from "@/src/entities/listing";
import { ListingMediaUploadGrid } from "@/src/entities/listing";
import { cn } from "@/src/shared/lib/utils";

const MAX_LISTING_IMAGES = 8;

type ListingImageUploaderProps = {
  existingMedia?: ListingMediaItem[];
  files: File[];
  isDisabled?: boolean;
  onChange: (files: File[]) => void;
  onDeleteExisting?: (mediaId: number) => void;
  onReorderExisting?: (mediaId: number, direction: "left" | "right") => void;
  onSetMainExisting?: (mediaId: number) => void;
};

export function ListingImageUploader({
  existingMedia = [],
  files,
  isDisabled = false,
  onChange,
  onDeleteExisting,
  onReorderExisting,
  onSetMainExisting,
}: ListingImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previews = useMemo(
    () => files.map((file) => ({
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

    onChange([...files, ...nextFiles]);

    if (inputRef.current !== null) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (fileIndex: number) => {
    onChange(files.filter((_, index) => index !== fileIndex));
  };

  return (
    <section className="rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
            Фотографии объявления
          </h3>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            Добавьте до {MAX_LISTING_IMAGES} изображений. Первое фото будет основным в карточке.
          </p>
        </div>

        <button
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-[18px] border border-[var(--border-soft)] px-4 py-3 text-sm font-black text-[var(--brand-deep)] transition-colors",
            "hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
            (isDisabled || availableSlots <= 0) && "pointer-events-none opacity-50",
          )}
          disabled={isDisabled || availableSlots <= 0}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Upload size={17} />
          Загрузить фото
        </button>
      </div>

      <input
        accept="image/*"
        className="sr-only"
        disabled={isDisabled || availableSlots <= 0}
        multiple
        onChange={(event) => handleFilesChange(event.target.files)}
        ref={inputRef}
        type="file"
      />

      {existingMedia.length > 0 ? (
        <ExistingListingMediaGrid
          isDisabled={isDisabled}
          media={existingMedia}
          onDelete={onDeleteExisting}
          onReorder={onReorderExisting}
          onSetMain={onSetMainExisting}
        />
      ) : null}

      <ListingMediaUploadGrid
        availableSlots={availableSlots}
        isDisabled={isDisabled}
        onAdd={() => inputRef.current?.click()}
        onRemove={removeFile}
        previews={previews}
      />
    </section>
  );
}

type ExistingListingMediaGridProps = {
  isDisabled: boolean;
  media: ListingMediaItem[];
  onDelete?: (mediaId: number) => void;
  onReorder?: (mediaId: number, direction: "left" | "right") => void;
  onSetMain?: (mediaId: number) => void;
};

function ExistingListingMediaGrid({
  isDisabled,
  media,
  onDelete,
  onReorder,
  onSetMain,
}: ExistingListingMediaGridProps) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {media.map((item, index) => (
        <article
          className="group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--brand)_12%,var(--surface))]"
          key={item.id}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={item.fileName}
            className="h-full w-full object-cover"
            src={item.url}
          />

          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <button
              aria-label="Сделать фото главным"
              className={cn(
                "grid size-9 place-items-center rounded-full border border-white/35 bg-[color-mix(in_srgb,var(--brand-deep)_68%,transparent)] text-white shadow-[var(--shadow-card)] transition-colors",
                item.isMain && "bg-[var(--active-button-bg)] text-[var(--active-button-text)]",
              )}
              disabled={isDisabled || item.isMain || onSetMain === undefined}
              onClick={() => onSetMain?.(item.id)}
              type="button"
            >
              <Star size={16} fill={item.isMain ? "currentColor" : "none"} />
            </button>

            <button
              aria-label="Удалить фото"
              className="grid size-9 place-items-center rounded-full border border-white/35 bg-[color-mix(in_srgb,var(--danger)_72%,transparent)] text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--danger)]"
              disabled={isDisabled || onDelete === undefined}
              onClick={() => onDelete?.(item.id)}
              type="button"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
            <button
              aria-label="Сдвинуть фото левее"
              className="grid size-9 place-items-center rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-[var(--brand-deep)] shadow-[var(--shadow-card)] disabled:opacity-45"
              disabled={isDisabled || index === 0 || onReorder === undefined}
              onClick={() => onReorder?.(item.id, "left")}
              type="button"
            >
              <ArrowLeft size={16} />
            </button>

            <span className="rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-1 text-xs font-black text-[var(--brand-deep)] shadow-[var(--shadow-card)]">
              {item.isMain ? "Главное" : `Фото ${index + 1}`}
            </span>

            <button
              aria-label="Сдвинуть фото правее"
              className="grid size-9 place-items-center rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-[var(--brand-deep)] shadow-[var(--shadow-card)] disabled:opacity-45"
              disabled={isDisabled || index === media.length - 1 || onReorder === undefined}
              onClick={() => onReorder?.(item.id, "right")}
              type="button"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
