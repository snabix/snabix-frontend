import type { ReactNode } from "react";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";

type AccountRouteLayoutProps = {
  children: ReactNode;
};

export default function AccountRouteLayout({ children }: AccountRouteLayoutProps) {
  return <AccountLayout>{children}</AccountLayout>;
}
