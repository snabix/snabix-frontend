export function AboutSection() {
  return (
    <section id="about" className="mt-16">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card rounded-[34px] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7d8597]">
            Кто мы такие
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold text-[var(--brand-deep)]">
            Мы создаём аккуратную и современную платформу локальных объявлений.
          </h2>
        </div>
        <div className="surface-card rounded-[34px] p-6 sm:p-8">
          <p className="text-base leading-8 text-[#52606D]">
            Наша цель — сделать продукт, который ощущается не как шаблонная
            доска объявлений, а как полноценный digital-сервис: с красивым
            интерфейсом, ясной структурой, удобной навигацией и архитектурой,
            готовой к росту.
          </p>
        </div>
      </div>
    </section>
  );
}
