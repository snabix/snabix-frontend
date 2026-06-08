import { Save, Pencil } from "lucide-react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";
import { PhoneInput } from "@/src/shared/ui/phone-input";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { ProfileEditField } from "@/src/screens/account/profile/ui/profile-parts";
import type { ProfileFormValues } from "@/src/screens/account/profile/ui/profile-types";

type ProfileEditDialogProps = {
  errors: FieldErrors<ProfileFormValues>;
  handleCancel: () => void;
  handleSubmit: UseFormHandleSubmit<ProfileFormValues>;
  isOpen: boolean;
  isSubmitting: boolean;
  onOpenChangeAction: (isOpen: boolean) => void;
  onSubmitAction: (values: ProfileFormValues) => Promise<void>;
  register: UseFormRegister<ProfileFormValues>;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-[var(--danger)]">
      {message}
    </p>
  );
}

export function ProfileEditDialog({
  errors,
  handleCancel,
  handleSubmit,
  isOpen,
  isSubmitting,
  onOpenChangeAction,
  onSubmitAction,
  register,
}: ProfileEditDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChangeAction} open={isOpen}>
      <DialogContent className="max-w-[720px]">
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
                  Измените только нужные поля. После смены email потребуется повторное подтверждение.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmitAction)}>
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileEditField label="Имя">
                <Label className="sr-only" htmlFor="profile-first-name">
                  Имя
                </Label>
                <Input
                  className="profile-edit-input"
                  id="profile-first-name"
                  placeholder="Ваше имя"
                  {...register("firstName")}
                />
                <FieldError message={errors.firstName?.message} />
              </ProfileEditField>

              <ProfileEditField label="Фамилия">
                <Label className="sr-only" htmlFor="profile-last-name">
                  Фамилия
                </Label>
                <Input
                  className="profile-edit-input"
                  id="profile-last-name"
                  placeholder="Ваша фамилия"
                  {...register("lastName")}
                />
                <FieldError message={errors.lastName?.message} />
              </ProfileEditField>

              <ProfileEditField label="Email">
                <Label className="sr-only" htmlFor="profile-email">
                  Email
                </Label>
                <Input
                  className="profile-edit-input"
                  id="profile-email"
                  placeholder="email@example.com"
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </ProfileEditField>

              <ProfileEditField label="Телефон">
                <Label className="sr-only" htmlFor="profile-phone-number">
                  Телефон
                </Label>
                <PhoneInput
                  className="profile-edit-input"
                  id="profile-phone-number"
                  {...register("phoneNumber")}
                />
                <FieldError message={errors.phoneNumber?.message} />
              </ProfileEditField>
            </div>

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
