"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getMe, useUserStore } from "@/src/entities/user";
import { signIn } from "@/src/features/auth/api";
import { signInSchema } from "@/src/features/auth/lib/auth-form-schemas";
import { SignInFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { FormField } from "@/src/shared/ui/form-field";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Input } from "@/src/shared/ui/shadcn/input";
import { PasswordInput } from "@/src/shared/ui/shadcn/password-input";

function getRedirectParam() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("redirectTo");
}

function resolveRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function SignInForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true);

    try {
      await signIn(values);
      const user = await getMe();
      setUser(user);
      toast.success("Вы вошли в аккаунт.");
      startTransition(() => {
        router.push(resolveRedirectPath(getRedirectParam()));
        router.refresh();
      });
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось выполнить вход."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
        Вход
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Введите данные, чтобы продолжить работу.
      </p>

      <form
        autoComplete="on"
        className="mt-7 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          error={errors.email?.message}
          id="sign-in-email"
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
          error={errors.password?.message}
          id="sign-in-password"
          label="Пароль"
          labelAction={(
            <Link
              className="text-sm font-semibold text-[var(--accent)]"
              href="/forgot-password"
            >
              Забыли пароль?
            </Link>
          )}
        >
          {(controlProps) => (
            <PasswordInput
              {...controlProps}
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
              {...register("password")}
            />
          )}
        </FormField>

        <Button
          className="auth-primary-button mt-1 w-full"
          disabled={isSubmitting || isPending}
          type="submit"
        >
          Войти
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Нет аккаунта на платформе?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-up">
          Создай его сейчас!
        </Link>
      </p>
    </div>
  );
}
