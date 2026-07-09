"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { AppToaster } from "@/src/shared/ui/shadcn/toaster";
import { AppThemeProvider } from "@/src/shared/ui/theme-switcher/theme-context";
import { TimeBasedThemeSync } from "@/src/shared/ui/theme-switcher/time-based-theme-sync";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AppThemeProvider>
      <TimeBasedThemeSync />
      <SessionProvider />
      {children}
      <AppToaster />
    </AppThemeProvider>
  );
}
