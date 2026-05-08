"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { App, Button, Form, Input } from "antd";
import { resetPassword } from "@/src/features/auth/api";
import { ResetPasswordFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

type ResetPasswordFormProps = {
  initialEmail?: string;
  initialToken?: string;
};

export function ResetPasswordForm({
  initialEmail,
  initialToken,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [isPending, startTransition] = useTransition();
  const hasResetToken = Boolean(initialToken);

  const handleSubmit = (values: ResetPasswordFormValues) => {
    startTransition(async () => {
      try {
        await resetPassword({
          ...values,
          token: initialToken ?? "",
        });
        message.success("Пароль обновлен. Теперь можно войти.");
        router.push("/sign-in");
      } catch (error) {
        message.error(extractApiError(error, "Не удалось обновить пароль."));
      }
    });
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

      <Form<ResetPasswordFormValues>
        autoComplete="off"
        className="mt-7"
        initialValues={{
          email: initialEmail,
        }}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Укажите email." },
            { type: "email", message: "Введите корректный email." },
          ]}
        >
          <Input className="auth-input" placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          label="Новый пароль"
          name="password"
          rules={[
            { required: true, message: "Введите новый пароль." },
            { min: 8, message: "Минимум 8 символов." },
          ]}
        >
          <Input.Password
            className="auth-input"
            placeholder="Не менее 8 символов"
          />
        </Form.Item>

        <Form.Item
          dependencies={["password"]}
          label="Повторите пароль"
          name="passwordConfirmation"
          rules={[
            { required: true, message: "Повторите пароль." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Пароли не совпадают."));
              },
            }),
          ]}
        >
          <Input.Password
            className="auth-input"
            placeholder="Повторите пароль"
          />
        </Form.Item>

        <Button
          block
          className="auth-primary-button"
          disabled={!hasResetToken}
          htmlType="submit"
          loading={isPending}
          type="primary"
        >
          Обновить пароль
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Вернуться к{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-in">
          авторизации
        </Link>
      </p>
    </div>
  );
}
