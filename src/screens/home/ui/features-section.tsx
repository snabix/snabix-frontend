import { featureCards } from "@/src/screens/home/model/home-content";

export function FeaturesSection() {
  return (
    <section id="features" className="section-divider mt-16">
      <div className="mb-6">
        <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
          Возможности
        </p>
        <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
          Основные возможности платформы
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
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
