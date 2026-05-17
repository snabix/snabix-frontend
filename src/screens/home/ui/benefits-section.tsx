import { benefitCards } from "@/src/shared/lib/mock-data";

export function BenefitsSection() {
  return (
    <section id="benefits" className="section-divider mt-16">
      <div className="section-panel rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
          Почему это важно
        </p>
        <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
          Строим не просто экран, а фундамент будущего продукта
        </h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {benefitCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] p-5"
            >
              <h3 className="font-heading text-xl font-extrabold text-[var(--brand-deep)]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
