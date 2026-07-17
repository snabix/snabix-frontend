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
        autoComplete="off"
        className="mt-7 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="sign-up-email">Email</Label>
          <Input
            id="sign-up-email"
            placeholder="team@company.ru"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-[var(--danger)]">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-up-password">Пароль</Label>
          <PasswordInput
            id="sign-up-password"
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
          <Label htmlFor="sign-up-password-confirmation">Повторите пароль</Label>
          <PasswordInput
            id="sign-up-password-confirmation"
            placeholder="Повторите пароль"
            {...register("passwordConfirmation")}
          />
          {errors.passwordConfirmation ? (
            <p className="text-sm text-[var(--danger)]">
              {errors.passwordConfirmation.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Controller
            control={control}
            name="acceptedTerms"
            render={({ field }) => (
              <label className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <span>Я принимаю условия платформы</span>
              </label>
            )}
          />
          {errors.acceptedTerms ? (
            <p className="text-sm text-[var(--danger)]">
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
