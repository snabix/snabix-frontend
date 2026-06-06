"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/src/entities/category";
import { CategoryTiltCard } from "./category-tilt-card";

export function CategoryShowcaseCarouselSection() {
  const roots = useCategoryStore((state) => state.roots);
  const loadRoots = useCategoryStore((state) => state.loadRoots);

  useEffect(() => {
    void loadRoots();
  }, [loadRoots]);

  if (roots.length === 0) {
    return null;
  }

  return (
    <section className="category-conveyor mt-8">
      <div className="mb-5">
        <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
          Популярные направления
        </p>
        <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
          Категории, с которых удобно начать поиск
        </h2>
      </div>

      <div className="category-conveyor-viewport -mx-2 overflow-hidden px-2 py-8">
        <div className="category-conveyor-track flex w-max">
          {[0, 1].map((groupIndex) => (
            <div
              aria-hidden={groupIndex === 1 ? true : undefined}
              className="flex shrink-0 gap-3 pr-3"
              key={groupIndex}
            >
              {roots.map((category) => (
                <div
                  className="w-[184px] shrink-0 sm:w-[196px] lg:w-[208px]"
                  key={`${groupIndex}-${category.id}`}
                >
                  <CategoryTiltCard
                    href={`/listings?categoryId=${category.id}`}
                    imageUrl={category.icon}
                    title={category.name}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
