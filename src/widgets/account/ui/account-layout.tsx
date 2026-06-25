"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/src/features/auth/session/auth-guard";
import { Container } from "@/src/shared/ui/container";
import { AccountSidebar } from "@/src/widgets/account/ui/account-sidebar";
import { AccountSidebarStateProvider } from "@/src/widgets/account/ui/account-sidebar-state";

type AccountLayoutProps = {
  children: ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const isSettingsSection = pathname.startsWith("/account/settings");
  const isCreateListingRoute = pathname === "/account/listings/create";
  const isListingDetailsRoute = /^\/account\/listings\/[^/]+$/.test(pathname);

  if (isCreateListingRoute || isListingDetailsRoute) {
    return (
      <main className="min-h-screen">
        <AuthGuard>{children}</AuthGuard>
      </main>
    );
  }

  return (
    <main className="py-6">
      <AccountSidebarStateProvider>
        <Container className={isSettingsSection ? "block" : "flex gap-5"}>
          {!isSettingsSection ? (
            <div className="hidden lg:block">
              <AccountSidebar />
            </div>
          ) : null}
          <section className="min-w-0 flex-1">
            <AuthGuard>{children}</AuthGuard>
          </section>
        </Container>
      </AccountSidebarStateProvider>
    </main>
  );
}
