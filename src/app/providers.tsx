"use client";

import type { ReactNode } from "react";
import { App, ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { SessionProvider } from "@/src/features/auth/session/session-provider";

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
      <AntdThemeProvider>{children}</AntdThemeProvider>
    </ThemeProvider>
  );
}

function AntdThemeProvider({ children }: ProvidersProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#c50337",
          colorInfo: "#021c4f",
          colorSuccess: "#0f766e",
          colorWarning: "#b45309",
          colorError: "#c50337",
          borderRadius: 18,
          colorText: isDark ? "#edf2f7" : "#102443",
          colorTextSecondary: isDark ? "#a4b1ca" : "#5e6f8f",
          colorBorder: isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(2, 28, 79, 0.12)",
          colorBgContainer: isDark ? "#081125" : "#ffffff",
          fontFamily: "Inter, Segoe UI, sans-serif",
        },
        components: {
          Button: {
            controlHeight: 46,
            fontWeight: 600,
          },
          Input: {
            controlHeight: 50,
            activeBorderColor: "#c50337",
            hoverBorderColor: "#36508a",
          },
          Checkbox: {
            colorPrimary: "#c50337",
          },
          Form: {
            labelColor: isDark ? "#edf2f7" : "#021c4f",
          },
        },
      }}
    >
      <App>
        <SessionProvider />
        {children}
      </App>
    </ConfigProvider>
  );
}
