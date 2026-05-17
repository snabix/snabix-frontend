import type { ReactNode } from "react";
import { AuthGuard } from "@/src/features/auth/session/auth-guard";
import { Header } from "@/src/shared/ui/Header/Header";
import { Container } from "@/src/shared/ui/container";
import { AccountSidebar } from "@/src/widgets/account/ui/account-sidebar";

type AccountLayoutProps = {
  children: ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_98%,var(--brand)_2%),var(--background)_38%,color-mix(in_srgb,var(--background)_94%,var(--brand)_6%))] py-6">
        <Container className="flex gap-5">
          <div className="hidden lg:block">
            <AccountSidebar />
          </div>
          <section className="min-w-0 flex-1">
            <AuthGuard>{children}</AuthGuard>
          </section>
        </Container>
      </main>
    </>
  );
}
