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
import { Button } from "@/src/shared/ui/shadcn/button";
import { Label } from "@/src/shared/ui/shadcn/label";
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
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="current-password">Текущий пароль</Label>
        <PasswordInput
          id="current-password"
          placeholder="Введите текущий пароль"
          {...register("currentPassword")}
        />
        {errors.currentPassword ? (
          <p className="text-sm text-[var(--danger)]">
            {errors.currentPassword.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new-password">Новый пароль</Label>
        <PasswordInput
          id="new-password"
          placeholder="Не менее 8 символов"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-[var(--danger)]">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new-password-confirmation">Повторите новый пароль</Label>
        <PasswordInput
          id="new-password-confirmation"
          placeholder="Повторите новый пароль"
          {...register("passwordConfirmation")}
        />
        {errors.passwordConfirmation ? (
          <p className="text-sm text-[var(--danger)]">
            {errors.passwordConfirmation.message}
          </p>
        ) : null}
      </div>

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
