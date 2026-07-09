"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { forgotPassword } from "@/src/features/auth/api";
import {
  profileContactFormSchema,
  requestProfileDataExport,
  updateProfile,
} from "@/src/features/profile";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { formatPhoneNumber, normalizePhoneInputValue } from "@/src/shared/lib/format-phone-number";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { PhoneInput } from "@/src/shared/ui/phone-input";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { maskEmail, maskPhone, PrivacyDataRow } from "./settings-privacy-parts";
import { FieldError, SettingsSection } from "./settings-shared";

type ContactFormValues = {
  email: string;
  phoneNumber?: string;
};

type EditablePrivacyField = "email" | "phone" | "password";

export function PrivacySettingsPage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [visibleFields, setVisibleFields] = useState({
    email: false,
    password: false,
    phone: false,
  });
  const [editingField, setEditingField] = useState<EditablePrivacyField | null>(null);
  const [isSubmittingContacts, setIsSubmittingContacts] = useState(false);
  const [isRequestingData, setIsRequestingData] = useState(false);
  const [isSendingPasswordEmail, setIsSendingPasswordEmail] = useState(false);
  const {
    handleConfirmVerification,
    handleResendVerification,
    handleVerificationCodeChange,
    isConfirmingVerification,
    isResendingVerification,
    isVerificationDialogOpen,
    openVerificationDialog,
    resendCooldownSeconds,
    setIsVerificationDialogOpen,
    verificationCode,
  } = useEmailVerification();
  const initialValues = useMemo<ContactFormValues>(() => ({
    email: user?.email ?? "",
    phoneNumber: formatPhoneNumber(user?.phoneNumber),
  }), [user?.email, user?.phoneNumber]);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(profileContactFormSchema),
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const closeEditor = () => {
    reset(initialValues);
    setEditingField(null);
  };

  const updateContacts = async (values: ContactFormValues) => {
    if (user === null) {
      return;
    }

    const previousUser = user;
    const previousEmail = user.email;

    setIsSubmittingContacts(true);

    try {
      const updatedUser = await updateProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        aboutMe: user.aboutMe,
        email: values.email,
        phoneNumber: normalizePhoneInputValue(values.phoneNumber),
      });

      setUser(updatedUser);
      setEditingField(null);

      if (previousEmail !== updatedUser.email && !updatedUser.emailVerifiedAt) {
        openVerificationDialog();
        toast.success("Контактные данные обновлены. Новый email нужно подтвердить.");
      } else {
        toast.success("Контактные данные обновлены.");
      }
    } catch (error) {
      setUser(previousUser);
      toast.error(extractApiError(error, "Не удалось обновить контактные данные."));
    } finally {
      setIsSubmittingContacts(false);
    }
  };

  const handleDataExportRequest = async () => {
    setIsRequestingData(true);

    try {
      const result = await requestProfileDataExport();

      toast.success(result.message);
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить запрос данных."));
    } finally {
      setIsRequestingData(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!user?.email) {
      return;
    }

    setIsSendingPasswordEmail(true);

    try {
      await forgotPassword({ email: user.email });
      setEditingField(null);
      toast.success("Письмо для смены пароля отправлено на email аккаунта.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить письмо для смены пароля."));
    } finally {
      setIsSendingPasswordEmail(false);
    }
  };

  const toggleVisible = (field: keyof typeof visibleFields) => {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  return (
    <div className="max-w-3xl">
      <SettingsSection
        description="Здесь собраны чувствительные данные аккаунта: контакты, пароль и запрос копии персональных данных."
        icon={ShieldCheck}
        title={<>Конфиденциальность<br />и данные</>}
      >
        <div className="divide-y divide-[var(--border-soft)]">
          <PrivacyDataRow
            isVisible={visibleFields.email}
            label="Email"
            maskedValue={maskEmail(user?.email)}
            onEditAction={() => setEditingField("email")}
            onToggleAction={() => toggleVisible("email")}
            value={user?.email ?? "Не указан"}
          />

          <PrivacyDataRow
            isVisible={visibleFields.phone}
            label="Телефон"
            maskedValue={maskPhone(user?.phoneNumber)}
            onEditAction={() => setEditingField("phone")}
            onToggleAction={() => toggleVisible("phone")}
            value={formatPhoneNumber(user?.phoneNumber) || "Не указан"}
          />

          <PrivacyDataRow
            isVisible={visibleFields.password}
            label="Пароль"
            maskedValue="Скрыт"
            onEditAction={() => setEditingField("password")}
            onToggleAction={() => toggleVisible("password")}
            value="Смена через письмо"
          />

          <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Database className="text-[var(--accent)]" size={19} />
                <h2 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                  Данные пользователя
                </h2>
              </div>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                На email придет JSON-файл с текущими данными профиля и адресами.
              </p>
            </div>

            <Button
              className="w-fit rounded-2xl"
              disabled={isRequestingData || user === null}
              onClick={handleDataExportRequest}
              type="button"
              variant="secondary"
            >
              {isRequestingData ? "Отправляем..." : "Отправить запрос"}
            </Button>
          </div>
        </div>
      </SettingsSection>

      <Dialog onOpenChange={(isOpen) => (!isOpen ? closeEditor() : undefined)} open={editingField === "email"}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Изменить email</DialogTitle>
            <DialogDescription>
              После смены email потребуется повторное подтверждение кодом.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit(updateContacts)}>
            <div className="grid gap-2">
              <Label htmlFor="privacy-email">Email</Label>
              <Input id="privacy-email" placeholder="email@example.com" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>

            <DialogFooter>
              <Button onClick={closeEditor} type="button" variant="outline">
                Отменить
              </Button>
              <Button disabled={isSubmittingContacts} type="submit">
                {isSubmittingContacts ? "Сохраняем..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={(isOpen) => (!isOpen ? closeEditor() : undefined)} open={editingField === "phone"}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Изменить телефон</DialogTitle>
            <DialogDescription>
              Используйте российский номер в формате +7.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit(updateContacts)}>
            <div className="grid gap-2">
              <Label htmlFor="privacy-phone-number">Телефон</Label>
              <PhoneInput id="privacy-phone-number" {...register("phoneNumber")} />
              <FieldError message={errors.phoneNumber?.message} />
            </div>

            <DialogFooter>
              <Button onClick={closeEditor} type="button" variant="outline">
                Отменить
              </Button>
              <Button disabled={isSubmittingContacts} type="submit">
                {isSubmittingContacts ? "Сохраняем..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={(isOpen) => (!isOpen ? closeEditor() : undefined)} open={editingField === "password"}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Сменить пароль</DialogTitle>
            <DialogDescription>
              Мы отправим письмо для смены пароля на email аккаунта. Текущий пароль не отображается и не хранится в открытом виде.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={closeEditor} type="button" variant="outline">
              Отменить
            </Button>
            <Button
              disabled={isSendingPasswordEmail || !user?.email}
              onClick={handlePasswordResetRequest}
              type="button"
            >
              {isSendingPasswordEmail ? "Отправляем..." : "Отправить письмо"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {user?.email ? (
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
    </div>
  );
}
