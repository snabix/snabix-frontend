import type { Metadata } from "next";
import { LegalPage, legalPages } from "@/src/screens/legal/ui/legal-page";

export const metadata: Metadata = {
  title: "Файлы cookie",
  description: legalPages.cookies.description,
};

export default function CookiesPage() {
  return <LegalPage content={legalPages.cookies} />;
}
