"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePassword } from "@/src/features/auth/api";
import { changePasswordSchema } from "@/src/features/auth/lib/auth-form-schemas";
import type { ChangePasswordFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { FormField } from "@/src/shared/ui/form-field";
import { Button } from "@/src/shared/ui/shadcn/button";
import { PasswordInput } from "@/src/shared/ui/shadcn/password-input";

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await changePassword(values);

      reset();
      toast.success(result.message || "Пароль обновлен.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось обновить пароль."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      autoComplete="on"
      className="grid gap-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        error={errors.currentPassword?.message}
        id="current-password"
        label="Текущий пароль"
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            autoComplete="current-password"
            placeholder="Введите текущий пароль"
            required
            {...register("currentPassword")}
          />
        )}
      </FormField>

      <FormField
        description="Используйте не менее 8 символов."
        error={errors.password?.message}
        id="new-password"
        label="Новый пароль"
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            autoComplete="new-password"
            placeholder="Не менее 8 символов"
            required
            {...register("password")}
          />
        )}
      </FormField>

      <FormField
        error={errors.passwordConfirmation?.message}
        id="new-password-confirmation"
        label="Повторите новый пароль"
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            autoComplete="new-password"
            placeholder="Повторите новый пароль"
            required
            {...register("passwordConfirmation")}
          />
        )}
      </FormField>

      <Button
        className="h-12 rounded-2xl text-[var(--active-button-text)]"
        disabled={isSubmitting}
        type="submit"
      >
        <KeyRound aria-hidden="true" size={16} />
        {isSubmitting ? "Обновляем..." : "Обновить пароль"}
      </Button>
    </form>
  );
}
