import { Laptop } from "lucide-react";
import { ThemeSwitcher } from "@/src/shared/ui/theme-switcher";
import { SettingsSection } from "./settings-shared";

export function AccountSettingsPage() {
  return (
    <SettingsSection
      description="Настройки, которые применяются к интерфейсу на этом устройстве."
      icon={Laptop}
      title="Аккаунт"
    >
      <div className="border-t border-[var(--border-soft)] py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-black text-[var(--brand-deep)]">
              Тема интерфейса
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              Выбранная тема сохраняется для следующих посещений.
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </SettingsSection>
  );
}
