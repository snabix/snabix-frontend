"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/src/features/auth/session/session-provider";
import { AppToaster } from "@/src/shared/ui/shadcn/toaster";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <SessionProvider />
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}
