"use client";

import { useState } from "react";
import { cn } from "@/src/shared/lib/utils";

type ListingImageCarouselProps = {
  imageUrl?: string | null;
  imageUrls?: string[];
  title: string;
  viewMode?: "grid" | "list";
};

export function ListingImageCarousel({
  imageUrl,
  imageUrls,
  title,
}: ListingImageCarouselProps) {
  const images = normalizeImages(imageUrl, imageUrls);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  return (
    <div className="absolute inset-0">
      {images[activeIndex] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${title}. Фото ${activeIndex + 1} из ${images.length}`}
          className="h-full w-full object-cover"
          src={images[activeIndex]}
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

function normalizeImages(imageUrl?: string | null, imageUrls?: string[]): string[] {
  const uniqueImages = new Set<string>();

  if (imageUrl) {
    uniqueImages.add(imageUrl);
  }

  imageUrls?.forEach((url) => {
    if (url) {
      uniqueImages.add(url);
    }
  });

  return Array.from(uniqueImages);
}
