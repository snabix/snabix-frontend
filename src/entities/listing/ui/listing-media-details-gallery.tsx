"use client";

import { ImageIcon, Maximize2 } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { MediaImage } from "@/src/shared/ui/media-image";
import { ListingMediaPlaceholder } from "./listing-media-placeholder";
import { ListingMediaPreviewDialog } from "./listing-media-preview-dialog";

type ListingMediaDetailsGalleryProps = {
  activeImage: string;
  activeIndex: number;
  hasMultipleImages: boolean;
  hasRealImages: boolean;
  hiddenImagesCount: number;
  images: string[];
  isPreviewOpen: boolean;
  onActiveIndexChangeAction: (index: number) => void;
  onNextAction: () => void;
  onOpenPreviewAction: (index: number) => void;
  onPreviewOpenChangeAction: (isOpen: boolean) => void;
  onPreviousAction: () => void;
  previewImages: string[];
  title: string;
};

export function ListingMediaDetailsGallery({
  activeImage,
  activeIndex,
  hasMultipleImages,
  hasRealImages,
  hiddenImagesCount,
  images,
  isPreviewOpen,
  onActiveIndexChangeAction,
  onNextAction,
  onOpenPreviewAction,
  onPreviewOpenChangeAction,
  onPreviousAction,
  previewImages,
  title,
}: ListingMediaDetailsGalleryProps) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_92px]">
        <button
          aria-label="Открыть просмотр фотографий"
          className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand)_10%,var(--surface)),color-mix(in_srgb,var(--brand-deep)_7%,var(--surface)))] p-3 text-left shadow-[var(--shadow-card)]"
          disabled={!hasRealImages}
          onClick={() => onOpenPreviewAction(activeIndex)}
          type="button"
        >
          {activeImage ? (
            <MediaImage
              alt={title}
              className="object-contain p-3"
              fill
              priority
              sizes="(min-width: 1024px) 70vw, 100vw"
              src={activeImage}
            />
          ) : (
            <ListingMediaPlaceholder />
          )}

          {hasRealImages ? (
            <span className="absolute right-4 top-4 z-30 grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-deep)_62%,transparent)] text-white shadow-[var(--shadow-card)]">
              <Maximize2 size={18} />
            </span>
          ) : null}

          {hasMultipleImages ? (
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
          ) : null}
        </button>

        <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[520px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:pr-1">
          {previewImages.map((image, index) => {
            const isRemainderPreview = images.length > 4 && index === 4;
            const targetIndex = isRemainderPreview ? 4 : index;

            return (
              <button
                aria-label={isRemainderPreview
                  ? `Показать ещё ${hiddenImagesCount} изображений`
                  : `Показать изображение ${index + 1}`}
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-[var(--surface)] p-1 transition lg:size-[84px]",
                  activeIndex === targetIndex
                    ? "border-[var(--accent)] ring-4 ring-[var(--accent-soft)]"
                    : "border-[var(--border-soft)] hover:border-[var(--accent)]",
                )}
                key={`${image}-${index}`}
                onClick={() => {
                  onActiveIndexChangeAction(targetIndex);
                  if (isRemainderPreview) {
                    onOpenPreviewAction(targetIndex);
                  }
                }}
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

                {isRemainderPreview ? (
                  <span className="absolute inset-1 grid place-items-center rounded-xl bg-[color-mix(in_srgb,var(--brand-deep)_68%,transparent)] text-lg font-black text-white">
                    +{hiddenImagesCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <ListingMediaPreviewDialog
        activeImage={activeImage}
        activeIndex={activeIndex}
        hasMultipleImages={hasMultipleImages}
        isOpen={isPreviewOpen}
        onNextAction={onNextAction}
        onOpenChangeAction={onPreviewOpenChangeAction}
        onPreviousAction={onPreviousAction}
        title={title}
      />
    </>
  );
}
