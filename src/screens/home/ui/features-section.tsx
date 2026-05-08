import { featureCards } from "@/src/shared/lib/mock-data";

export function FeaturesSection() {
  return (
    <section id="features" className="mt-16">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7d8597]">
          Возможности
        </p>
        <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
          Несколько важных блоков для наполнения главной страницы
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {featureCards.map((card) => (
          <article
            key={card.title}
            className="surface-card interactive-lift rounded-[30px] p-6"
          >
            <h3 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#667085]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
