"use client";

import { Save, UserRound } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { ProfileEditField } from "@/src/screens/account/profile/ui/profile-parts";
import { PhoneInput } from "@/src/shared/ui/phone-input";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { FieldError, SettingsSection } from "./settings-shared";

export function ProfileSettingsPage() {
  const user = useUserStore((state) => state.user);
  const {
    handleConfirmVerification,
    handleResendVerification,
    handleVerificationCodeChange,
    isConfirmingVerification,
    isEmailVerified,
    isResendingVerification,
    isVerificationDialogOpen,
    openVerificationDialog,
    resendCooldownSeconds,
    setIsVerificationDialogOpen,
    verificationCode,
  } = useEmailVerification();
  const {
    errors,
    handleProfileSubmit,
    handleSubmit,
    isSubmitting,
    register,
  } = useProfileEditor({
    onEmailVerificationRequired: openVerificationDialog,
  });

  return (
    <>
      <SettingsSection
        description="Редактирование профиля теперь находится в настройках. Эти данные используются для аккаунта и будущего публичного профиля продавца."
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

            <ProfileEditField label="Email">
              <Label className="sr-only" htmlFor="settings-email">
                Email
              </Label>
              <Input id="settings-email" placeholder="email@example.com" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </ProfileEditField>

            <ProfileEditField label="Телефон">
              <Label className="sr-only" htmlFor="settings-phone-number">
                Телефон
              </Label>
              <PhoneInput id="settings-phone-number" {...register("phoneNumber")} />
              <FieldError message={errors.phoneNumber?.message} />
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

      {user?.email && !isEmailVerified ? (
        <EmailVerificationDialog
          code={verificationCode}
          cooldownSeconds={resendCooldownSeconds}
          email={user.email}
          isConfirming={isConfirmingVerification}
          isOpen={isVerificationDialogOpen}
          isSending={isResendingVerification}
          onCodeChangeAction={handleVerificationCodeChange}
          onConfirmAction={handleConfirmVerification}
          onOpenChangeAction={setIsVerificationDialogOpen}
          onResendAction={handleResendVerification}
        />
      ) : null}
    </>
  );
}
