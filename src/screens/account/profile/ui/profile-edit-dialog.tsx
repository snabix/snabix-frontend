import { useRef } from "react";
import { Pencil, Save } from "lucide-react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/src/shared/ui/shadcn/button";
import { FormField } from "@/src/shared/ui/form-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";
import { Input } from "@/src/shared/ui/shadcn/input";
import type { ProfileFormValues } from "@/src/screens/account/profile/ui/profile-types";

type ProfileEditDialogProps = {
  errors: FieldErrors<ProfileFormValues>;
  handleCancel: () => void;
  handleSubmit: UseFormHandleSubmit<ProfileFormValues>;
  isOpen: boolean;
  isSubmitting: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  register: UseFormRegister<ProfileFormValues>;
};

export function ProfileEditDialog({
  errors,
  handleCancel,
  handleSubmit,
  isOpen,
  isSubmitting,
  onOpenChange,
  onSubmit,
  register,
}: ProfileEditDialogProps) {
  const firstNameInputRef = useRef<HTMLInputElement | null>(null);
  const firstNameField = register("firstName");

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent
        className="max-w-[720px]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          firstNameInputRef.current?.focus();
        }}
      >
        <div className="pt-2">
          <DialogHeader className="mb-6">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Pencil aria-hidden="true" size={20} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Редактирование профиля
                </p>

                <DialogTitle className="mt-1">
                  Обновить данные
                </DialogTitle>

                <DialogDescription className="mt-2">
                  Измените имя, фамилию, дату рождения и краткое описание. Email, телефон и пароль находятся в настройках конфиденциальности.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            autoComplete="on"
            className="space-y-6"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                error={errors.firstName?.message}
                id="profile-first-name"
                label="Имя"
                labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
              >
                {(controlProps) => (
                  <Input
                    {...controlProps}
                    autoComplete="given-name"
                    className="profile-edit-input"
                    placeholder="Ваше имя"
                    required
                    {...firstNameField}
                    ref={(element) => {
                      firstNameField.ref(element);
                      firstNameInputRef.current = element;
                    }}
                  />
                )}
              </FormField>

              <FormField
                error={errors.lastName?.message}
                id="profile-last-name"
                label="Фамилия"
                labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
              >
                {(controlProps) => (
                  <Input
                    {...controlProps}
                    autoComplete="family-name"
                    className="profile-edit-input"
                    placeholder="Ваша фамилия"
                    required
                    {...register("lastName")}
                  />
                )}
              </FormField>

              <FormField
                error={errors.dateOfBirth?.message}
                id="profile-date-of-birth"
                label="Дата рождения"
                labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
              >
                {(controlProps) => (
                  <Input
                    {...controlProps}
                    autoComplete="bday"
                    className="profile-edit-input"
                    type="date"
                    {...register("dateOfBirth")}
                  />
                )}
              </FormField>
            </div>

            <FormField
              error={errors.description?.message}
              id="profile-description"
              label="О себе"
              labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
            >
              {(controlProps) => (
                <textarea
                  {...controlProps}
                  className="profile-edit-input min-h-32 w-full resize-y px-4 py-3 text-sm text-[var(--brand-deep)] focus-visible:outline-none"
                  placeholder="Расскажите, чем занимаетесь, с какими товарами или услугами работаете"
                  {...register("description")}
                />
              )}
            </FormField>

            <DialogFooter>
              <Button
                disabled={isSubmitting}
                onClick={handleCancel}
                type="button"
                variant="outline"
              >
                Отменить
              </Button>

              <Button
                className="auth-primary-button"
                disabled={isSubmitting}
                type="submit"
              >
                <Save size={17} />
                Сохранить изменения
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
