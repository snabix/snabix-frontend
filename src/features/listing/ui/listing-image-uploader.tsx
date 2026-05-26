"use client";

import { useEffect, useMemo, useRef } from "react";
import { Upload } from "lucide-react";
import { ListingMediaUploadGrid } from "@/src/entities/listing";
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
