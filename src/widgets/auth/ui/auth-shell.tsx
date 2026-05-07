import type { ReactNode } from "react";
import { Container } from "@/src/shared/ui/container";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <PublicLayout>
      <main className="flex min-h-[calc(100vh-180px)] items-center py-10 sm:py-14">
        <Container>
          <div className="mx-auto w-full max-w-[440px]">{children}</div>
        </Container>
      </main>
    </PublicLayout>
  );
}
