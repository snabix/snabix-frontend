"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { CategoryCatalog } from "@/src/shared/ui/header/CategoryCatalog";
import { CatalogToggleButton } from "@/src/shared/ui/header/CatalogToggleButton";
import { HeaderSessionActions } from "@/src/shared/ui/header/HeaderSessionActions";
import { useHeaderState } from "@/src/shared/ui/header/use-header-state";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export function Header() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [isPending, startTransition] = useTransition();
  const {
    catalogTopOffset,
    headerRef,
    isCatalogOpen,
    isHeaderHidden,
    toggleCatalog,
  } = useHeaderState();

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      toast.success("Вы вышли из аккаунта.");
      startTransition(() => {
        router.push("/");
        router.refresh();
      });
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось выйти из аккаунта."));
    }
  };

  return (
    <header
      ref={headerRef}
      className={[
        "sticky top-0 z-40 mb-5 pt-3 sm:mb-6",
        "bg-transparent",
        "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        isHeaderHidden ? "-translate-y-[120%]" : "translate-y-0",
      ].join(" ")}
    >
      <Container>
        <div className="surface-card grid items-center gap-4 rounded-[30px] px-4 py-4 sm:px-6 xl:grid-cols-[auto_minmax(260px,1fr)_auto]">
          <div className="flex items-center gap-5">
            <Logo variant="wordmark" />

            <nav className="hidden items-center gap-1 lg:flex">
              <CatalogToggleButton
                isOpen={isCatalogOpen}
                onToggleAction={toggleCatalog}
              />
              <HeaderLink href="/about">О проекте</HeaderLink>
              <HeaderLink href="/blog">Новости</HeaderLink>
            </nav>
          </div>

          <form
            action="/"
            className="hidden w-full min-w-0 max-w-[460px] items-center justify-self-center rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 py-2.5 text-[var(--brand-deep)] transition focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[var(--accent-soft)] md:flex"
          >
            <Search className="mr-3 shrink-0 text-[var(--text-muted)]" size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--text-muted)]"
              name="search"
              placeholder="Найти товары, услуги или категории"
              type="search"
            />
          </form>

          <div className="flex items-center justify-end gap-3">
            <HeaderSessionActions
              isPending={isPending}
              onLogoutAction={handleLogout}
            />
          </div>
        </div>
      </Container>

      <CategoryCatalog
        isOpen={isCatalogOpen}
        onToggleAction={toggleCatalog}
        topOffset={catalogTopOffset}
      />
    </header>
  );
}

function HeaderLink({
  children,
  href,
}: {
  children: string;
  href: string;
}) {
  return (
    <Link
      className="rounded-full px-4 py-2 text-sm font-black text-[var(--brand-deep)] transition-colors hover:text-[var(--accent)]"
      href={href}
    >
      {children}
    </Link>
  );
}
