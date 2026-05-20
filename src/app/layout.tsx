import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/src/app/providers";

export const metadata: Metadata = {
    title: {
        default: "SNABIX",
        template: "%s | SNABIX",
    },
    description: "Современный marketplace для объявлений, услуг и безопасных локальных сделок.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" data-scroll-behavior="smooth" lang="ru" suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
