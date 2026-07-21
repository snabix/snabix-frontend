"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getMe, useUserStore } from "@/src/entities/user";
import { signUp } from "@/src/features/auth/api";
import { signUpSchema } from "@/src/features/auth/lib/auth-form-schemas";
import { SignUpFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { FormField } from "@/src/shared/ui/form-field";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { PasswordInput } from "@/src/shared/ui/shadcn/password-input";

export function SignUpForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      acceptedTerms: true,
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);

    try {
      await signUp({
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });

      try {
        const user = await getMe();
        setUser(user);
        toast.success("Аккаунт создан. Проверьте почту для подтверждения.");
        startTransition(() => {
          router.push("/");
          router.refresh();
        });
      } catch {
        setUser(null);
        toast.success(
          "Аккаунт создан. Теперь войдите в систему и подтвердите почту.",
        );
        startTransition(() => {
          router.push("/sign-in");
          router.refresh();
        });
      }
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось создать аккаунт."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl mb-4 font-extrabold text-[var(--brand-deep)]">
        Регистрация
      </h1>

      <form
        autoComplete="on"
        className="mt-7 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          error={errors.email?.message}
          id="sign-up-email"
          label="Email"
        >
          {(controlProps) => (
            <Input
              {...controlProps}
              autoCapitalize="none"
              autoComplete="username"
              placeholder="team@company.ru"
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
          id="sign-up-password"
          label="Пароль"
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
          id="sign-up-password-confirmation"
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

        <div className="space-y-2">
          <Controller
            control={control}
            name="acceptedTerms"
            render={({ field }) => (
              <div className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                <Checkbox
                  aria-describedby={errors.acceptedTerms ? "accepted-terms-error" : undefined}
                  aria-invalid={errors.acceptedTerms ? true : undefined}
                  checked={field.value}
                  id="accepted-terms"
                  name={field.name}
                  onBlur={field.onBlur}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  ref={field.ref}
                  required
                />
                <Label htmlFor="accepted-terms">
                  Я принимаю условия платформы
                </Label>
              </div>
            )}
          />
          {errors.acceptedTerms ? (
            <p
              className="text-sm text-[var(--danger)]"
              id="accepted-terms-error"
              role="alert"
            >
              {errors.acceptedTerms.message}
            </p>
          ) : null}
        </div>

        <Button
          className="auth-primary-button w-full"
          disabled={isSubmitting || isPending}
          type="submit"
        >
          Создать аккаунт
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Уже есть аккаунт?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}
