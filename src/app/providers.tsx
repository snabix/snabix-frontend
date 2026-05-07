"use client";

import type { ReactNode } from "react";
import { App, ConfigProvider } from "antd";
import { SessionProvider } from "@/src/features/auth/session/session-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c50337",
          colorInfo: "#021c4f",
          colorSuccess: "#0f766e",
          colorWarning: "#b45309",
          colorError: "#c50337",
          borderRadius: 18,
          colorText: "#102443",
          colorTextSecondary: "#5e6f8f",
          colorBorder: "rgba(2, 28, 79, 0.12)",
          colorBgContainer: "#ffffff",
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
            labelColor: "#021c4f",
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
