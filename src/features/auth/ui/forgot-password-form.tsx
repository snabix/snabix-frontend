"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { forgotPassword } from "@/src/features/auth/api";
import { forgotPasswordSchema } from "@/src/features/auth/lib/auth-form-schemas";
import { ForgotPasswordFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      await forgotPassword(values);
      toast.success("Если аккаунт найден, мы отправим письмо для сброса.");
    } catch (error) {
      toast.error(
        extractApiError(error, "Не удалось отправить письмо для сброса."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
        Сброс пароля
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Укажите email, и мы отправим ссылку для восстановления доступа.
      </p>

      <form
        autoComplete="off"
        className="mt-7 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="forgot-password-email">Email</Label>
          <Input
            id="forgot-password-email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <Button
          className="auth-primary-button w-full"
          disabled={isSubmitting}
          type="submit"
        >
          Отправить письмо
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Вспомнили пароль?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}
