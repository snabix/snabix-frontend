"use client";

import { useState } from "react";
import { ImageIcon, ImagePlus, X } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { MediaImage } from "@/src/shared/ui/media-image";

type ListingMediaGalleryProps = {
  imageUrl?: string | null;
  imageUrls?: string[];
  mode?: "card" | "details";
  title: string;
};

type ListingMediaUploadGridProps = {
  availableSlots: number;
  isDisabled?: boolean;
  onAddAction: () => void;
  onRemoveAction: (index: number) => void;
  previews: Array<{
    id: string;
    name: string;
    url: string;
  }>;
};

export function ListingMediaGallery({
  imageUrl,
  imageUrls,
  mode = "card",
  title,
}: ListingMediaGalleryProps) {
  const images = normalizeListingImages(imageUrl, imageUrls);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0] ?? "";
  const hasMultipleImages = images.length > 1;

  if (mode === "details") {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_92px]">
        <div className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_10%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_7%,var(--surface)))] p-3 shadow-[var(--shadow-card)]">
          {activeImage ? (
            <MediaImage
              alt={title}
              className="object-contain p-3"
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              src={activeImage}
            />
          ) : (
            <ListingMediaPlaceholder />
          )}

          {hasMultipleImages ? (
            <>
              <div
                aria-label="Переключение фотографий объявления"
                className="absolute inset-x-0 bottom-0 top-0 z-20 grid"
                style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
              >
                {images.map((image, index) => (
                  <button
                    aria-label={`Показать фото ${index + 1}`}
                    className="cursor-pointer"
                    key={`${image}-details-zone-${index}`}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    type="button"
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 flex w-36 -translate-x-1/2 gap-1.5">
                {images.map((image, index) => (
                  <span
                    className={cn(
                      "h-1.5 flex-1 rounded-full bg-[color-mix(in_srgb,var(--surface)_58%,transparent)] transition",
                      index === activeIndex && "bg-white",
                    )}
                    key={`${image}-details-indicator-${index}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[520px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:pr-1">
          {images.map((image, index) => (
            <button
              aria-label={`Показать изображение ${index + 1}`}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-[var(--surface)] p-1 transition lg:size-[84px]",
                activeIndex === index
                  ? "border-[var(--accent)] ring-4 ring-[var(--accent-soft)]"
                  : "border-[var(--border-soft)] hover:border-[var(--accent)]",
              )}
              key={`${image}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              {image ? (
                <MediaImage
                  alt={`${title} ${index + 1}`}
                  className="rounded-xl object-contain p-1"
                  fill
                  sizes="84px"
                  src={image}
                />
              ) : (
                <span className="grid h-full place-items-center text-[var(--text-muted)]">
                  <ImageIcon size={20} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {activeImage ? (
        <MediaImage
          alt={`${title}. Фото ${activeIndex + 1} из ${images.length}`}
          className="object-cover"
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 100vw"
          src={activeImage}
        />
      ) : (
        <>
          <div className="absolute -right-8 -top-10 size-28 rounded-full bg-[color-mix(in_srgb,var(--foreground)_18%,transparent)] blur-sm" />
          <div className="absolute bottom-5 left-5 h-16 w-32 rounded-[26px] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)]" />
        </>
      )}

      {hasMultipleImages ? (
        <>
          <div
            aria-label="Переключение фотографий объявления при наведении"
            className="pointer-events-auto absolute inset-x-0 bottom-0 top-14 z-20 hidden sm:grid"
            style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
          >
            {images.map((image, index) => (
              <button
                aria-label={`Показать фото ${index + 1}`}
                className="cursor-pointer"
                key={`${image}-${index}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onMouseEnter={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>

          <div className="absolute bottom-3 left-1/2 z-30 flex w-28 -translate-x-1/2 gap-1.5">
            {images.map((image, index) => (
              <span
                className={cn(
                  "h-1 flex-1 rounded-full bg-[color-mix(in_srgb,var(--surface)_54%,transparent)] transition",
                  index === activeIndex && "bg-white",
                )}
                key={`${image}-indicator-${index}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function normalizeListingImages(imageUrl?: string | null, imageUrls?: string[]): string[] {
  const uniqueImages = new Set<string>();

  if (imageUrl) {
    uniqueImages.add(imageUrl);
  }

  imageUrls?.forEach((url) => {
    if (url) {
      uniqueImages.add(url);
    }
  });

  const images = Array.from(uniqueImages);

  return images.length > 0 ? images : [""];
}

export function ListingMediaUploadGrid({
  availableSlots,
  isDisabled = false,
  onAddAction,
  onRemoveAction,
  previews,
}: ListingMediaUploadGridProps) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {previews.map((preview, index) => (
        <div
          className="group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--brand)_12%,var(--surface))]"
          key={preview.id}
        >
          <MediaImage
            alt={preview.name}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={preview.url}
          />
          <button
            aria-label={`Удалить фото ${preview.name}`}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-deep)_72%,transparent)] text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--brand-deep)]"
            onClick={() => onRemoveAction(index)}
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
          onClick={onAddAction}
          type="button"
        >
          <span className="grid justify-items-center gap-2 text-sm font-black">
            <ImagePlus size={24} />
            Фото
          </span>
        </button>
      ))}
    </div>
  );
}

function ListingMediaPlaceholder() {
  return (
    <div className="grid justify-items-center gap-3 text-[var(--text-muted)]">
      <ImageIcon size={42} />
      <span className="text-sm font-black">Изображения пока не загружены</span>
    </div>
  );
}
