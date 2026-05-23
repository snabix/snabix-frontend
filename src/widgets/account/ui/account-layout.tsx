import type { ReactNode } from "react";
import { AuthGuard } from "@/src/features/auth/session/auth-guard";
import { Container } from "@/src/shared/ui/container";
import { AccountSidebar } from "@/src/widgets/account/ui/account-sidebar";

type AccountLayoutProps = {
  children: ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <main className="py-6">
      <Container className="flex gap-5">
        <div className="hidden lg:block">
          <AccountSidebar />
        </div>
        <section className="min-w-0 flex-1">
          <AuthGuard>{children}</AuthGuard>
        </section>
      </Container>
    </main>
  );
}
