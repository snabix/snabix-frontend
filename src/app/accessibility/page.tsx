import type { Metadata } from "next";
import { LegalPage, legalPages } from "@/src/screens/legal/ui/legal-page";

export const metadata: Metadata = {
  title: "Доступность",
  description: legalPages.accessibility.description,
};

export default function AccessibilityPage() {
  return <LegalPage content={legalPages.accessibility} />;
}
