"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { clearCookieSessionState } from "@/src/shared/lib/auth-session";
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
      clearCookieSessionState();
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
        "sticky top-0 z-40 mb-5 px-3 pt-3 sm:mb-6 sm:px-4",
        "bg-transparent",
        "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        isHeaderHidden ? "-translate-y-[120%]" : "translate-y-0",
      ].join(" ")}
    >
      <Container>
        <div className="surface-card flex items-center justify-between gap-6 rounded-[30px] px-4 py-4 sm:px-6">
          <div className="flex items-center gap-5 ">
            <Logo />

            <nav className="hidden items-center gap-1 lg:flex">
              <CatalogToggleButton
                isOpen={isCatalogOpen}
                onToggle={toggleCatalog}
              />
              <HeaderLink href="/about">О проекте</HeaderLink>
              <HeaderLink href="/blog">Новости</HeaderLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <HeaderSessionActions
              isPending={isPending}
              onLogoutAction={handleLogout}
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
      className="rounded-full px-4 py-2 text-sm font-black text-[var(--brand-deep)] transition-colors hover:text-[var(--accent)]"
      href={href}
    >
      {children}
    </Link>
  );
}
