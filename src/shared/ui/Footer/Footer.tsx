import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export function AppFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border-soft)] bg-[var(--surface)] py-8">
      <Container>
        <div>
          <Logo />
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Snabix — современная платформа объявлений и локальных предложений,
            которую мы строим как удобный, чистый и масштабируемый продукт.
          </p>
          <div className="mt-8 border-t border-[var(--border-soft)] pt-6 text-sm text-[var(--text-muted)]">
            © 2026 Snabix. Все права защищены.
          </div>
        </div>
      </Container>
    </footer>
  );
}
