import type { ReactNode } from "react";
import { AppFooter } from "@/src/shared/ui/Footer/Footer";
import { Header } from "@/src/shared/ui/Header/Header";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </>
  );
}
