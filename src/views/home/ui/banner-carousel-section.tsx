"use client";

import { Carousel } from "antd";
import { bannerSlides } from "@/src/shared/lib/mock-data";

export function BannerCarouselSection() {
  return (
    <section className="mt-16">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7d8597]">
          Баннеры платформы
        </p>
        <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
          Карусель для ключевых сообщений и промо-блоков
        </h2>
      </div>

      <Carousel autoplay dots draggable>
        {bannerSlides.map((slide) => (
          <div key={slide.title}>
            <div className="hero-shell overflow-hidden rounded-[36px] px-6 py-10 sm:px-10 sm:py-12">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {slide.accent}
                </p>
                <h3 className="font-heading mt-4 text-3xl font-extrabold text-[var(--brand-deep)] sm:text-4xl">
                  {slide.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-[#52606D]">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
