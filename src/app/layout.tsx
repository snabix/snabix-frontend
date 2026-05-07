import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { Providers } from "@/src/app/providers";

export const metadata: Metadata = {
  title: {
    default: "Snabix",
    template: "%s | Snabix",
  },
  description: "Современный marketplace для объявлений, услуг и безопасных локальных сделок.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full">
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
