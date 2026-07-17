import { useRef, type RefObject } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetFocus,
} from "react-hook-form";
import { FormField } from "@/src/shared/ui/form-field";
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

export type ContactFormValues = {
  email: string;
  phoneNumber?: string;
};

export type EditablePrivacyField = "email" | "phone" | "password";

type PrivacySettingsDialogsProps = {
  editingField: EditablePrivacyField | null;
  editButtonRefs: Record<
    EditablePrivacyField,
    RefObject<HTMLButtonElement | null>
  >;
  errors: FieldErrors<ContactFormValues>;
  handleSubmit: UseFormHandleSubmit<ContactFormValues>;
  isSendingPasswordEmail: boolean;
  isSubmittingContacts: boolean;
  onCloseAction: () => void;
  onPasswordResetRequestAction: () => void;
  onUpdateContactsAction: (values: ContactFormValues) => Promise<void>;
  register: UseFormRegister<ContactFormValues>;
  setFocus: UseFormSetFocus<ContactFormValues>;
  userEmail?: string | null;
};

export function PrivacySettingsDialogs({
  editingField,
  editButtonRefs,
  errors,
  handleSubmit,
  isSendingPasswordEmail,
  isSubmittingContacts,
  onCloseAction,
  onPasswordResetRequestAction,
  onUpdateContactsAction,
  register,
  setFocus,
  userEmail,
}: PrivacySettingsDialogsProps) {
  const passwordCancelButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Dialog
        onOpenChange={(isOpen) => (!isOpen ? onCloseAction() : undefined)}
        open={editingField === "email"}
      >
        <DialogContent
          className="max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            editButtonRefs.email.current?.focus();
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            setFocus("email");
          }}
        >
          <DialogHeader>
            <DialogTitle>Изменить email</DialogTitle>
            <DialogDescription>
              После смены email потребуется повторное подтверждение кодом.
            </DialogDescription>
          </DialogHeader>

          <form
            autoComplete="on"
            className="grid gap-4"
            noValidate
            onSubmit={handleSubmit(onUpdateContactsAction)}
          >
            <FormField
              error={errors.email?.message}
              id="privacy-email"
              label="Email"
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="email@example.com"
                  required
                  spellCheck={false}
                  type="email"
                  {...register("email")}
                />
              )}
            </FormField>

            <DialogFooter>
              <Button onClick={onCloseAction} type="button" variant="outline">
                Отменить
              </Button>
              <Button disabled={isSubmittingContacts} type="submit">
                {isSubmittingContacts ? "Сохраняем..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(isOpen) => (!isOpen ? onCloseAction() : undefined)}
        open={editingField === "phone"}
      >
        <DialogContent
          className="max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            editButtonRefs.phone.current?.focus();
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            setFocus("phoneNumber");
          }}
        >
          <DialogHeader>
            <DialogTitle>Изменить телефон</DialogTitle>
            <DialogDescription>
              Используйте российский номер в формате +7.
            </DialogDescription>
          </DialogHeader>

          <form
            autoComplete="on"
            className="grid gap-4"
            noValidate
            onSubmit={handleSubmit(onUpdateContactsAction)}
          >
            <FormField
              error={errors.phoneNumber?.message}
              id="privacy-phone-number"
              label="Телефон"
            >
              {(controlProps) => (
                <PhoneInput
                  {...controlProps}
                  {...register("phoneNumber")}
                />
              )}
            </FormField>

            <DialogFooter>
              <Button onClick={onCloseAction} type="button" variant="outline">
                Отменить
              </Button>
              <Button disabled={isSubmittingContacts} type="submit">
                {isSubmittingContacts ? "Сохраняем..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(isOpen) => (!isOpen ? onCloseAction() : undefined)}
        open={editingField === "password"}
      >
        <DialogContent
          className="max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            editButtonRefs.password.current?.focus();
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            passwordCancelButtonRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Сменить пароль</DialogTitle>
            <DialogDescription>
              Мы отправим письмо для смены пароля на email аккаунта. Текущий
              пароль не отображается и не хранится в открытом виде.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={onCloseAction}
              ref={passwordCancelButtonRef}
              type="button"
              variant="outline"
            >
              Отменить
            </Button>
            <Button
              disabled={isSendingPasswordEmail || !userEmail}
              onClick={onPasswordResetRequestAction}
              type="button"
            >
              {isSendingPasswordEmail ? "Отправляем..." : "Отправить письмо"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
