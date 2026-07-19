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
import { FormField } from "@/src/shared/ui/form-field";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
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
        autoComplete="on"
        className="mt-7 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          error={errors.email?.message}
          id="reset-password-email"
          label="Email"
        >
          {(controlProps) => (
            <Input
              {...controlProps}
              autoCapitalize="none"
              autoComplete="username"
              placeholder="you@example.com"
              required
              spellCheck={false}
              type="email"
              {...register("email")}
            />
          )}
        </FormField>

        <FormField
          description="Используйте не менее 8 символов."
          error={errors.password?.message}
          id="reset-password-value"
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
          id="reset-password-confirmation"
          label="Повторите пароль"
        >
          {(controlProps) => (
            <PasswordInput
              {...controlProps}
              autoComplete="new-password"
              placeholder="Повторите пароль"
              required
              {...register("passwordConfirmation")}
            />
          )}
        </FormField>

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
