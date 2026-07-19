import type { CategoryNode } from "@/src/entities/category";
import { CategoryTiltCard } from "./category-tilt-card";

type CategoryShowcaseCarouselSectionProps = {
    categories: CategoryNode[];
    errorMessage: string | null;
};

export function CategoryShowcaseCarouselSection({
    categories,
    errorMessage,
}: CategoryShowcaseCarouselSectionProps) {
    const hasCategories = categories.length > 0;

    return (
        <section className="category-conveyor mt-8 bg-transparent">
            <div className="mb-5">
                <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
                    Популярные направления
                </p>

                <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
                    Категории, с которых удобно начать поиск
                </h2>
            </div>

            {errorMessage !== null || !hasCategories ? (
                <div className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-6 py-8">
                    <p className="text-base font-black text-[var(--brand-deep)]">
                        Не удалось загрузить категории
                    </p>

                    <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-muted)]">
                        Раздел временно недоступен. Вы можете продолжить просмотр объявлений ниже или обновить страницу позже.
                    </p>
                </div>
            ) : (
                <div
                    aria-label="Популярные категории"
                    className="category-conveyor-viewport -mx-2 bg-transparent overflow-x-auto overflow-y-hidden px-2 py-8"
                    role="region"
                >
                    <div className="category-conveyor-track flex w-max">
                        {[0, 1].map((groupIndex) => (
                            <div
                                aria-hidden={groupIndex === 1 ? true : undefined}
                                className="flex shrink-0 gap-3 pr-3"
                                key={groupIndex}
                            >
                                {categories.map((category) => (
                                    <div
                                        className="w-[184px] shrink-0 sm:w-[196px] lg:w-[208px]"
                                        key={`${groupIndex}-${category.id}`}
                                    >
                                        <CategoryTiltCard
                                            href={`/?categoryId=${category.id}`}
                                            imageUrl={category.icon}
                                            title={category.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
