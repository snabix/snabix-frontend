import type { ReactNode } from "react";
import { SettingsShell } from "@/src/screens/account/settings/ui/settings-shell";

type SettingsRouteLayoutProps = {
  children: ReactNode;
};

export default function SettingsRouteLayout({ children }: SettingsRouteLayoutProps) {
  return <SettingsShell>{children}</SettingsShell>;
}
