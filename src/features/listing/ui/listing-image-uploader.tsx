"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

const MAX_LISTING_IMAGES = 8;

type ListingImageUploaderProps = {
  files: File[];
  isDisabled?: boolean;
  onChange: (files: File[]) => void;
};

export function ListingImageUploader({
  files,
  isDisabled = false,
  onChange,
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
  const availableSlots = MAX_LISTING_IMAGES - files.length;

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

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {previews.map((preview, index) => (
          <div
            className="group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--brand)_12%,var(--surface))]"
            key={preview.id}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={preview.name}
              className="h-full w-full object-cover"
              src={preview.url}
            />
            <button
              aria-label={`Удалить фото ${preview.name}`}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-deep)_72%,transparent)] text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--brand-deep)]"
              onClick={() => removeFile(index)}
              type="button"
            >
              <X size={16} />
            </button>
            {index === 0 ? (
              <span className="absolute bottom-3 left-3 rounded-full bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-3 py-1 text-xs font-black text-[var(--brand-deep)]">
                Главное фото
              </span>
            ) : null}
          </div>
        ))}

        {Array.from({ length: Math.max(availableSlots, 0) }).map((_, index) => (
          <button
            aria-label="Добавить фото объявления"
            className="grid aspect-[4/3] place-items-center rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--brand-deep)]"
            disabled={isDisabled}
            key={`empty-${index}`}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <span className="grid justify-items-center gap-2 text-sm font-black">
              <ImagePlus size={24} />
              Фото
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
