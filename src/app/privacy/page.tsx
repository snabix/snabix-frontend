import type { Metadata } from "next";
import { LegalPage, legalPages } from "@/src/screens/legal/ui/legal-page";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: legalPages.privacy.description,
};

export default function PrivacyPage() {
  return <LegalPage content={legalPages.privacy} />;
}
