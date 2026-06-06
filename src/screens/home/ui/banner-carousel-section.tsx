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
    <section className="mt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
              <div className="inverted-surface relative min-h-[420px] overflow-hidden rounded-[36px] border-0 shadow-[var(--shadow-soft)] outline-none ring-0 sm:min-h-[500px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.12] transition-transform duration-700 ease-out hover:scale-[1.02]"
                  src={slide.imageUrl}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--palette-midnight)_90%,transparent),color-mix(in_srgb,var(--palette-midnight)_58%,transparent),color-mix(in_srgb,var(--palette-midnight)_18%,transparent))]" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--palette-midnight)_80%,transparent),transparent)]" />

                <div className="relative z-10 flex min-h-[420px] max-w-4xl flex-col justify-end px-6 py-8 sm:min-h-[500px] sm:px-10 sm:py-12">
                  <p className="w-fit rounded-full border border-white/22 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/78 backdrop-blur">
                    {slide.accent}
                  </p>
                  <h3 className="font-heading mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl">
                    {slide.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/76">
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
