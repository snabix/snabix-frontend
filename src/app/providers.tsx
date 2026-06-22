"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { AppToaster } from "@/src/shared/ui/shadcn/toaster";
import { TimeBasedThemeSync } from "@/src/shared/ui/theme-switcher/time-based-theme-sync";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem={false}
    >
      <TimeBasedThemeSync />
      <SessionProvider />
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}
