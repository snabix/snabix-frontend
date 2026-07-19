"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { AppToaster } from "@/src/shared/ui/shadcn/toaster";
import { AppThemeProvider } from "@/src/shared/ui/theme-switcher/theme-context";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AppThemeProvider>
      <SessionProvider />
      {children}
      <AppToaster />
    </AppThemeProvider>
  );
}
