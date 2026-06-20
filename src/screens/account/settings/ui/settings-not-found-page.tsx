import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";
import { SettingsSection } from "./settings-shared";

export function SettingsNotFoundPage() {
  return (
    <SettingsSection
      description="Такого раздела настроек пока нет. Можно вернуться в профиль настроек."
      icon={ShieldCheck}
      title="Раздел не найден"
    >
      <Button asChild className="rounded-2xl">
        <Link href="/account/settings/profile">Открыть профиль</Link>
      </Button>
    </SettingsSection>
  );
}
