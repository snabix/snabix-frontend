"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { blogHeroSlides } from "@/src/screens/blog/model/posts";
import { MediaImage } from "@/src/shared/ui/media-image";

export function BlogHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeSlide = blogHeroSlides[activeIndex] ?? blogHeroSlides[0];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % blogHeroSlides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [isPlaying]);

  if (!activeSlide) {
    return null;
  }

  return (
    <section className="inverted-surface relative h-[600px] overflow-hidden rounded-[30px] border shadow-[var(--shadow-soft)] max-sm:h-[500px]">
      {blogHeroSlides.map((slide, index) => (
        <div
          aria-hidden={activeIndex !== index}
          className={[
            "absolute inset-0 transition-opacity duration-700 ease-out",
            activeIndex === index ? "opacity-100" : "opacity-0",
          ].join(" ")}
          key={slide.title}
        >
          <MediaImage
            alt=""
            className="object-cover grayscale"
            fill
            sizes="100vw"
            src={slide.imageUrl}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--palette-midnight)_92%,transparent)_0%,color-mix(in_srgb,var(--palette-midnight)_68%,transparent)_45%,color-mix(in_srgb,var(--palette-midnight)_22%,transparent)_100%)]" />
        </div>
      ))}

      <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-white/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-16 size-52 rounded-full bg-[var(--brand)]/30 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
          <span>Snabix journal</span>
          <button
            aria-label={isPlaying ? "Остановить баннер" : "Запустить баннер"}
            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/28 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/18"
            onClick={() => setIsPlaying((value) => !value)}
            type="button"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>

        <div className="max-w-5xl">
          <p className="mb-5 inline-flex rounded-full border border-white/28 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/78 backdrop-blur">
            {activeSlide.badge}
          </p>
          <h1 className="font-heading max-w-4xl text-[clamp(2.6rem,6.5vw,5.8rem)] font-black uppercase leading-[0.82] tracking-[-0.09em]">
            {activeSlide.title}
          </h1>
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,540px)_auto] lg:items-end">
            <p className="text-sm font-semibold leading-7 text-white/74 sm:text-base">
              {activeSlide.description}
            </p>
            <div className="flex items-center gap-3">
              {blogHeroSlides.map((slide, index) => (
                <button
                  aria-label={`Открыть слайд ${index + 1}: ${slide.title}`}
                  className={[
                    "h-2 rounded-full transition-all",
                    activeIndex === index ? "w-12 bg-white" : "w-2 bg-white/36 hover:bg-white/64",
                  ].join(" ")}
                  key={slide.title}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/64">
          <span>Новости · инструкции · архитектура</span>
          <span className="inline-flex items-center gap-2">
            Читать ниже
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </section>
  );
}
