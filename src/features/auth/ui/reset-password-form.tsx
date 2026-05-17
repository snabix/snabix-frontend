"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPassword } from "@/src/features/auth/api";
import { resetPasswordSchema } from "@/src/features/auth/lib/auth-form-schemas";
import { ResetPasswordFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { PasswordInput } from "@/src/shared/ui/shadcn/password-input";

type ResetPasswordFormProps = {
  initialEmail?: string;
  initialToken?: string;
};

export function ResetPasswordForm({
  initialEmail,
  initialToken,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasResetToken = Boolean(initialToken);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: initialEmail ?? "",
      password: "",
      passwordConfirmation: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      await resetPassword({
        ...values,
        token: initialToken ?? "",
      });
      toast.success("Пароль обновлен. Теперь можно войти.");
      router.push("/sign-in");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось обновить пароль."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
        Новый пароль
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Задайте новый пароль для аккаунта.
      </p>

      {!hasResetToken ? (
        <div className="mt-5 rounded-2xl border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
          Ссылка восстановления некорректна или устарела. Запросите новое
          письмо для сброса пароля.
        </div>
      ) : null}

      <form
        autoComplete="off"
        className="mt-7 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="reset-password-email">Email</Label>
          <Input
            id="reset-password-email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-[var(--danger)]">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reset-password-value">Новый пароль</Label>
          <PasswordInput
            id="reset-password-value"
            placeholder="Не менее 8 символов"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-[var(--danger)]">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reset-password-confirmation">Повторите пароль</Label>
          <PasswordInput
            id="reset-password-confirmation"
            placeholder="Повторите пароль"
            {...register("passwordConfirmation")}
          />
          {errors.passwordConfirmation ? (
            <p className="text-sm text-[var(--danger)]">
              {errors.passwordConfirmation.message}
            </p>
          ) : null}
        </div>

        <Button
          className="auth-primary-button w-full"
          disabled={!hasResetToken}
          type="submit"
        >
          {isSubmitting ? "Обновляем..." : "Обновить пароль"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Вернуться к{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-in">
          авторизации
        </Link>
      </p>
    </div>
  );
}
