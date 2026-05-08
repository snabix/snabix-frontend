import type { ReactNode } from "react";
import { Header } from "@/src/shared/ui/Header/Header";
import { AccountSidebar } from "@/src/widgets/account/ui/account-sidebar";

type AccountLayoutProps = {
  children: ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <>
      <Header />
      <main className="px-3 py-6 sm:px-4">
        <div className="mx-auto flex w-full max-w-7xl gap-5">
          <div className="hidden lg:block">
            <AccountSidebar />
          </div>
          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </main>
    </>
  );
}
