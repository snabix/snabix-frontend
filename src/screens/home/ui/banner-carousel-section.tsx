"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannerSlides } from "@/src/shared/lib/mock-data";
import { Button } from "@/src/shared/ui/shadcn/button";

export function BannerCarouselSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const intervalId = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [emblaApi]);

  return (
    <section className="section-divider mt-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
            Баннеры платформы
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
            Карусель для ключевых сообщений и промо-блоков
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            aria-label="Предыдущий баннер"
            className="size-11 rounded-full p-0"
            onClick={scrollPrev}
            type="button"
            variant="outline"
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            aria-label="Следующий баннер"
            className="size-11 rounded-full p-0"
            onClick={scrollNext}
            type="button"
            variant="outline"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bannerSlides.map((slide) => (
            <div className="min-w-0 shrink-0 grow-0 basis-full pl-0" key={slide.title}>
              <div className="hero-shell overflow-hidden rounded-[36px] px-6 py-10 sm:px-10 sm:py-12">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {slide.accent}
                </p>
                <h3 className="font-heading mt-4 text-3xl font-extrabold text-[var(--brand-deep)] sm:text-4xl">
                  {slide.title}
                </h3>
                <p className="section-copy mt-4 text-base leading-8">
                  {slide.description}
                </p>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {bannerSlides.map((slide, index) => {
          const isActive = index === selectedIndex;

          return (
            <button
              aria-label={`Перейти к баннеру ${index + 1}`}
              className={[
                "h-2.5 rounded-full transition-all duration-200",
                isActive
                  ? "w-8 bg-[var(--brand)]"
                  : "w-2.5 bg-[color-mix(in_srgb,var(--brand)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--brand)_36%,transparent)]",
              ].join(" ")}
              key={slide.title}
              onClick={() => scrollTo(index)}
              type="button"
            />
          );
        })}
      </div>
    </section>
  );
}
