"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/src/shared/lib/utils";
import { MediaImage } from "@/src/shared/ui/media-image";

type ListingMediaCardGalleryProps = {
  activeImage: string;
  activeIndex: number;
  detailsHref?: string;
  hasMultipleImages: boolean;
  images: string[];
  onActiveIndexChange: (index: number) => void;
  title: string;
};

export function ListingMediaCardGallery({
  activeImage,
  activeIndex,
  detailsHref,
  hasMultipleImages,
  images,
  onActiveIndexChange,
  title,
}: ListingMediaCardGalleryProps) {
  const router = useRouter();

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
        <div className="absolute inset-0 bg-[var(--surface-muted)]" />
      )}

      {hasMultipleImages ? (
        <>
          <div
            aria-label="Переключение фотографий объявления при наведении"
            className="pointer-events-auto absolute inset-x-0 bottom-0 top-14 z-30 grid"
            style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
          >
            {images.map((image, index) => (
              <button
                aria-label={`Показать фото ${index + 1}`}
                className="cursor-pointer"
                key={`${image}-${index}`}
                onClick={(event) => {
                  if (detailsHref === undefined) {
                    onActiveIndexChange(index);
                    return;
                  }

                  event.preventDefault();
                  router.push(detailsHref);
                }}
                onMouseEnter={() => onActiveIndexChange(index)}
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
