import Link from "next/link";
import { GitBranch, Send } from "lucide-react";
import { Container } from "@/src/shared/ui/container";

const socialLinks = [
  { label: "Telegram", href: "#", icon: Send },
  { label: "GitHub", href: "#", icon: GitBranch },
];

const legalLinks = [
  { label: "Конфиденциальность", href: "/privacy" },
  { label: "Доступность", href: "/accessibility" },
  { label: "Файлы cookie", href: "/cookies" },
  { label: "Политика и положения", href: "/policies" },
];

const additionalLinks = [
  { label: "Поддержка", href: "#" },
  { label: "Профиль", href: "/account/profile" },
];

export function AppFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border-soft)] bg-[var(--surface)] py-10">
      <Container>
        <div className="grid items-start gap-9 md:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_1fr_1fr]">
          <section aria-labelledby="footer-brand-title">
            <Link
              aria-label="На главную Snabix"
              className="inline-flex items-center rounded-2xl text-2xl font-black tracking-[-0.06em] text-[var(--brand-deep)] transition hover:text-[var(--accent)]"
              href="/"
            >
              SNABIX
            </Link>

            <h2 className="sr-only" id="footer-brand-title">
              Snabix
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--text-muted)]">
              SNABIX — современная платформа объявлений и локальных
              предложений, которую мы строим как удобный, чистый и
              масштабируемый продукт.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    aria-label={link.label}
                    className={[
                      "grid size-11 place-items-center rounded-2xl",
                      "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)]",
                      "text-[var(--brand-deep)] transition-all duration-200",
                      "hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[var(--shadow-card)]",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
                    ].join(" ")}
                    href={link.href}
                    key={link.label}
                  >
                    <Icon aria-hidden="true" size={19} strokeWidth={2.25} />
                  </Link>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="footer-platform-title">
            <h2
              className="font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--brand-deep)]"
              id="footer-platform-title"
            >
              Платформа
            </h2>
            <Link
              className="mt-5 inline-flex text-sm font-semibold text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--brand-deep)]"
              href="/about"
            >
              О SNABIX
            </Link>
          </section>

          <section aria-labelledby="footer-legal-title">
            <h2
              className="font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--brand-deep)]"
              id="footer-legal-title"
            >
              Правовая информация
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  className="text-sm font-semibold text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--brand-deep)]"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="footer-additional-title">
            <h2
              className="font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--brand-deep)]"
              id="footer-additional-title"
            >
              Дополнительная информация
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              {additionalLinks.map((link) => (
                <Link
                  className="text-sm font-semibold text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--brand-deep)]"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-[var(--border-soft)] pt-6 text-sm text-[var(--text-muted)]">
          © 2026 Snabix. Все права защищены.
        </div>
      </Container>
    </footer>
  );
}
