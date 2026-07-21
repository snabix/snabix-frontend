"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  type ContactFormValues,
  type EditablePrivacyField,
  PrivacySettingsDialogs,
} from "./privacy-settings-dialogs";
import { maskEmail, maskPhone, PrivacyDataRow } from "./settings-privacy-parts";
import { SettingsSection } from "./settings-shared";

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
  const emailEditButtonRef = useRef<HTMLButtonElement | null>(null);
  const passwordEditButtonRef = useRef<HTMLButtonElement | null>(null);
  const phoneEditButtonRef = useRef<HTMLButtonElement | null>(null);
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
    setFocus,
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
        description: user.description,
        dateOfBirth: user.dateOfBirth,
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
    <div className="w-full">
      <SettingsSection
        description="Здесь собраны чувствительные данные аккаунта: контакты, пароль и запрос копии персональных данных."
        icon={ShieldCheck}
        title={<>Конфиденциальность<br />и данные</>}
      >
        <div className="divide-y divide-[var(--border-soft)]">
          <PrivacyDataRow
            editButtonRef={emailEditButtonRef}
            isVisible={visibleFields.email}
            label="Email"
            maskedValue={maskEmail(user?.email)}
            onEdit={() => setEditingField("email")}
            onToggle={() => toggleVisible("email")}
            value={user?.email ?? "Не указан"}
          />

          <PrivacyDataRow
            editButtonRef={phoneEditButtonRef}
            isVisible={visibleFields.phone}
            label="Телефон"
            maskedValue={maskPhone(user?.phoneNumber)}
            onEdit={() => setEditingField("phone")}
            onToggle={() => toggleVisible("phone")}
            value={formatPhoneNumber(user?.phoneNumber) || "Не указан"}
          />

          <PrivacyDataRow
            canToggle={false}
            editButtonRef={passwordEditButtonRef}
            isVisible={visibleFields.password}
            label="Пароль"
            maskedValue="Смена через письмо"
            onEdit={() => setEditingField("password")}
            onToggle={() => toggleVisible("password")}
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

      <PrivacySettingsDialogs
        editingField={editingField}
        editButtonRefs={{
          email: emailEditButtonRef,
          password: passwordEditButtonRef,
          phone: phoneEditButtonRef,
        }}
        errors={errors}
        handleSubmit={handleSubmit}
        isSendingPasswordEmail={isSendingPasswordEmail}
        isSubmittingContacts={isSubmittingContacts}
        onClose={closeEditor}
        onPasswordResetRequest={handlePasswordResetRequest}
        onUpdateContacts={updateContacts}
        register={register}
        setFocus={setFocus}
        userEmail={user?.email}
      />

      {user?.email ? (
        <EmailVerificationDialog
          code={verificationCode}
          cooldownSeconds={resendCooldownSeconds}
          email={user.email}
          isConfirming={isConfirmingVerification}
          isOpen={isVerificationDialogOpen}
          isSending={isResendingVerification}
          onCodeChange={handleVerificationCodeChange}
          onConfirm={handleConfirmVerification}
          onOpenChange={setIsVerificationDialogOpen}
          onResend={handleResendVerification}
          returnFocusRef={emailEditButtonRef}
        />
      ) : null}
    </div>
  );
}
