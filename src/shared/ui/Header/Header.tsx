"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { clearAuthSession } from "@/src/shared/lib/auth-session";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { CategoryCatalog } from "@/src/shared/ui/Header/CategoryCatalog";
import { CatalogToggleButton } from "@/src/shared/ui/Header/CatalogToggleButton";
import { HeaderAuthActions } from "@/src/shared/ui/Header/HeaderAuthActions";
import { HeaderUserMenu } from "@/src/shared/ui/Header/HeaderUserMenu";
import { useHeaderState } from "@/src/shared/ui/Header/use-header-state";
import { ThemeSwitcher } from "@/src/shared/ui/ThemeSwitcher/ThemeSwitcher";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export function Header() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);
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
      clearAuthSession();
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
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {!hasCheckedSession ? (
              <div className="flex items-center gap-3">
                <div className="h-11 w-28 rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]" />
                <div className="h-11 w-32 rounded-[18px] bg-[color-mix(in_srgb,var(--brand)_14%,transparent)]" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <HeaderUserMenu
                  isPending={isPending}
                  onLogout={handleLogout}
                  user={user}
                />
              </div>
            ) : (
              <HeaderAuthActions />
            )}
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
