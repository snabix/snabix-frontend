"use client";

import { Save, UserRound } from "lucide-react";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import { ProfileEditField } from "@/src/screens/account/profile/ui/profile-parts";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { FieldError, SettingsSection } from "./settings-shared";

export function ProfileSettingsPage() {
  const {
    errors,
    handleProfileSubmit,
    handleSubmit,
    isSubmitting,
    register,
  } = useProfileEditor({
    onEmailVerificationRequired: () => undefined,
  });

  return (
    <SettingsSection
      description="Редактирование профиля теперь находится в настройках. Здесь остаются публичные и нейтральные данные: имя и фамилия."
      icon={UserRound}
      title="Профиль"
    >
      <form className="grid gap-5" onSubmit={handleSubmit(handleProfileSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileEditField label="Имя">
            <Label className="sr-only" htmlFor="settings-first-name">
              Имя
            </Label>
            <Input id="settings-first-name" placeholder="Ваше имя" {...register("firstName")} />
            <FieldError message={errors.firstName?.message} />
          </ProfileEditField>

          <ProfileEditField label="Фамилия">
            <Label className="sr-only" htmlFor="settings-last-name">
              Фамилия
            </Label>
            <Input id="settings-last-name" placeholder="Ваша фамилия" {...register("lastName")} />
            <FieldError message={errors.lastName?.message} />
          </ProfileEditField>
        </div>

        <div className="flex justify-end">
          <Button className="w-fit rounded-2xl" disabled={isSubmitting} type="submit">
            <Save size={17} />
            {isSubmitting ? "Сохраняем..." : "Сохранить профиль"}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
