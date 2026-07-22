"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";
import { CatalogToggleButton } from "./CatalogToggleButton";
import { CategoryCatalog } from "./CategoryCatalog";
import { HeaderSessionActions } from "./HeaderSessionActions";
import { useHeaderState } from "./use-header-state";

export function Header() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      clearUser("signed-out");
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
        <div
          className="surface-card flex items-center justify-between gap-2 rounded-[var(--radius-surface)] px-3 py-3 sm:gap-3 sm:px-5"
          data-testid="marketplace-header"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Logo variant="wordmark" />

            <nav className="hidden items-center gap-1 lg:flex">
              <CatalogToggleButton
                isOpen={isCatalogOpen}
                onToggle={toggleCatalog}
              />
              <HeaderLink href="/about">О проекте</HeaderLink>
              <HeaderLink href="/blog">Новости</HeaderLink>
            </nav>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-3">
            <HeaderSessionActions
              isSearchOpen={isSearchOpen}
              isPending={isPending}
              onSearchOpenChange={setIsSearchOpen}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </Container>

      <CategoryCatalog
        isOpen={isCatalogOpen}
        onToggle={toggleCatalog}
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
      className="rounded-[var(--radius-control)] px-4 py-2 text-sm font-black text-[var(--brand-deep)] transition-colors hover:text-[var(--accent)]"
      href={href}
    >
      {children}
    </Link>
  );
}
