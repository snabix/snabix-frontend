import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/src/app/providers";
import { AppFooter } from "@/src/shared/ui/footer/Footer";
import { Header } from "@/src/shared/ui/header/Header";
import { themeBootstrapScript } from "@/src/shared/ui/theme-switcher/theme-bootstrap";

export const metadata: Metadata = {
    title: {
        default: "SNABIX",
        template: "%s | SNABIX",
    },
    description: "Современный marketplace для объявлений, услуг и безопасных локальных сделок.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="h-full antialiased light"
      data-scroll-behavior="smooth"
      data-theme="light"
      data-theme-mode="system"
      lang="ru"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head>
        <Script
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
          id="snabix-theme-bootstrap"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
