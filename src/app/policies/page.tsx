import type { Metadata } from "next";
import { LegalPage, legalPages } from "@/src/screens/legal/ui/legal-page";

export const metadata: Metadata = {
  title: "Политика и положения",
  description: legalPages.policies.description,
};

export default function PoliciesPage() {
  return <LegalPage content={legalPages.policies} />;
}
