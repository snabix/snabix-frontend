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
  const deep = "#004643";
  const light = "#FAFAFA";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: deep,
          colorInfo: isDark ? light : deep,
          colorSuccess: isDark ? light : deep,
          colorWarning: isDark ? light : deep,
          colorError: isDark ? light : deep,
          borderRadius: 18,
          colorText: isDark ? light : deep,
          colorTextSecondary: isDark
            ? "rgba(250, 250, 250, 0.74)"
            : "rgba(0, 70, 67, 0.66)",
          colorBorder: isDark
            ? "rgba(250, 250, 250, 0.16)"
            : "rgba(0, 70, 67, 0.12)",
          colorBgContainer: isDark ? deep : light,
          colorBgElevated: isDark ? deep : light,
          colorLink: isDark ? light : deep,
          colorLinkHover: isDark ? light : deep,
          colorLinkActive: isDark ? light : deep,
          fontFamily: "Inter, Segoe UI, sans-serif",
        },
        components: {
          Button: {
            controlHeight: 46,
            fontWeight: 600,
          },
          Input: {
            controlHeight: 50,
            activeBorderColor: isDark ? light : deep,
            hoverBorderColor: isDark ? light : deep,
          },
          Checkbox: {
            colorPrimary: isDark ? light : deep,
          },
          Form: {
            labelColor: isDark ? light : deep,
          },
          Dropdown: {
            colorBgElevated: isDark ? deep : light,
            colorText: isDark ? light : deep,
            controlPaddingHorizontal: 12,
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
